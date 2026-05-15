import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In – Genigma',
  description: 'Sign in or create a Genigma account to start generating and solving AI-powered riddles.',
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
}