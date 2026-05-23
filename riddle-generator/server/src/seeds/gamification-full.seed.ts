import * as dotenv from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';
import { PrismaClient, QuestType, PvpStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Надійно підтягуємо змінні середовища з кореня папки server
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ Помилка: DATABASE_URL не знайдено у файлі .env!');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Використовуємо реальні UUID користувачів (вони підтверджені попередніми кроками сіду)
const USERS = {
  maryana: '8d82f7cc-507a-4454-ab69-4809e4767a33',
  john: 'd0eae986-dc98-4bd9-ac7f-c01d443d4b24',
  demo: '6b9f678d-aa4f-4d78-9061-34fb39046931',
  iryna: 'b9311d19-6885-4940-9291-53c8509cae64',
};

const now = new Date();
const todayEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 0));
const weekEnd = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // +4 дні до кінця спринту

async function main() {
  console.log('🚀 Початок повної гейміфікаційної популяції бази даних...');

  // --- 1. ДИНАМІЧНИЙ ПОШУК ЗАГАДОК З БАЗИ ДАНИХ ---
  // Замість статичних UUID, беремо реальні записи, які точно існують у вашій таблиці riddles
  const existingRiddles = await prisma.riddles.findMany({
    take: 3,
  });

  if (existingRiddles.length < 3) {
    console.error('❌ Помилка: Для повноцінного сіду в таблиці "riddles" має бути принаймні 3 загадки!');
    process.exit(1);
  }

  const riddleIds = {
    first: existingRiddles[0].id,
    second: existingRiddles[1].id,
    third: existingRiddles[2].id,
  };

  console.log(`🔍 Знайдено та адаптовано існуючі загадки для PvP: [${riddleIds.first}, ${riddleIds.second}, ${riddleIds.third}]`);

  // --- 2. ОЧИЩЕННЯ ТАБЛИЦЬ (Запобігання конфліктам дублікатів) ---
  await prisma.challengeSolver.deleteMany({});
  await prisma.communityChallenge.deleteMany({});
  await prisma.pvpMatch.deleteMany({});
  await prisma.userQuest.deleteMany({});
  await prisma.quest.deleteMany({});
  await prisma.solvedRiddle.deleteMany({});
  console.log('🧹 Нові гейміфікаційні таблиці успішно очищено перед заповненням.');

  // --- 3. ЗАДАЧІ ДНЯ (Daily Quests) ---
  const q1 = await prisma.quest.create({
    data: {
      title: 'Riddle Solver',
      description: 'Solve 2 classic riddles to prove your wit.',
      quest_type: QuestType.SOLVE_RIDDLES,
      target_count: 2,
      xp_reward: 50,
      expires_at: todayEnd,
      is_active: true,
    },
  });

  const q2 = await prisma.quest.create({
    data: {
      title: 'Visual Thinker',
      description: 'Create an AI visual riddle to challenge others.',
      quest_type: QuestType.EARN_XP,
      target_count: 100,
      xp_reward: 70,
      expires_at: todayEnd,
      is_active: true,
    },
  });

  const q3 = await prisma.quest.create({
    data: {
      title: 'Master of Math',
      description: 'Solve a math riddle to sharpen your numerical mind.',
      quest_type: QuestType.SOLVE_RIDDLES,
      target_count: 1,
      xp_reward: 40,
      expires_at: todayEnd,
      is_active: true,
    },
  });
  console.log('✅ 3 Щоденні квести успішно згенеровано.');

  // Наповнюємо прогрес для квестів
  await prisma.userQuest.createMany({
    data: [
      { user_id: USERS.maryana, quest_id: q1.id, progress: 1, is_completed: false },
      { user_id: USERS.maryana, quest_id: q2.id, progress: 0, is_completed: false },
      { user_id: USERS.maryana, quest_id: q3.id, progress: 1, is_completed: true, completed_at: now },
      { user_id: USERS.john, quest_id: q1.id, progress: 0, is_completed: false },
      { user_id: USERS.john, quest_id: q2.id, progress: 100, is_completed: true, completed_at: now },
      { user_id: USERS.john, quest_id: q3.id, progress: 0, is_completed: false },
    ],
  });

  // --- 4. ТИЖНЕВИЙ СПРИНТ (SolvedRiddle Logs для Лідерборду) ---
  const mockSolvedData = [
    { user_id: USERS.maryana, preview: 'Про давній замок та скляний трон...', xp: 80, daysAgo: 1 },
    { user_id: USERS.maryana, preview: 'Логічна загадка про кодовий замок', xp: 60, daysAgo: 2 },
    { user_id: USERS.john, preview: 'Математична головоломка з цифрами 4 та 7', xp: 100, daysAgo: 1 },
    { user_id: USERS.john, preview: 'Класична загадка про час та стрілки', xp: 50, daysAgo: 3 },
    { user_id: USERS.iryna, preview: 'Про давній замок та скляний трон...', xp: 90, daysAgo: 1 },
    { user_id: USERS.demo, preview: 'Данетка про пасажира в літаку', xp: 40, daysAgo: 2 },
  ];

  for (const log of mockSolvedData) {
    const logDate = new Date();
    logDate.setDate(now.getDate() - log.daysAgo);

    await prisma.solvedRiddle.create({
      data: {
        user_id: log.user_id,
        content_preview: log.preview,
        xp_earned: log.xp,
        at: logDate,
      },
    });
  }
  console.log('✅ Логи тижневого спринту лідерборду успішно сформовано.');

  // --- 5. ТИЖНЕВИЙ СУПЕР-ЧЕЛЕНДЖ (Community Challenge) ---
  const challenge = await prisma.communityChallenge.create({
    data: {
      title: 'The Great Convergence Puzzle',
      description: 'An elite global challenge requiring extensive computational logic. Only the top minds can decode it.',
      riddle_content: 'Математична головоломка з цифрами 4 та 7. Яке наступне число у послідовності convergence?',
      riddle_answer: '49',
      xp_reward: 150,
      starts_at: now,
      ends_at: weekEnd,
      is_active: true,
    },
  });
  console.log(`✅ Створено глобальний челендж тижня: "${challenge.title}"`);

  await prisma.challengeSolver.createMany({
    data: [
      { user_id: USERS.john, challenge_id: challenge.id, solved_at: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
      { user_id: USERS.iryna, challenge_id: challenge.id, solved_at: new Date(now.getTime() - 6 * 60 * 60 * 1000) },
    ],
  });
  console.log('✅ Заповнено список спідранерів для картки челенджу.');

  // --- 6. РЕЗУЛЬТАТИ PvP ДУЕЛЕЙ (Історія PvpMatch з реальними FK) ---

  // Матч 1: Перемога Мар'яни над John Doe
  await prisma.pvpMatch.create({
    data: {
      status: PvpStatus.FINISHED,
      creator_id: USERS.maryana,
      opponent_id: USERS.john,
      winner_id: USERS.maryana,
      riddle_id: riddleIds.first, // Динамічний ID
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      finished_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 45000),
    },
  });

  // Матч 2: Програш Мар'яни проти Iryna (Перемогла Ірина)
  await prisma.pvpMatch.create({
    data: {
      status: PvpStatus.FINISHED,
      creator_id: USERS.iryna,
      opponent_id: USERS.maryana,
      winner_id: USERS.iryna,
      riddle_id: riddleIds.second, // Динамічний ID
      created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      finished_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 120000),
    },
  });

  // Матч 3: Скасоване лобі від демо
  await prisma.pvpMatch.create({
    data: {
      status: PvpStatus.CANCELLED,
      creator_id: USERS.demo,
      opponent_id: USERS.maryana,
      riddle_id: riddleIds.third, // Динамічний ID
      created_at: new Date(now.getTime() - 3 * 360 * 60 * 1000),
      finished_at: new Date(now.getTime() - 3 * 350 * 60 * 1000),
    },
  });
  console.log('✅ Сформовано приватну історію PvP боїв з реальними реляціями загадок.');

  console.log('🌟 [УСПІХ] Базу даних Supabase повністю адаптовано та наповнено демонстраційними даними розширеної гейміфікації!');
}

main()
  .catch((e) => {
    console.error('❌ Критична помилка під час виконання повного сіду:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
