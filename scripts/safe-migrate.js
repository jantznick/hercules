import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function safeMigrate() {
  console.log('Running database migrations...');

  try {
    execSync('npx prisma migrate deploy --schema=prisma/schema.prisma', {
      stdio: 'inherit',
      cwd: root,
      env: process.env,
    });
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : error);
    return false;
  }
}

const success = safeMigrate();
process.exit(success ? 0 : 1);
