import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const logger = new Logger('DatabaseBackup');
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
    process.exit(1);
  }

  if (stderr) {
    logger.warn('⚠️ pg_dump warning:', stderr);
  }

  logger.log('✅ Backup created:', backupFile);
  process.exit(0);
});
