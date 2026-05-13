'use server';

import { cookies } from 'next/headers';

const ONE_YEAR = 365 * 24 * 60 * 60;

export async function setLocale(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', locale, {
    maxAge: ONE_YEAR,
    path: '/',
    sameSite: 'lax',
  });
}