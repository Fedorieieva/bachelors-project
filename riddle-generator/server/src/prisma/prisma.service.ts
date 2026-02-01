import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
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
