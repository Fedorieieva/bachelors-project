import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings – Genigma',
  description: 'Manage your Genigma account settings, display name, password, and preferences.',
};

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
