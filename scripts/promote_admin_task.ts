import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

async function run() {
    console.log('Attempting to promote user kkyydd2@naver.com to admin...');

    // 1. Check if profile exists
    const { data: profiles, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'kkyydd2@naver.com');

    if (findError) {
        console.error('Error finding profile:', findError);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.error('Profile not found for kkyydd2@naver.com. User might not have signed up yet.');
        return;
    }

    // 2. Update role
    const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', 'kkyydd2@naver.com')
        .select();

    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Success! User promoted to admin:', data);
    }
}

run();
