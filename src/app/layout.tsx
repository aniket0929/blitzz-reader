import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReaderProvider } from '@/context/ReaderContext';
import IntroSplash from '@/components/IntroSplash';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Reading But Better',
  description: 'Speed read any book with RSVP and reading modes.',
  icons: {
    icon: '/assets/logo-mini.svg',
    apple: '/assets/logo-mini.svg',
    shortcut: '/assets/logo-mini.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ReaderProvider>
          <IntroSplash>{children}</IntroSplash>
        </ReaderProvider>
        <Analytics/>
      </body>
    </html>
  );
}
