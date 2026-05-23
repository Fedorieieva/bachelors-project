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

// Конфігуруємо підключення для Prisma 7 з PostgreSQL адаптером
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Старт заповнення даних для Weekly Sprint ---');

  // 1. Отримуємо список усіх наявних користувачів у базі даних
  const existingUsers = await prisma.user.findMany({
    take: 5, // Беремо перших 5 існуючих користувачів для лідерборду
  });

  if (existingUsers.length === 0) {
    console.log('Помилка: У базі даних немає користувачів. Перевірте таблицю "users".');
    return;
  }

  console.log(`Знайдено ${existingUsers.length} існуючих користувачів для симуляції спринту.`);

  // 2. Очищаємо попередні записи про розв'язані загадки за точним полем user_id
  await prisma.solvedRiddle.deleteMany({
    where: {
      user_id: { in: existingUsers.map((u) => u.id) },
    },
  });

  // Шаблони переглядів для ігрової історії
  const riddlePreviews = [
    'Про давній замок та скляний трон...',
    'Математична головоломка з цифрами 4 та 7',
    'Логічна загадка про кодовий замок',
    'Данетка про пасажира в літаку',
    'Класична загадка про час та стрілки',
  ];

  // Масив балів для розподілу місць на лідерборді
  const xpDistribution = [40, 20, 60, 80, 100];

  // 3. Наповнюємо таблицю solved_riddles для кожного існуючого юзера за схемою бази
  for (let i = 0; i < existingUsers.length; i++) {
    const user = existingUsers[i];

    // Кожному користувачу додамо від 1 до 2 розв'язаних загадок за поточний тиждень
    const itemsToCreate = Math.min(2, i + 1);

    for (let j = 0; j < itemsToCreate; j++) {
      const xpEarned = xpDistribution[(i + j) % xpDistribution.length];
      const preview = riddlePreviews[(i + j) % riddlePreviews.length];

      // Створюємо нову дату без мутації, щоб гарантовано лишатися в межах поточного тижня травня 2026
      const dateAt = new Date();
      dateAt.setDate(dateAt.getDate() - (j + 1));

      // Використовуємо аргументи, які вимагає твій Prisma Client: user_id, content_preview, xp_earned
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
    await pool.end(); // Чисто закриваємо пул, щоб завершити Node-процес
  });
