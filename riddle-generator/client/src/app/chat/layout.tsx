import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat – Genigma',
  description: 'Generate and solve unique AI-powered riddles in an interactive chat experience.',
};

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
