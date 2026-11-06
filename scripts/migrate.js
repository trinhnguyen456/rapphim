'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mysql = require('mysql2/promise');
const { connectionOptions } = require('../db/connection');
const { seedCatalog } = require('../db/seed');
const { hashPassword } = require('../server/security');

async function bootstrapAdmin(connection) {
  const [[{ count }]] = await connection.query("SELECT COUNT(*) AS count FROM users WHERE role='admin'");
  if (Number(count) > 0) return;

  const email = String(process.env.CINETIX_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.CINETIX_ADMIN_PASSWORD || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 256) {
    throw new Error('The initial Cinetix admin credentials are missing or invalid; provide a valid email and a password of at least 12 characters.');
  }

  const [existing] = await connection.execute('SELECT id FROM users WHERE email=? LIMIT 1', [email]);
  if (existing.length) throw new Error('The bootstrap admin email already belongs to a non-admin account; no role was changed.');

  const passwordHash = await hashPassword(password);
  await connection.execute(
    "INSERT INTO users (public_id,name,email,phone,password_hash,role,status) VALUES (?,?,?,?,?,'admin','active')",
    [`U-${crypto.randomUUID().replaceAll('-', '').slice(0, 30)}`, 'Quản trị Cinetix', email, '', passwordHash]);
}

async function main() {
  const connection = await mysql.createConnection(connectionOptions());
  let locked = false;
  try {
    await connection.query("SET SESSION time_zone = '+00:00'");
    const [[lockRow]] = await connection.query("SELECT GET_LOCK('cinetix_schema_seed_lock', 30) AS acquired");
    if (Number(lockRow.acquired) !== 1) throw new Error('Could not acquire the Cinetix migration lock.');
    locked = true;

    await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(120) NOT NULL PRIMARY KEY,
      checksum CHAR(64) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    const directory = path.join(__dirname, '..', 'db', 'migrations');
    const files = fs.readdirSync(directory).filter((file) => /^\d+_[a-z0-9_-]+\.sql$/i.test(file)).sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(directory, file), 'utf8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');
      const [[already]] = await connection.execute('SELECT checksum FROM schema_migrations WHERE version=?', [file]);
      if (already) {
        if (already.checksum !== checksum) throw new Error(`Applied migration ${file} was changed; create a new additive migration instead.`);
        continue;
      }

      const statements = sql.split(';').map((statement) => statement.trim()).filter(Boolean);
      for (const statement of statements) await connection.query(statement);
      await connection.execute('INSERT INTO schema_migrations (version,checksum) VALUES (?,?)', [file,checksum]);
    }

    await seedCatalog(connection);
    await bootstrapAdmin(connection);
  } finally {
    if (locked) await connection.query("SELECT RELEASE_LOCK('cinetix_schema_seed_lock')").catch(() => {});
    await connection.end();
  }
  console.log('Cinetix database schema and non-destructive seeds are ready.');
}

main().catch((error) => {
  console.error(`Cinetix database preparation failed: ${error.message}`);
  process.exitCode = 1;
});
