-- ═══════════════════════════════════════════════════════════════════════════
-- نظام التشخيص الذكي المحسّن - Supabase Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- تفعيل pgvector extension للـ embeddings
-- ملاحظة: قد تحتاج لتفعيلها من Dashboard > Extensions
-- CREATE EXTENSION IF NOT EXISTS vector;

-- ═══════════════════════════════════════════════════════════════════════════
-- جدول علاقات الأمراض المزمنة
-- يربط بين الأمراض المزمنة والمضاعفات المحتملة
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS chronic_disease_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chronic_disease TEXT NOT NULL UNIQUE,
    chronic_disease_ar TEXT NOT NULL,
    related_conditions TEXT[] DEFAULT '{}',
    related_conditions_ar TEXT[] DEFAULT '{}',
    symptoms_to_watch TEXT[] DEFAULT '{}',
    symptoms_to_watch_ar TEXT[] DEFAULT '{}',
    risk_increase_factor DECIMAL(3,2) DEFAULT 1.5,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج البيانات الأولية للأمراض المزمنة الشائعة
INSERT INTO chronic_disease_correlations (chronic_disease, chronic_disease_ar, related_conditions, related_conditions_ar, symptoms_to_watch, symptoms_to_watch_ar, risk_increase_factor) VALUES
(
    'diabetes',
    'السكري',
    ARRAY['Diabetic Neuropathy', 'Diabetic Retinopathy', 'Diabetic Foot Ulcers', 'Cardiovascular Disease', 'Kidney Disease'],
    ARRAY['اعتلال الأعصاب السكري', 'اعتلال الشبكية السكري', 'قرحة القدم السكرية', 'أمراض القلب والأوعية الدموية', 'أمراض الكلى'],
    ARRAY['numbness', 'tingling', 'slow healing wounds', 'frequent urination', 'blurred vision', 'foot pain'],
    ARRAY['تنميل', 'وخز', 'بطء التئام الجروح', 'تبول متكرر', 'عدم وضوح الرؤية', 'ألم القدم'],
    2.0
),
(
    'hypertension',
    'ارتفاع ضغط الدم',
    ARRAY['Stroke', 'Heart Attack', 'Heart Failure', 'Kidney Disease', 'Vision Problems'],
    ARRAY['السكتة الدماغية', 'النوبة القلبية', 'فشل القلب', 'أمراض الكلى', 'مشاكل الرؤية'],
    ARRAY['severe headache', 'chest pain', 'shortness of breath', 'dizziness', 'vision changes'],
    ARRAY['صداع شديد', 'ألم الصدر', 'ضيق التنفس', 'دوخة', 'تغيرات في الرؤية'],
    1.8
),
(
    'heart_disease',
    'أمراض القلب',
    ARRAY['Heart Attack', 'Heart Failure', 'Arrhythmia', 'Pulmonary Edema'],
    ARRAY['النوبة القلبية', 'فشل القلب', 'اضطراب نظم القلب', 'وذمة رئوية'],
    ARRAY['chest pain', 'shortness of breath', 'fatigue', 'swollen legs', 'rapid heartbeat'],
    ARRAY['ألم الصدر', 'ضيق التنفس', 'إرهاق', 'تورم الساقين', 'تسارع ضربات القلب'],
    2.5
),
(
    'asthma',
    'الربو',
    ARRAY['Respiratory Failure', 'Pneumonia', 'Status Asthmaticus'],
    ARRAY['فشل تنفسي', 'التهاب رئوي', 'نوبة ربو حادة'],
    ARRAY['wheezing', 'coughing', 'shortness of breath', 'chest tightness'],
    ARRAY['صفير', 'سعال', 'ضيق التنفس', 'ضيق الصدر'],
    1.5
),
(
    'kidney_disease',
    'أمراض الكلى',
    ARRAY['Kidney Failure', 'Anemia', 'Bone Disease', 'Fluid Retention'],
    ARRAY['الفشل الكلوي', 'فقر الدم', 'أمراض العظام', 'احتباس السوائل'],
    ARRAY['swelling', 'fatigue', 'decreased urination', 'nausea', 'confusion'],
    ARRAY['تورم', 'إرهاق', 'قلة التبول', 'غثيان', 'ارتباك'],
    1.7
),
(
    'thyroid_disorders',
    'اضطرابات الغدة الدرقية',
    ARRAY['Heart Problems', 'Osteoporosis', 'Infertility', 'Myxedema'],
    ARRAY['مشاكل القلب', 'هشاشة العظام', 'العقم', 'الوذمة المخاطية'],
    ARRAY['weight changes', 'fatigue', 'heart palpitations', 'hair loss', 'temperature sensitivity'],
    ARRAY['تغيرات الوزن', 'إرهاق', 'خفقان القلب', 'تساقط الشعر', 'حساسية الحرارة'],
    1.4
),
(
    'obesity',
    'السمنة',
    ARRAY['Type 2 Diabetes', 'Heart Disease', 'Sleep Apnea', 'Joint Problems', 'Fatty Liver'],
    ARRAY['السكري النوع الثاني', 'أمراض القلب', 'توقف التنفس أثناء النوم', 'مشاكل المفاصل', 'الكبد الدهني'],
    ARRAY['joint pain', 'shortness of breath', 'snoring', 'fatigue', 'back pain'],
    ARRAY['ألم المفاصل', 'ضيق التنفس', 'شخير', 'إرهاق', 'ألم الظهر'],
    1.6
);

