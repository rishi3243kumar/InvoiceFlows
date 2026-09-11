import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Starfield from '@/components/Starfield';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'InvoiceFlow | Zero-Knowledge Confidential Invoice Trust Protocol on Midnight',
  description: 'Confidential credentials, selective disclosure, and double-financing prevention powered by Midnight Network Compact ZK circuits.',
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
