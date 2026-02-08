require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbPassword = process.env.SUPABASE_DB_PASSWORD;
const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.split('.')[0].replace('https://', '') : '';
// const connectionString = ... (removed unused)

if (!dbPassword || !projectId) {
    console.error('Error: SUPABASE_DB_PASSWORD or NEXT_PUBLIC_SUPABASE_URL is missing in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: `postgresql://postgres:${dbPassword}@db.${projectId}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected!');

        const schemaPath = path.join(__dirname, '../supabase/exam_schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await client.query(sql);
        console.log('Schema executed successfully!');

        // Verify
        const res = await client.query("SELECT to_regclass('public.exams');");
        console.log('Verification result:', res.rows[0]);

    } catch (err) {
        console.error('Database error:', err);
    } finally {
        await client.end();
    }
}

run();