-- ═══════════════════════════════════════════════════════════════════════════
-- إضافة حقل embedding لجدول الأعراض
-- يُستخدم للمطابقة الدلالية باستخدام OpenAI
-- ═══════════════════════════════════════════════════════════════════════════
-- ملاحظة: شغّل هذا فقط بعد تفعيل pgvector extension
-- ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- ═══════════════════════════════════════════════════════════════════════════
-- جدول قواعد شدة الأعراض الحرجة
-- يحدد الأعراض التي تتطلب اهتماماً عاجلاً عند شدتها العالية
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS symptom_severity_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symptom_id TEXT, -- اختياري: ربط مع جدول symptoms إذا أردت
    symptom_name TEXT NOT NULL,
    symptom_name_ar TEXT NOT NULL,
    severity_level TEXT NOT NULL CHECK (severity_level IN ('mild', 'moderate', 'severe')),
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
    possible_conditions TEXT[] DEFAULT '{}',
    possible_conditions_ar TEXT[] DEFAULT '{}',
    recommended_action TEXT,
    recommended_action_ar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج قواعد الشدة للأعراض الحرجة
INSERT INTO symptom_severity_rules (symptom_name, symptom_name_ar, severity_level, urgency_level, possible_conditions, possible_conditions_ar, recommended_action, recommended_action_ar) VALUES
-- ألم الصدر
('chest_pain', 'ألم الصدر', 'mild', 'MEDIUM', 
    ARRAY['Muscle strain', 'Anxiety', 'GERD'], 
    ARRAY['شد عضلي', 'قلق', 'ارتجاع المريء'],
    'Monitor symptoms, rest, consider seeing a doctor if persists',
    'راقب الأعراض، استرح، استشر طبيباً إذا استمرت'),
('chest_pain', 'ألم الصدر', 'moderate', 'HIGH', 
    ARRAY['Angina', 'Pleurisy', 'Costochondritis'], 
    ARRAY['ذبحة صدرية', 'التهاب الجنب', 'التهاب غضروف القفص الصدري'],
    'Seek medical attention within 24 hours',
    'راجع طبيباً خلال 24 ساعة'),
('chest_pain', 'ألم الصدر', 'severe', 'EMERGENCY', 
    ARRAY['Heart Attack', 'Pulmonary Embolism', 'Aortic Dissection'], 
    ARRAY['نوبة قلبية', 'انصمام رئوي', 'تسلخ الأبهر'],
    'Call emergency services immediately (911). Do not drive yourself.',
    'اتصل بالطوارئ فوراً. لا تقُد بنفسك.'),

-- ضيق التنفس
('shortness_of_breath', 'ضيق التنفس', 'mild', 'LOW', 
    ARRAY['Anxiety', 'Mild asthma', 'Deconditioning'], 
    ARRAY['قلق', 'ربو خفيف', 'قلة اللياقة'],
    'Rest, practice breathing exercises, monitor',
    'استرح، مارس تمارين التنفس، راقب الحالة'),
('shortness_of_breath', 'ضيق التنفس', 'moderate', 'HIGH', 
    ARRAY['Asthma attack', 'Pneumonia', 'COPD exacerbation'], 
    ARRAY['نوبة ربو', 'التهاب رئوي', 'تفاقم مرض الانسداد الرئوي'],
    'Seek medical care today, use rescue inhaler if available',
    'راجع طبيباً اليوم، استخدم البخاخ إن توفر'),
