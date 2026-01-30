import './globals.css';
import '../styles/fonts.css';
import ClientProviders from '@/components/providers/ClientProviders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trial'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
