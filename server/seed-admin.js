// Usage: node server/seed-admin.js <email> <password>
// Example: node server/seed-admin.js admin@example.com mysecretpassword

import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const [,, email, password] = process.argv;

if (!email || !password) {
    console.error('Usage: node server/seed-admin.js <email> <password>');
    process.exit(1);
}

const pool = new pg.Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

const hash = await bcrypt.hash(password, 12);

await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hash]
);

console.log(`Admin user created/updated: ${email}`);
await pool.end();
