import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile – Genigma',
  description: 'View a Genigma user profile, their public riddles, followers, and activity.',
};

export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