('shortness_of_breath', 'ضيق التنفس', 'severe', 'EMERGENCY', 
    ARRAY['Severe asthma attack', 'Heart failure', 'Pulmonary embolism'], 
    ARRAY['نوبة ربو شديدة', 'فشل القلب', 'انصمام رئوي'],
    'Call emergency services immediately. Sit upright.',
    'اتصل بالطوارئ فوراً. اجلس بشكل مستقيم.'),

-- صداع
('headache', 'صداع', 'mild', 'LOW', 
    ARRAY['Tension headache', 'Dehydration', 'Eye strain'], 
    ARRAY['صداع التوتر', 'جفاف', 'إجهاد العين'],
    'Rest, hydrate, take OTC pain reliever',
    'استرح، اشرب ماء، تناول مسكن بسيط'),
('headache', 'صداع', 'moderate', 'MEDIUM', 
    ARRAY['Migraine', 'Sinusitis', 'Hypertension'], 
    ARRAY['الشقيقة', 'التهاب الجيوب الأنفية', 'ارتفاع الضغط'],
    'Consider seeing a doctor, especially if recurring',
    'استشر طبيباً، خاصة إذا كان متكرراً'),
('headache', 'صداع', 'severe', 'EMERGENCY', 
    ARRAY['Stroke', 'Meningitis', 'Brain hemorrhage', 'Aneurysm'], 
    ARRAY['سكتة دماغية', 'التهاب السحايا', 'نزيف دماغي', 'تمدد الأوعية الدموية'],
    'Sudden severe headache (thunderclap) requires immediate emergency care. Call 911.',
    'الصداع الشديد المفاجئ يتطلب رعاية طارئة فورية. اتصل بالطوارئ.'),

-- ألم البطن
('abdominal_pain', 'ألم البطن', 'mild', 'LOW', 
    ARRAY['Gas', 'Indigestion', 'Muscle strain'], 
    ARRAY['غازات', 'عسر هضم', 'شد عضلي'],
    'Rest, avoid heavy food, monitor',
    'استرح، تجنب الطعام الثقيل، راقب الحالة'),
('abdominal_pain', 'ألم البطن', 'moderate', 'MEDIUM', 
    ARRAY['Gastritis', 'Gallstones', 'UTI'], 
    ARRAY['التهاب المعدة', 'حصى المرارة', 'التهاب المسالك البولية'],
    'See a doctor within 1-2 days',
    'راجع طبيباً خلال يوم أو يومين'),
('abdominal_pain', 'ألم البطن', 'severe', 'EMERGENCY', 
    ARRAY['Appendicitis', 'Pancreatitis', 'Bowel obstruction', 'Ruptured organ'], 
    ARRAY['التهاب الزائدة', 'التهاب البنكرياس', 'انسداد الأمعاء', 'تمزق عضو'],
    'Seek emergency care immediately, especially with fever or vomiting',
    'اذهب للطوارئ فوراً، خاصة مع الحمى أو القيء');

-- ═══════════════════════════════════════════════════════════════════════════
-- جدول سجل علاقات الأعراض (للتعلم المستقبلي)
-- يحفظ الأعراض التي تظهر معاً بشكل متكرر
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS symptom_cooccurrence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symptom_a TEXT NOT NULL,
    symptom_b TEXT NOT NULL,
    cooccurrence_count INTEGER DEFAULT 1,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(symptom_a, symptom_b)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Row Level Security Policies
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE chronic_disease_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_severity_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_cooccurrence ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة للجميع
CREATE POLICY "Allow public read chronic_disease_correlations" ON chronic_disease_correlations
    FOR SELECT USING (true);

CREATE POLICY "Allow public read symptom_severity_rules" ON symptom_severity_rules
    FOR SELECT USING (true);

CREATE POLICY "Allow public read symptom_cooccurrence" ON symptom_cooccurrence
    FOR SELECT USING (true);

-- سياسات الكتابة (للتطبيق فقط من خلال service role)
CREATE POLICY "Allow service insert chronic_disease_correlations" ON chronic_disease_correlations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service update chronic_disease_correlations" ON chronic_disease_correlations
    FOR UPDATE USING (true);

CREATE POLICY "Allow service insert symptom_cooccurrence" ON symptom_cooccurrence
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service upsert symptom_cooccurrence" ON symptom_cooccurrence
    FOR UPDATE USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- Indexes للأداء
-- ═══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_chronic_disease ON chronic_disease_correlations(chronic_disease);
CREATE INDEX IF NOT EXISTS idx_symptom_severity ON symptom_severity_rules(symptom_name, severity_level);
CREATE INDEX IF NOT EXISTS idx_symptom_cooccurrence ON symptom_cooccurrence(symptom_a, symptom_b);
