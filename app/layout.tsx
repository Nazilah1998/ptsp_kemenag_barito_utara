import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'PTSP Kemenag Barito Utara',
  description: 'Sistem PTSP Kemenag Barito Utara berbasis Next.js dan Supabase'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
