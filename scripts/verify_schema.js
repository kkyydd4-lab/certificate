require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verify() {
    console.log('Verifying table existence...');

    const tablesToCheck = ['exams', 'questions', 'exam_questions', 'exam_submissions'];
    let allExist = true;

    for (const table of tablesToCheck) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            console.error(`❌ Table '${table}' check failed:`, error.message);
            allExist = false;
        } else {
            console.log(`✅ Table '${table}' exists and is accessible.`);
        }
    }

    if (allExist) {
        console.log('\nSUCCESS: All required tables are present.');
    } else {
        console.log('\nFAILURE: Some tables are missing. Please ensure you ran the SQL script.');
    }
}

verify();
