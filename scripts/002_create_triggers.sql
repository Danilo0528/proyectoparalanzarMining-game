-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_code TEXT;
  referrer_uuid UUID;
BEGIN
  -- Generate unique referral code
  LOOP
    ref_code := generate_referral_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = ref_code);
  END LOOP;

  -- Check if there's a referral code in metadata
  IF new.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    SELECT id INTO referrer_uuid FROM public.profiles 
    WHERE referral_code = new.raw_user_meta_data->>'referred_by';
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, email, username, referral_code, referred_by, balance)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    ref_code,
    referrer_uuid,
    500 -- Starting balance
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create initial island progress (first island unlocked)
  INSERT INTO public.user_islands (user_id, island_id, unlocked)
  VALUES 
    (new.id, 1, true),
    (new.id, 2, false),
    (new.id, 3, false),
    (new.id, 4, false),
    (new.id, 5, false)
  ON CONFLICT (user_id, island_id) DO NOTHING;

  -- If referred, create referral records
  IF referrer_uuid IS NOT NULL THEN
    -- Level 1 referral (direct)
    INSERT INTO public.referrals (referrer_id, referred_id, level)
    VALUES (referrer_uuid, new.id, 1)
    ON CONFLICT DO NOTHING;

    -- Level 2 referral (referrer's referrer)
    INSERT INTO public.referrals (referrer_id, referred_id, level)
    SELECT referred_by, new.id, 2
    FROM public.profiles
    WHERE id = referrer_uuid AND referred_by IS NOT NULL
    ON CONFLICT DO NOTHING;

    -- Level 3 referral
    INSERT INTO public.referrals (referrer_id, referred_id, level)
    SELECT p2.referred_by, new.id, 3
    FROM public.profiles p1
    JOIN public.profiles p2 ON p1.referred_by = p2.id
    WHERE p1.id = referrer_uuid AND p2.referred_by IS NOT NULL
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN new;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
