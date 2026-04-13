-- ========================================
-- SmartTashkhees In-App Notifications
-- ========================================

-- جدول الإشعارات الرئيسي
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'update', 'alert', 'promo')),
    created_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- جدول حالة قراءة الإشعار لكل مستخدم (اختياري - للمستقبل)
-- لو تريد تتبع من قرأ ومن ما قرأ لكل مستخدم مسجّل
-- CREATE TABLE IF NOT EXISTS notification_reads (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
--     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--     read_at TIMESTAMPTZ DEFAULT now(),
--     UNIQUE(notification_id, user_id)
-- );

-- السماح بقراءة الإشعارات للجميع (عام)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active notifications"
    ON notifications FOR SELECT
    USING (is_active = true);

-- السماح بإضافة/تعديل/حذف الإشعارات فقط عبر service_role (الأدمن)
-- أو يمكنك إضافة سياسة للمشرفين إذا تستخدم جدول admins
CREATE POLICY "Service role can manage notifications"
    ON notifications FOR ALL
    USING (true)
    WITH CHECK (true);

-- فهرس لتسريع الاستعلامات
CREATE INDEX idx_notifications_active ON notifications(is_active, created_at DESC);
