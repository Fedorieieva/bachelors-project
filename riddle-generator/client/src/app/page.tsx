import { Typography } from "@/components/atoms/Typography";
import { Header } from '@/components/organisms/Header/Header';
import React from 'react';

export default function Home() {
  return (
    <main className="flex flex-col gap-8">
      <Typography variant="h1">
        Вітаємо у Genigma!
      </Typography>

      <Typography variant="body" className="text-[#d3d3e9]">
        Тут буде ваш генератор загадок. Контент автоматично обмежений
        компонентом Container та адаптований під Сайдбар.
      </Typography>
    </main>
  );
}