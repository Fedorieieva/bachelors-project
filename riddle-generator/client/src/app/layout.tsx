import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.scss';
import MainLayout from './MainLayout';
import QueryProvider from '../providers/QueryProvider';
import StoreProvider from '@/providers/StoreProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased" nonce={nonce}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <QueryProvider>
              <ToastProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </ToastProvider>
            </QueryProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}