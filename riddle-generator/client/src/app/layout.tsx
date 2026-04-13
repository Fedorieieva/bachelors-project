import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.scss';
import MainLayout from './MainLayout';
import QueryProvider from '../providers/QueryProvider';
import StoreProvider from '@/providers/StoreProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-main',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-second',
});

export const metadata: Metadata = {
  title: 'Genigma - Riddle Generator',
  description: 'AI-powered riddle generator application',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="uk" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          <QueryProvider>
            <ToastProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </ToastProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}