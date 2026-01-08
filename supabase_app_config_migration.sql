-- إنشاء جدول app_config لتخزين الإعدادات الحساسة
-- Create app_config table for storing sensitive settings

CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة تعليق على الجدول
COMMENT ON TABLE app_config IS 'Stores application configuration including secure settings like admin passwords';

-- إضافة الباسورد الافتراضي (اختياري - يمكنك حذف هذا السطر إذا تريد تتركه فارغ)
-- Default password: admin12345678
INSERT INTO app_config (key, value, description)
VALUES ('admin_vault_password', 'YWRtaW4xMjM0NTY3OA==', 'Admin vault access password (base64 encoded)')
ON CONFLICT (key) DO NOTHING;

-- إعداد RLS (Row Level Security) للأمان
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- السماح للـ authenticated users بالقراءة والكتابة
CREATE POLICY "Allow authenticated read" ON app_config
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated update" ON app_config
    FOR UPDATE TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert" ON app_config
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_app_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_app_config_timestamp();
