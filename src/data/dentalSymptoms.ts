/**
 * Dental Symptoms Database
 * قاعدة بيانات أعراض الأسنان
 */

import type { DentalSymptom, SymptomCategory } from '@/types/dental';

// فئات الأعراض
export const dentalSymptomCategories: { id: SymptomCategory; name: string; icon: string }[] = [
    { id: 'pain', name: 'الألم', icon: '😣' },
    { id: 'gum', name: 'اللثة', icon: '🩸' },
    { id: 'appearance', name: 'المظهر', icon: '👁️' },
    { id: 'function', name: 'الوظيفة', icon: '🍽️' },
    { id: 'general', name: 'أعراض عامة', icon: '🤒' },
];

// قائمة الأعراض
export const dentalSymptoms: DentalSymptom[] = [
    // ═══════════════════════════════════════════════════════════════
    // فئة: الألم
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'pain_chewing',
        name: 'ألم عند المضغ',
        name_en: 'Pain when chewing',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم يظهر عند الضغط على السن أو المضغ',
    },
    {
        id: 'pain_cold',
        name: 'ألم مع البرودة',
        name_en: 'Cold sensitivity',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم عند تناول مشروبات أو أطعمة باردة',
        followUpQuestions: ['هل الألم يختفي مباشرة بعد زوال البرودة؟'],
    },
    {
        id: 'pain_hot',
        name: 'ألم مع الحرارة',
        name_en: 'Heat sensitivity',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم عند تناول مشروبات أو أطعمة ساخنة',
        followUpQuestions: ['هل الألم يستمر لفترة طويلة بعد زوال الحرارة؟'],
    },
    {
        id: 'pain_sweet',
        name: 'ألم مع الحلويات',
        name_en: 'Sweet sensitivity',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم عند تناول السكريات أو الحلويات',
    },
    {
        id: 'pain_spontaneous',
        name: 'ألم مستمر بدون سبب',
        name_en: 'Spontaneous pain',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم يظهر تلقائياً بدون محفز معين',
    },
    {
        id: 'pain_throbbing',
        name: 'ألم نابض (يخفق)',
        name_en: 'Throbbing pain',
        category: 'pain',
        severities: ['moderate', 'severe'],
        description: 'ألم ينبض مع دقات القلب',
    },
    {
        id: 'pain_night',
        name: 'ألم يزداد ليلاً',
        name_en: 'Pain worse at night',
        category: 'pain',
        severities: ['moderate', 'severe'],
        description: 'الألم يشتد عند النوم أو الاستلقاء',
    },
    {
        id: 'pain_spreading',
        name: 'ألم ينتشر للأذن أو الرأس',
        name_en: 'Radiating pain',
        category: 'pain',
        severities: ['moderate', 'severe'],
        description: 'الألم يمتد للأذن أو الصدغ أو الرأس',
    },
    {
        id: 'pain_jaw',
        name: 'ألم في الفك',
        name_en: 'Jaw pain',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ألم في منطقة الفك أو المفصل',
    },

    // ═══════════════════════════════════════════════════════════════
    // فئة: اللثة
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'gum_bleeding',
        name: 'نزيف اللثة',
        name_en: 'Bleeding gums',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'نزيف عند التفريش أو تلقائي',
        followUpQuestions: ['هل يحدث النزيف عند التفريش فقط أم تلقائياً؟'],
    },
    {
        id: 'gum_swelling',
        name: 'تورم اللثة',
        name_en: 'Swollen gums',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'انتفاخ في اللثة حول السن',
    },
    {
        id: 'gum_redness',
        name: 'احمرار اللثة',
        name_en: 'Red gums',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'لون اللثة أحمر داكن بدلاً من الوردي',
    },
    {
        id: 'gum_recession',
        name: 'انحسار اللثة',
        name_en: 'Gum recession',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ظهور جذر السن بسبب تراجع اللثة',
    },
    {
        id: 'gum_pus',
        name: 'خراج أو صديد',
        name_en: 'Abscess or pus',
        category: 'gum',
        severities: ['moderate', 'severe'],
        description: 'تجمع صديد أو انتفاخ مؤلم في اللثة',
    },
    {
        id: 'gum_bad_breath',
        name: 'رائحة فم كريهة',
        name_en: 'Bad breath',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'رائحة نفس مستمرة لا تزول بالتفريش',
    },
    {
        id: 'gum_bad_taste',
        name: 'طعم سيء في الفم',
        name_en: 'Bad taste',
        category: 'gum',
        severities: ['mild', 'moderate', 'severe'],
        description: 'طعم معدني أو كريه مستمر',
    },

    // ═══════════════════════════════════════════════════════════════
    // فئة: المظهر
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'tooth_broken',
        name: 'سن مكسور أو متشقق',
        name_en: 'Broken or cracked tooth',
        category: 'appearance',
        severities: ['mild', 'moderate', 'severe'],
        description: 'كسر أو شق في السن',
    },
    {
        id: 'tooth_discolored',
        name: 'تغير لون السن',
        name_en: 'Discolored tooth',
        category: 'appearance',
        severities: ['mild', 'moderate', 'severe'],
        description: 'السن أصبح أصفر أو بني أو رمادي',
    },
    {
        id: 'tooth_hole',
        name: 'ثقب أو تجويف في السن',
        name_en: 'Visible cavity',
        category: 'appearance',
        severities: ['mild', 'moderate', 'severe'],
        description: 'فتحة ظاهرة في سطح السن',
    },
    {
        id: 'filling_damaged',
        name: 'حشوة متضررة',
        name_en: 'Damaged filling',
        category: 'appearance',
        severities: ['mild', 'moderate', 'severe'],
        description: 'حشوة سقطت أو مكسورة أو مؤلمة',
    },
    {
        id: 'tooth_loose',
        name: 'سن متحرك',
        name_en: 'Loose tooth',
        category: 'appearance',
        severities: ['mild', 'moderate', 'severe'],
        description: 'السن يتحرك عند اللمس',
        followUpQuestions: ['هل كان هناك ضربة أو حادث؟'],
    },
    {
        id: 'facial_swelling',
        name: 'تورم في الوجه',
        name_en: 'Facial swelling',
        category: 'appearance',
        severities: ['moderate', 'severe'],
        description: 'انتفاخ في الخد أو تحت الفك',
    },

    // ═══════════════════════════════════════════════════════════════
    // فئة: الوظيفة
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'difficulty_opening',
        name: 'صعوبة فتح الفم',
        name_en: 'Difficulty opening mouth',
        category: 'function',
        severities: ['mild', 'moderate', 'severe'],
        description: 'عدم القدرة على فتح الفم بالكامل',
    },
    {
        id: 'jaw_clicking',
        name: 'صوت طقطقة بالفك',
        name_en: 'Jaw clicking',
        category: 'function',
        severities: ['mild', 'moderate'],
        description: 'صوت عند فتح أو إغلاق الفم',
    },
    {
        id: 'jaw_locking',
        name: 'تيبس الفك',
        name_en: 'Jaw stiffness',
        category: 'function',
        severities: ['mild', 'moderate', 'severe'],
        description: 'شعور بتيبس أو قفل في الفك',
    },
    {
        id: 'teeth_grinding',
        name: 'صرير الأسنان (ليلاً)',
        name_en: 'Teeth grinding',
        category: 'function',
        severities: ['mild', 'moderate', 'severe'],
        description: 'طحن الأسنان أثناء النوم',
    },
    {
        id: 'food_stuck',
        name: 'الطعام يعلق بين الأسنان',
        name_en: 'Food impaction',
        category: 'function',
        severities: ['mild', 'moderate'],
        description: 'الطعام يتراكم بين الأسنان باستمرار',
    },
    {
        id: 'difficulty_swallowing',
        name: 'صعوبة في البلع',
        name_en: 'Difficulty swallowing',
        category: 'function',
        severities: ['moderate', 'severe'],
        description: 'صعوبة في بلع الطعام أو الشراب',
    },

    // ═══════════════════════════════════════════════════════════════
    // فئة: أعراض عامة
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'fever',
        name: 'حمى أو ارتفاع حرارة',
        name_en: 'Fever',
        category: 'general',
        severities: ['mild', 'moderate', 'severe'],
        description: 'ارتفاع في درجة حرارة الجسم',
    },
    {
        id: 'lymph_swelling',
        name: 'تورم الغدد اللمفاوية',
        name_en: 'Swollen lymph nodes',
        category: 'general',
        severities: ['mild', 'moderate', 'severe'],
        description: 'انتفاخ تحت الفك أو الرقبة',
    },
    {
        id: 'fatigue',
        name: 'تعب وإرهاق عام',
        name_en: 'General fatigue',
        category: 'general',
        severities: ['mild', 'moderate', 'severe'],
        description: 'شعور بالتعب والإرهاق',
    },
    {
        id: 'numbness',
        name: 'تنميل في الشفاه أو اللسان',
        name_en: 'Numbness',
        category: 'general',
        severities: ['mild', 'moderate', 'severe'],
        description: 'فقدان الإحساس في الشفاه أو اللسان',
    },
];

