import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY is missing in environment variables.");
}

// Tạo kết nối đến database Supabase (server-side backend can use service role key if available)
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
