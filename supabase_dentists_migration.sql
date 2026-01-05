-- ═══════════════════════════════════════════════════════════════
-- Dentists Table - جدول أطباء الأسنان
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS dentists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL DEFAULT 'general',
    city TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    map_url TEXT,
    image_url TEXT,
    rating DOUBLE PRECISION DEFAULT 5.0,
    experience_years INTEGER DEFAULT 0,
    working_hours TEXT DEFAULT '9:00 ص - 9:00 م',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- Sample Data - بيانات تجريبية
-- ═══════════════════════════════════════════════════════════════

-- أطباء بغداد
INSERT INTO dentists (id, name, specialization, city, clinic_name, address, phone, whatsapp, map_url, rating, experience_years, working_hours) VALUES
('dr_1', 'د. أحمد الكاظمي', 'general', 'baghdad', 'عيادة الابتسامة', 'الكرادة - شارع 52', '07801234567', '9647801234567', 'https://maps.google.com/?q=33.3128,44.3615', 4.8, 15, '9:00 ص - 8:00 م'),
('dr_2', 'د. سارة العبيدي', 'cosmetic', 'baghdad', 'مركز دنت بيوتي', 'المنصور - شارع الأميرات', '07712345678', '9647712345678', 'https://maps.google.com/?q=33.3225,44.3508', 4.9, 10, '10:00 ص - 9:00 م'),
('dr_3', 'د. علي الزبيدي', 'orthodontics', 'baghdad', 'عيادة التقويم المتقدم', 'زيونة - قرب مول بغداد', '07823456789', '9647823456789', 'https://maps.google.com/?q=33.3350,44.4200', 4.7, 12, '9:00 ص - 7:00 م');

-- أطباء الناصرية
INSERT INTO dentists (id, name, specialization, city, clinic_name, address, phone, whatsapp, map_url, rating, experience_years, working_hours) VALUES
('dr_4', 'د. حسين الناصري', 'general', 'nasiriyah', 'مركز الناصرية لطب الأسنان', 'الموظفين - قرب البريد', '07834567890', '9647834567890', 'https://maps.google.com/?q=31.0584,46.2587', 4.6, 20, '8:00 ص - 8:00 م'),
('dr_5', 'د. زينب الغريفي', 'pediatric', 'nasiriyah', 'عيادة أسنان الأطفال', 'حي الحسين - شارع المستشفى', '07845678901', '9647845678901', 'https://maps.google.com/?q=31.0520,46.2610', 4.8, 8, '9:00 ص - 6:00 م');

-- أطباء البصرة
INSERT INTO dentists (id, name, specialization, city, clinic_name, address, phone, whatsapp, map_url, rating, experience_years, working_hours) VALUES
('dr_6', 'د. محمد البصري', 'oral_surgery', 'basra', 'مركز جراحة الفم', 'العشار - شارع الكويت', '07856789012', '9647856789012', 'https://maps.google.com/?q=30.5085,47.7804', 4.9, 18, '8:00 ص - 4:00 م'),
('dr_7', 'د. فاطمة الموسوي', 'endodontics', 'basra', 'عيادة علاج الجذور', 'البصرة القديمة - قرب السوق', '07867890123', '9647867890123', 'https://maps.google.com/?q=30.4950,47.8150', 4.5, 7, '10:00 ص - 8:00 م');

-- أطباء كربلاء
INSERT INTO dentists (id, name, specialization, city, clinic_name, address, phone, whatsapp, map_url, rating, experience_years, working_hours) VALUES
('dr_8', 'د. كاظم الحسيني', 'prosthodontics', 'karbala', 'مركز التركيبات السنية', 'حي الحسين - قرب الحرم', '07878901234', '9647878901234', 'https://maps.google.com/?q=32.6160,44.0283', 4.7, 22, '9:00 ص - 9:00 م');

-- أطباء النجف
INSERT INTO dentists (id, name, specialization, city, clinic_name, address, phone, whatsapp, map_url, rating, experience_years, working_hours) VALUES
('dr_9', 'د. عباس الحكيم', 'periodontics', 'najaf', 'عيادة صحة اللثة', 'الحنانة - شارع المدارس', '07889012345', '9647889012345', 'https://maps.google.com/?q=31.9961,44.3157', 4.6, 14, '8:00 ص - 6:00 م');

-- ═══════════════════════════════════════════════════════════════
-- Enable RLS (Optional - for public access keep disabled)
-- ═══════════════════════════════════════════════════════════════
-- ALTER TABLE dentists ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read" ON dentists FOR SELECT USING (is_active = true);
