import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Melqo - Earn Crypto by Mining',
  description: 'Join Melqo Mining Game. Buy miners, build your empire, and earn real cryptocurrency daily. A fun and rewarding ecosystem.',
  keywords: 'mining game, earn crypto, play to earn, melqo, bitcoin, usdt',
  openGraph: {
    title: 'Melqo - Earn Crypto by Mining',
    description: 'Join Melqo Mining Game. Buy miners, build your empire, and earn real cryptocurrency daily.',
    url: 'https://melqo.app',
    siteName: 'Melqo',
    images: [
      {
        url: '/images/bg-landscape.jpg', // Using existing background for og
        width: 1200,
        height: 630,
        alt: 'Melqo Mining Environment',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Melqo - Earn Crypto by Mining',
    description: 'Start your mining adventure today and earn real crypto.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
