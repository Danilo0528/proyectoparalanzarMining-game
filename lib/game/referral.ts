export function buildReferralLink(origin: string, email: string): string {
  const base = origin || "https://melqo.app"
  return `${base}/?ref=${encodeURIComponent(email)}`
}
