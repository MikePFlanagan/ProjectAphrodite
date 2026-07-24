import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3002'),
  title: { default: 'Project Aphrodite', template: '%s · Project Aphrodite' },
  description:
    'Create personalized AI companions with memory, persistent conversations, and creator tools.',
  openGraph: {
    title: 'Project Aphrodite',
    description: 'Create personalized AI companions that remember you.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Project Aphrodite',
    description: 'Create personalized AI companions that remember you.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