// أسئلة المتابعة حسب الأعراض
export const followUpQuestionsBySymptom: Record<string, {
    question: string;
    type: 'boolean' | 'choice';
    options?: string[];
    importance: 'high' | 'medium' | 'low';
}[]> = {
    pain_cold: [
        {
            question: 'هل الألم يختفي فوراً بعد زوال البرودة؟',
            type: 'boolean',
            importance: 'high', // نعم = حساسية، لا = التهاب عصب
        },
    ],
    pain_hot: [
        {
            question: 'هل الألم يستمر لأكثر من 30 ثانية بعد زوال الحرارة؟',
            type: 'boolean',
            importance: 'high',
        },
    ],
    pain_spontaneous: [
        {
            question: 'منذ متى بدأ هذا الألم؟',
            type: 'choice',
            options: ['اليوم', '1-3 أيام', 'أكثر من 3 أيام', 'أكثر من أسبوع'],
            importance: 'high',
        },
        {
            question: 'هل الألم يوقظك من النوم؟',
            type: 'boolean',
            importance: 'high',
        },
    ],
    gum_bleeding: [
        {
            question: 'هل تستخدم خيط الأسنان بانتظام؟',
            type: 'boolean',
            importance: 'medium',
        },
        {
            question: 'هل بدأ النزيف مؤخراً أم منذ فترة طويلة؟',
            type: 'choice',
            options: ['بدأ مؤخراً', 'منذ أشهر', 'منذ سنة أو أكثر'],
            importance: 'medium',
        },
    ],
    facial_swelling: [
        {
            question: 'هل لديك صعوبة في التنفس أو البلع؟',
            type: 'boolean',
            importance: 'high', // حالة طوارئ!
        },
        {
            question: 'هل التورم يزداد بسرعة؟',
            type: 'boolean',
            importance: 'high',
        },
    ],
    tooth_loose: [
        {
            question: 'هل تعرضت لضربة أو حادث مؤخراً؟',
            type: 'boolean',
            importance: 'high',
        },
    ],
    gum_pus: [
        {
            question: 'هل هناك طعم مالح أو سيء في الفم؟',
            type: 'boolean',
            importance: 'medium',
        },
    ],
};

// دالة للحصول على الأعراض حسب الفئة
export function getSymptomsByCategory(category: SymptomCategory): DentalSymptom[] {
    return dentalSymptoms.filter(s => s.category === category);
}

// دالة للحصول على عرض بالـ ID
export function getSymptomById(id: string): DentalSymptom | undefined {
    return dentalSymptoms.find(s => s.id === id);
}
