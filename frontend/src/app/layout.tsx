import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'InvoiceFlow | The Stellar Trust Layer for Invoice Financing',
  description: 'Trust-Verified, Duplicate-Safe, Fast & Low-Fee Invoice Financing built on the Stellar blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
