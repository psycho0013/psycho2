import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
    throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Supabase Admin Client - يستخدم Service Role Key
 * ⚠️ CRITICAL: هذا الكلاينت له صلاحيات كاملة على قاعدة البيانات!
 * استخدمه فقط للعمليات الإدارية الحساسة
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
