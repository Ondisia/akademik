/**
 * backend/seed.js — Development-only seed helper
 * This file is intentionally disabled from loading frontend mock JSON files.
 * Use secure data migration tooling for production database population.
 */

console.warn('WARNING: backend/seed.js has been disabled for production security.');
console.warn('Local JSON dummy datasets have been removed from the source tree to prevent data leakage.');
console.warn('If database initialization is required, use a safe migration or a dedicated production seed process.');

function seed() {
  console.error('Seed operation is disabled. No dummy data will be imported.');
  process.exit(1);
}

if (require.main === module) {
  seed();
}
