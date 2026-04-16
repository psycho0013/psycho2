import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || '',
    {
        auth: {
            persistSession: true,        // حفظ الجلسة في localStorage
            detectSessionInUrl: true,     // التقاط tokens من الـ URL بعد OAuth redirect
            autoRefreshToken: true,       // تجديد الـ token تلقائياً
            storageKey: 'smarttashkhees-auth', // مفتاح ثابت لتخزين الجلسة
            flowType: 'pkce',             // أكثر أماناً ومتوافق مع الموبايل/PWA
        },
    }
);
