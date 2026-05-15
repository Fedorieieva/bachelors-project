import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed – Genigma',
  description: 'Browse and discover AI-generated riddles shared by the Genigma community.',
};

export default function SocialMediaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
