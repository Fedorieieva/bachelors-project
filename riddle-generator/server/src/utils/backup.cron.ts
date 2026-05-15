import 'dotenv/config';
import cron from 'node-cron';
import { exec } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseBackup');
cron.schedule('0 3 * * *', () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupDir = path.resolve(__dirname, '../../backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = `${backupDir}/backup_${timestamp}.sql`;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.error('❌ DATABASE_URL is not defined in .env');
    process.exit(1);
  }
  const command = `pg_dump "${databaseUrl}" > "${backupFile}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error('❌ Backup failed:', error.message);
      return;
    }

    if (stderr) {
      logger.warn('⚠️ pg_dump warning:', stderr);
    }

    logger.log('✅ Daily backup created:', backupFile);
  });
});
