-- ═══════════════════════════════════════════════════════════════════════════
-- Dental CMS - Database Migration Script
-- نقل بيانات تشخيص الأسنان إلى Supabase
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. إنشاء جدول الأعراض
CREATE TABLE IF NOT EXISTS dental_symptoms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    category TEXT NOT NULL,
    severities TEXT[] DEFAULT ARRAY['mild', 'moderate', 'severe'],
    description TEXT,
    follow_up_questions TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. إنشاء جدول المشاكل
CREATE TABLE IF NOT EXISTS dental_problems (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT[],
    symptom_weights JSONB,
    severity_levels JSONB,
    urgency TEXT NOT NULL,
    urgency_message TEXT,
    treatments TEXT[],
    prevention TEXT[],
    emergency_signs TEXT[],
    warning TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- إدخال الأعراض
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO dental_symptoms (id, name, name_en, category, severities, description, follow_up_questions) VALUES
-- فئة: الألم
('pain_chewing', 'ألم عند المضغ', 'Pain when chewing', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم يظهر عند الضغط على السن أو المضغ', NULL),
('pain_cold', 'ألم مع البرودة', 'Cold sensitivity', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم عند تناول مشروبات أو أطعمة باردة', ARRAY['هل الألم يختفي مباشرة بعد زوال البرودة؟']),
('pain_hot', 'ألم مع الحرارة', 'Heat sensitivity', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم عند تناول مشروبات أو أطعمة ساخنة', ARRAY['هل الألم يستمر لفترة طويلة بعد زوال الحرارة؟']),
('pain_sweet', 'ألم مع الحلويات', 'Sweet sensitivity', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم عند تناول السكريات أو الحلويات', NULL),
('pain_spontaneous', 'ألم مستمر بدون سبب', 'Spontaneous pain', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم يظهر تلقائياً بدون محفز معين', NULL),
('pain_throbbing', 'ألم نابض (يخفق)', 'Throbbing pain', 'pain', ARRAY['moderate', 'severe'], 'ألم ينبض مع دقات القلب', NULL),
('pain_night', 'ألم يزداد ليلاً', 'Pain worse at night', 'pain', ARRAY['moderate', 'severe'], 'الألم يشتد عند النوم أو الاستلقاء', NULL),
('pain_spreading', 'ألم ينتشر للأذن أو الرأس', 'Radiating pain', 'pain', ARRAY['moderate', 'severe'], 'الألم يمتد للأذن أو الصدغ أو الرأس', NULL),
('pain_jaw', 'ألم في الفك', 'Jaw pain', 'pain', ARRAY['mild', 'moderate', 'severe'], 'ألم في منطقة الفك أو المفصل', NULL),

-- فئة: اللثة
('gum_bleeding', 'نزيف اللثة', 'Bleeding gums', 'gum', ARRAY['mild', 'moderate', 'severe'], 'نزيف عند التفريش أو تلقائي', ARRAY['هل يحدث النزيف عند التفريش فقط أم تلقائياً؟']),
('gum_swelling', 'تورم اللثة', 'Swollen gums', 'gum', ARRAY['mild', 'moderate', 'severe'], 'انتفاخ في اللثة حول السن', NULL),
('gum_redness', 'احمرار اللثة', 'Red gums', 'gum', ARRAY['mild', 'moderate', 'severe'], 'لون اللثة أحمر داكن بدلاً من الوردي', NULL),
('gum_recession', 'انحسار اللثة', 'Gum recession', 'gum', ARRAY['mild', 'moderate', 'severe'], 'ظهور جذر السن بسبب تراجع اللثة', NULL),
('gum_pus', 'خراج أو صديد', 'Abscess or pus', 'gum', ARRAY['moderate', 'severe'], 'تجمع صديد أو انتفاخ مؤلم في اللثة', NULL),
('gum_bad_breath', 'رائحة فم كريهة', 'Bad breath', 'gum', ARRAY['mild', 'moderate', 'severe'], 'رائحة نفس مستمرة لا تزول بالتفريش', NULL),
('gum_bad_taste', 'طعم سيء في الفم', 'Bad taste', 'gum', ARRAY['mild', 'moderate', 'severe'], 'طعم معدني أو كريه مستمر', NULL),

-- فئة: المظهر
('tooth_broken', 'سن مكسور أو متشقق', 'Broken or cracked tooth', 'appearance', ARRAY['mild', 'moderate', 'severe'], 'كسر أو شق في السن', NULL),
('tooth_discolored', 'تغير لون السن', 'Discolored tooth', 'appearance', ARRAY['mild', 'moderate', 'severe'], 'السن أصبح أصفر أو بني أو رمادي', NULL),
('tooth_hole', 'ثقب أو تجويف في السن', 'Visible cavity', 'appearance', ARRAY['mild', 'moderate', 'severe'], 'فتحة ظاهرة في سطح السن', NULL),
('filling_damaged', 'حشوة متضررة', 'Damaged filling', 'appearance', ARRAY['mild', 'moderate', 'severe'], 'حشوة سقطت أو مكسورة أو مؤلمة', NULL),
('tooth_loose', 'سن متحرك', 'Loose tooth', 'appearance', ARRAY['mild', 'moderate', 'severe'], 'السن يتحرك عند اللمس', ARRAY['هل كان هناك ضربة أو حادث؟']),
('facial_swelling', 'تورم في الوجه', 'Facial swelling', 'appearance', ARRAY['moderate', 'severe'], 'انتفاخ في الخد أو تحت الفك', NULL),

-- فئة: الوظيفة
('difficulty_opening', 'صعوبة فتح الفم', 'Difficulty opening mouth', 'function', ARRAY['mild', 'moderate', 'severe'], 'عدم القدرة على فتح الفم بالكامل', NULL),
('jaw_clicking', 'صوت طقطقة بالفك', 'Jaw clicking', 'function', ARRAY['mild', 'moderate'], 'صوت عند فتح أو إغلاق الفم', NULL),
('jaw_locking', 'تيبس الفك', 'Jaw stiffness', 'function', ARRAY['mild', 'moderate', 'severe'], 'شعور بتيبس أو قفل في الفك', NULL),
('teeth_grinding', 'صرير الأسنان (ليلاً)', 'Teeth grinding', 'function', ARRAY['mild', 'moderate', 'severe'], 'طحن الأسنان أثناء النوم', NULL),
('food_stuck', 'الطعام يعلق بين الأسنان', 'Food impaction', 'function', ARRAY['mild', 'moderate'], 'الطعام يتراكم بين الأسنان باستمرار', NULL),
('difficulty_swallowing', 'صعوبة في البلع', 'Difficulty swallowing', 'function', ARRAY['moderate', 'severe'], 'صعوبة في بلع الطعام أو الشراب', NULL),

-- فئة: أعراض عامة
('fever', 'حمى أو ارتفاع حرارة', 'Fever', 'general', ARRAY['mild', 'moderate', 'severe'], 'ارتفاع في درجة حرارة الجسم', NULL),
('lymph_swelling', 'تورم الغدد اللمفاوية', 'Swollen lymph nodes', 'general', ARRAY['mild', 'moderate', 'severe'], 'انتفاخ تحت الفك أو الرقبة', NULL),
('fatigue', 'تعب وإرهاق عام', 'General fatigue', 'general', ARRAY['mild', 'moderate', 'severe'], 'شعور بالتعب والإرهاق', NULL),
('numbness', 'تنميل في الشفاه أو اللسان', 'Numbness', 'general', ARRAY['mild', 'moderate', 'severe'], 'فقدان الإحساس في الشفاه أو اللسان', NULL);

-- ═══════════════════════════════════════════════════════════════════════════
-- إدخال المشاكل
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO dental_problems (id, name, name_en, description, symptoms, symptom_weights, severity_levels, urgency, urgency_message, treatments, prevention, emergency_signs, warning) VALUES

-- 1. تسوس الأسنان
('dental_caries', 'تسوس الأسنان', 'Dental Caries', 
'تلف في طبقة المينا والعاج نتيجة الأحماض التي تنتجها البكتيريا عند تحليل السكريات.',
ARRAY['pain_cold', 'pain_sweet', 'tooth_hole', 'food_stuck', 'pain_chewing', 'tooth_discolored'],
'{"tooth_hole": 100, "pain_sweet": 85, "pain_cold": 75, "food_stuck": 65, "pain_chewing": 60, "tooth_discolored": 50}',
'[{"level": "بسيط", "description": "تسوس سطحي في طبقة المينا - يحتاج حشوة بسيطة"}, {"level": "متوسط", "description": "تسوس وصل للعاج - حشوة عميقة"}, {"level": "شديد", "description": "تسوس وصل للعصب - يحتاج علاج عصب"}]',
'important', 'راجع طبيب الأسنان خلال أسبوع',
ARRAY['حشوة تجميلية (كومبوزيت)', 'حشوة فضية (أملغم)', 'علاج عصب + تاج (للحالات المتقدمة)'],
ARRAY['تفريش الأسنان مرتين يومياً بمعجون فلورايد', 'استخدام خيط الأسنان يومياً', 'تقليل تناول السكريات والمشروبات الغازية', 'زيارة طبيب الأسنان كل 6 أشهر للفحص والتنظيف'],
NULL, NULL),

-- 2. التهاب عصب السن
('pulpitis', 'التهاب عصب السن', 'Pulpitis',
'التهاب في لب السن (العصب) نتيجة تسوس عميق أو رضة، يسبب ألماً شديداً.',
ARRAY['pain_spontaneous', 'pain_throbbing', 'pain_night', 'pain_hot', 'pain_cold', 'pain_spreading'],
'{"pain_spontaneous": 95, "pain_throbbing": 90, "pain_night": 90, "pain_hot": 80, "pain_spreading": 75, "pain_cold": 60}',
'[{"level": "قابل للعلاج", "description": "الألم يختفي بعد زوال المحفز - قد يُحفظ العصب"}, {"level": "غير قابل للعلاج", "description": "ألم مستمر تلقائي - يحتاج سحب عصب"}]',
'urgent', 'راجع طبيب الأسنان خلال 24-48 ساعة',
ARRAY['علاج عصب (Root Canal Treatment)', 'حشوة مؤقتة للتهدئة', 'تاج بعد علاج العصب لحماية السن'],
ARRAY['علاج التسوس مبكراً قبل وصوله للعصب', 'استخدام واقي الأسنان عند ممارسة الرياضة', 'تجنب مضغ الأشياء الصلبة'],
ARRAY['ألم شديد لا يستجيب للمسكنات', 'تورم في الوجه', 'حمى مصاحبة'], NULL),

-- 3. التهاب اللثة
('gingivitis', 'التهاب اللثة', 'Gingivitis',
'التهاب في أنسجة اللثة نتيجة تراكم البلاك والجير، وهو قابل للعلاج والشفاء التام.',
ARRAY['gum_bleeding', 'gum_redness', 'gum_swelling', 'gum_bad_breath'],
'{"gum_bleeding": 90, "gum_redness": 80, "gum_swelling": 75, "gum_bad_breath": 60}',
'[{"level": "خفيف", "description": "احمرار بسيط ونزيف عند التفريش"}, {"level": "متوسط", "description": "تورم واضح ونزيف متكرر"}, {"level": "شديد", "description": "التهاب حاد قد يتطور لأمراض دواعم السن"}]',
'routine', 'راجع طبيب الأسنان خلال أسبوعين',
ARRAY['تنظيف الجير المحترف (Scaling)', 'تحسين نظافة الفم المنزلية', 'غسول فم مضاد للبكتيريا'],
ARRAY['تفريش الأسنان مرتين يومياً', 'استخدام خيط الأسنان يومياً', 'تنظيف الجير كل 6 أشهر', 'الإقلاع عن التدخين'],
NULL, NULL),

-- 4. أمراض دواعم السن
('periodontitis', 'أمراض دواعم السن', 'Periodontitis',
'مرض متقدم يصيب الأنسجة الداعمة للأسنان (اللثة، العظم، الأربطة)، قد يؤدي لفقدان الأسنان.',
ARRAY['gum_recession', 'tooth_loose', 'gum_pus', 'gum_bleeding', 'gum_bad_breath', 'gum_bad_taste'],
'{"tooth_loose": 100, "gum_recession": 90, "gum_pus": 85, "gum_bleeding": 70, "gum_bad_breath": 60, "gum_bad_taste": 55}',
'[{"level": "مبكر", "description": "جيوب لثوية 4-5 ملم مع فقد عظمي بسيط"}, {"level": "متوسط", "description": "جيوب 5-7 ملم مع تحرك بسيط بالأسنان"}, {"level": "متقدم", "description": "جيوب أكثر من 7 ملم مع تحرك واضح"}]',
'important', 'راجع طبيب الأسنان المتخصص خلال أسبوع',
ARRAY['تنظيف عميق (Scaling and Root Planing)', 'علاج جراحي للثة في الحالات المتقدمة', 'مضادات حيوية موضعية أو جهازية'],
ARRAY['علاج التهاب اللثة مبكراً', 'المتابعة الدورية مع طبيب الأسنان', 'السيطرة على السكري', 'الإقلاع عن التدخين'],
NULL, 'إذا لم يُعالج، قد يؤدي لفقدان الأسنان وتأثيرات على الصحة العامة'),

-- 5. خراج الأسنان
('dental_abscess', 'خراج الأسنان', 'Dental Abscess',
'تجمع صديدي نتيجة عدوى بكتيرية في السن أو اللثة، حالة خطيرة تتطلب علاجاً فورياً.',
ARRAY['pain_throbbing', 'facial_swelling', 'fever', 'gum_pus', 'gum_bad_taste', 'lymph_swelling', 'pain_spontaneous'],
'{"facial_swelling": 100, "gum_pus": 95, "fever": 90, "pain_throbbing": 85, "lymph_swelling": 80, "gum_bad_taste": 60, "pain_spontaneous": 55}',
'[{"level": "موضعي", "description": "خراج محدود حول السن"}, {"level": "منتشر", "description": "انتشار العدوى للأنسجة المحيطة"}]',
'emergency', 'راجع طبيب الأسنان اليوم أو اذهب للطوارئ!',
ARRAY['تصريف الخراج', 'مضادات حيوية', 'علاج عصب أو خلع السن حسب الحالة'],
ARRAY['علاج التسوس مبكراً', 'عدم إهمال آلام الأسنان', 'نظافة الفم الجيدة'],
ARRAY['صعوبة في التنفس أو البلع', 'تورم يمتد للرقبة أو العين', 'حمى عالية', 'عدم القدرة على فتح الفم'],
'إذا كان هناك صعوبة بالتنفس أو البلع، اذهب للطوارئ فوراً!'),

-- 6. حساسية الأسنان
('tooth_sensitivity', 'حساسية الأسنان', 'Tooth Sensitivity',
'ألم قصير وحاد عند تعرض الأسنان لمحفزات معينة مثل البرودة أو الحرارة أو الحلو.',
ARRAY['pain_cold', 'pain_hot', 'pain_sweet', 'gum_recession'],
'{"pain_cold": 90, "pain_hot": 70, "pain_sweet": 65, "gum_recession": 60}',
'[{"level": "خفيف", "description": "حساسية عرضية لمحفزات قوية"}, {"level": "متوسط", "description": "حساسية متكررة تؤثر على الأكل"}, {"level": "شديد", "description": "حساسية مستمرة حتى للهواء"}]',
'routine', 'راجع طبيب الأسنان لتحديد السبب',
ARRAY['معجون أسنان للحساسية', 'فلورايد موضعي', 'علاج انحسار اللثة', 'حشوات للأسنان المتآكلة'],
ARRAY['استخدام فرشاة ناعمة', 'تجنب التفريش بقوة', 'تقليل الأطعمة الحمضية', 'استخدام واقي الأسنان إذا كنت تطحن أسنانك'],
NULL, NULL),

-- 7. مشاكل ضرس العقل
('impacted_wisdom', 'مشاكل ضرس العقل', 'Impacted Wisdom Tooth',
'ضرس العقل لا يجد مساحة كافية للبزوغ، مما يسبب ألماً والتهاباً.',
ARRAY['pain_jaw', 'difficulty_opening', 'gum_swelling', 'gum_bad_breath', 'pain_spreading', 'fever'],
'{"pain_jaw": 90, "difficulty_opening": 85, "gum_swelling": 80, "pain_spreading": 70, "gum_bad_breath": 55, "fever": 75}',
'[{"level": "التهاب التاج", "description": "التهاب اللثة المحيطة بضرس العقل"}, {"level": "انطمار جزئي", "description": "الضرس بارز جزئياً ويسبب مشاكل"}, {"level": "انطمار كامل", "description": "الضرس مدفون بالكامل ويضغط على الأسنان"}]',
'urgent', 'راجع طبيب الأسنان خلال 2-3 أيام',
ARRAY['مضادات حيوية للالتهاب الحاد', 'خلع جراحي لضرس العقل', 'متابعة فقط إذا بدون أعراض'],
ARRAY['الفحص الدوري بالأشعة', 'نظافة المنطقة الخلفية جيداً'],
NULL, NULL),

-- 8. اضطراب مفصل الفك
('tmj_disorder', 'اضطراب مفصل الفك', 'TMJ Disorder',
'مشاكل في المفصل الصدغي الفكي تسبب ألماً وصوت طقطقة وصعوبة في فتح الفم.',
ARRAY['jaw_clicking', 'pain_jaw', 'difficulty_opening', 'jaw_locking', 'pain_spreading', 'teeth_grinding'],
'{"jaw_clicking": 90, "pain_jaw": 85, "difficulty_opening": 80, "jaw_locking": 85, "pain_spreading": 65, "teeth_grinding": 70}',
'[{"level": "خفيف", "description": "طقطقة بدون ألم"}, {"level": "متوسط", "description": "ألم وطقطقة مع صعوبة عرضية بفتح الفم"}, {"level": "شديد", "description": "ألم مزمن وتيبس متكرر"}]',
'important', 'راجع متخصص في مفصل الفك',
ARRAY['واقي الأسنان الليلي (Night Guard)', 'علاج طبيعي للفك', 'تقليل التوتر والضغط النفسي', 'أدوية مضادة للالتهاب'],
ARRAY['تجنب فتح الفم بشكل واسع', 'تقليل مضغ العلكة', 'إدارة التوتر', 'عدم الضغط على الفك'],
NULL, NULL),

-- 9. سن مكسور
('broken_tooth', 'سن مكسور أو متشقق', 'Broken or Cracked Tooth',
'كسر أو شق في السن نتيجة رضة أو عض على شيء صلب.',
ARRAY['tooth_broken', 'pain_chewing', 'pain_cold', 'pain_hot'],
'{"tooth_broken": 100, "pain_chewing": 80, "pain_cold": 60, "pain_hot": 60}',
'[{"level": "شق سطحي", "description": "شق في المينا فقط، عادة لا يحتاج علاج"}, {"level": "كسر متوسط", "description": "كسر يصل للعاج، يحتاج حشوة أو تاج"}, {"level": "كسر عميق", "description": "كسر يصل للعصب، يحتاج علاج عصب أو خلع"}]',
'urgent', 'راجع طبيب الأسنان خلال 24-48 ساعة',
ARRAY['حشوة أو ترميم', 'تاج (Crown)', 'علاج عصب إذا وصل الكسر للعصب', 'خلع في الحالات الشديدة'],
ARRAY['استخدام واقي الأسنان عند الرياضة', 'تجنب مضغ الثلج أو الأشياء الصلبة', 'علاج صرير الأسنان'],
NULL, NULL),

-- 10. التهاب غطاء ضرس العقل
('pericoronitis', 'التهاب غطاء ضرس العقل', 'Pericoronitis',
'التهاب اللثة المحيطة بضرس العقل البارز جزئياً.',
ARRAY['gum_swelling', 'pain_chewing', 'difficulty_opening', 'gum_bad_taste', 'fever', 'lymph_swelling'],
'{"gum_swelling": 95, "difficulty_opening": 85, "pain_chewing": 80, "gum_bad_taste": 70, "fever": 75, "lymph_swelling": 70}',
'[{"level": "حاد", "description": "التهاب حاد مع ألم وتورم"}, {"level": "مزمن", "description": "التهابات متكررة"}]',
'urgent', 'راجع طبيب الأسنان خلال 24-48 ساعة',
ARRAY['مضادات حيوية', 'غسول فم مطهر', 'خلع ضرس العقل لمنع التكرار'],
ARRAY['نظافة منطقة ضرس العقل جيداً', 'خلع ضرس العقل المدفون قبل حدوث مشاكل'],
NULL, NULL);

-- ═══════════════════════════════════════════════════════════════════════════
-- تفعيل RLS (Row Level Security) - اختياري
-- ═══════════════════════════════════════════════════════════════════════════
-- ALTER TABLE dental_symptoms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE dental_problems ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة العامة
-- CREATE POLICY "Allow public read" ON dental_symptoms FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON dental_problems FOR SELECT USING (true);
