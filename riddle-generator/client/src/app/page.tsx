import React from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/social-media');
  return null;
}