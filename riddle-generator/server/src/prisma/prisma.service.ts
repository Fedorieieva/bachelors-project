import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const adapter = new PrismaPg(pgPool);

    super({
      adapter: adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
