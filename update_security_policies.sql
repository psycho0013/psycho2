-- 🔒 تحديث السياسات للحماية القصوى
-- نفذ هذا الكود في Supabase SQL Editor

-- 1. احذف السياسات القديمة (الضعيفة)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.security_keys;
DROP POLICY IF EXISTS "Enable write access for all users" ON public.security_keys;
DROP POLICY IF EXISTS "Anyone can read keys" ON public.security_keys;
DROP POLICY IF EXISTS "Only with admin secret can write" ON public.security_keys;

-- 2. سياسة القراءة: متاحة للجميع (عشان المرضى يقدرون يشفّرون بياناتهم)
CREATE POLICY "public_read_security_keys" 
ON public.security_keys 
FOR SELECT 
USING (true);

-- 3. سياسة الكتابة: فقط Service Role يقدر يكتب/يحذث/يحذف
-- أي محاولة من anon user أو authenticated user بدون service role راح تفشل
CREATE POLICY "service_role_only_write" 
ON public.security_keys 
FOR ALL 
USING (
  -- بس اللي يستخدم service_role يقدر يكتب
  auth.jwt() ->> 'role' = 'service_role'
);

-- ✅ الآن:
-- - أي شخص يقدر يقرأ public_key (للتشفير)
-- - بس Service Role (أنت فقط) تقدر تكتب مفاتيح جديدة
