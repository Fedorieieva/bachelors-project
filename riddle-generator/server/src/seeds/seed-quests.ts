import * as dotenv from 'dotenv';
import * as path from 'path';
import pg from 'pg';
import { PrismaClient, QuestType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Гарантовано підтягуємо .env з кореня папки server, де б WebStorm не запустив процес
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ Error: DATABASE_URL is missing in your .env file!');
  process.exit(1);
}

// Для Prisma 7 з PostgreSQL адаптером правильна ініціалізація виглядає так:
const pool = new pg.Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const USER_IDS = {
  user1: '8d82f7cc-507a-4454-ab69-4809e4767a33',
  user2: 'd0eae986-dc98-4bd9-ac7f-c01d443d4b24',
  user3: '6b9f678d-aa4f-4d78-9061-34fb39046931',
  user4: 'b9311d19-6885-4940-9291-53c8509cae64',
} as const;

function getTodayEndUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 0));
}

async function main(): Promise<void> {
  const expiresAt = getTodayEndUTC();
  const now = new Date();

  // Деактивуємо старі квести
  const { count: deactivated } = await prisma.quest.updateMany({
    where: { is_active: true },
    data: { is_active: false },
  });
  console.log(`Deactivated ${deactivated} previously active quest(s).`);

  // ─── СТВОРЕННЯ 3 ЩОДЕННИХ КВЕСТІВ ────────────────────────────

  const quest1 = await prisma.quest.create({
    data: {
      title: 'Riddle Solver',
      description: 'Solve 2 classic riddles to prove your wit.',
      quest_type: QuestType.SOLVE_RIDDLES,
      target_count: 2,
      xp_reward: 50,
      expires_at: expiresAt,
      is_active: true,
    },
  });

  const quest2 = await prisma.quest.create({
    data: {
      title: 'Visual Thinker',
      description: 'Create an AI visual riddle to challenge others.',
      quest_type: QuestType.GENERATE_IMAGE_RIDDLE,
      target_count: 1,
      xp_reward: 70,
      expires_at: expiresAt,
      is_active: true,
    },
  });

  const quest3 = await prisma.quest.create({
    data: {
      title: 'Master of Math',
      description: 'Solve a math riddle to sharpen your numerical mind.',
      quest_type: QuestType.SOLVE_MATH,
      target_count: 1,
      xp_reward: 40,
      expires_at: expiresAt,
      is_active: true,
    },
  });

  console.log(`Created quests: "${quest1.title}", "${quest2.title}", "${quest3.title}".`);

  // Очищення старого прогресу
  await prisma.userQuest.deleteMany({
    where: {
      user_id: { in: Object.values(USER_IDS) },
      quest_id: { in: [quest1.id, quest2.id, quest3.id] }
    }
  });

  // ─── USER 1 ──────────────────────────────────────────────────
  await prisma.userQuest.createMany({
    data: [
      { user_id: USER_IDS.user1, quest_id: quest1.id, progress: 1, is_completed: false },
      { user_id: USER_IDS.user1, quest_id: quest2.id, progress: 0, is_completed: false },
      { user_id: USER_IDS.user1, quest_id: quest3.id, progress: 1, is_completed: true, completed_at: now },
    ],
  });

  // ─── USER 2 ──────────────────────────────────────────────────
  await prisma.userQuest.createMany({
    data: [
      { user_id: USER_IDS.user2, quest_id: quest1.id, progress: 0, is_completed: false },
      { user_id: USER_IDS.user2, quest_id: quest2.id, progress: 1, is_completed: true, completed_at: now },
      { user_id: USER_IDS.user2, quest_id: quest3.id, progress: 0, is_completed: false },
    ],
  });

  // ─── USER 3 ──────────────────────────────────────────────────
  await prisma.userQuest.createMany({
    data: [
      { user_id: USER_IDS.user3, quest_id: quest1.id, progress: 1, is_completed: false },
      { user_id: USER_IDS.user3, quest_id: quest2.id, progress: 0, is_completed: false },
      { user_id: USER_IDS.user3, quest_id: quest3.id, progress: 1, is_completed: true, completed_at: now },
    ],
  });

  // ─── USER 4 ──────────────────────────────────────────────────
  await prisma.userQuest.createMany({
    data: [
      { user_id: USER_IDS.user4, quest_id: quest1.id, progress: 0, is_completed: false },
      { user_id: USER_IDS.user4, quest_id: quest2.id, progress: 1, is_completed: true, completed_at: now },
      { user_id: USER_IDS.user4, quest_id: quest3.id, progress: 1, is_completed: true, completed_at: now },
    ],
  });

  console.log('🚀 Gamification daily quests database seeded successfully for all production target users!');
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Закриваємо пул з'єднань, щоб процес Node.js завершився чисто
  });
