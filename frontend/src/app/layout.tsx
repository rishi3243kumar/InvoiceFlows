import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Starfield from '@/components/Starfield';
import { ToastProvider } from '@/components/Toast';

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
        <ToastProvider>
          <Starfield />
          <div className="container">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
