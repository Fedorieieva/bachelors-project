import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Динамічно знаходимо та підтягуємо файл .env з кореня серверної частини
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ Помилка: DATABASE_URL відсутній у файлі .env!');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Старт заповнення даних для Weekly Sprint ---');

  const existingUsers = await prisma.user.findMany({
    take: 5,
  });

  if (existingUsers.length === 0) {
    console.log('Помилка: У базі даних немає жодного користувача. Спочатку зареєструйтеся через інтерфейс.');
    return;
  }

  console.log(`Знайдено ${existingUsers.length} існуючих користувачів для симуляції спринту.`);

  await prisma.solvedRiddle.deleteMany({
    where: {
      user_id: { in: existingUsers.map((u) => u.id) },
    },
  });

  const now = new Date();
  const getPastDateInThisWeek = (daysAgo: number) => {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    return date;
  };

  const riddlePreviews = [
    'Про давній замок та скляний трон...',
    'Математична головоломка з цифрами 4 та 7',
    'Логічна загадка про кодовий замок',
    'Данетка про пасажира в літаку',
    'Класична загадка про час та стрілки',
  ];

  const xpDistribution = [40, 20, 60, 80, 100];

  for (let i = 0; i < existingUsers.length; i++) {
    const user = existingUsers[i];

    const itemsToCreate = Math.min(2, i + 1);

    for (let j = 0; j < itemsToCreate; j++) {
      const xpEarned = xpDistribution[(i + j) % xpDistribution.length];
      const preview = riddlePreviews[(i + j) % riddlePreviews.length];
      const dateAt = getPastDateInThisWeek(j + 1);

      await prisma.solvedRiddle.create({
        data: {
          user_id: user.id,
          content_preview: preview,
          xp_earned: xpEarned,
          at: dateAt,
        },
      });
    }

    console.log(`Додано записи спринту для користувача: ${user.name || user.email}`);
  }

  console.log('--- Базу даних успішно оновлено для щотижневого спринту! ---');
}

main()
  .catch((e) => {
    console.error('Помилка під час виконання сіду:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
