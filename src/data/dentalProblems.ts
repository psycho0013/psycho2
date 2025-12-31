/**
 * Dental Problems Database
 * قاعدة بيانات مشاكل الأسنان
 */

import type { DentalProblem } from '@/types/dental';

export const dentalProblems: DentalProblem[] = [
    // ═══════════════════════════════════════════════════════════════
    // 1. تسوس الأسنان
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'dental_caries',
        name: 'تسوس الأسنان',
        name_en: 'Dental Caries',
        description: 'تلف في طبقة المينا والعاج نتيجة الأحماض التي تنتجها البكتيريا عند تحليل السكريات.',
        symptoms: [
            'pain_cold',
            'pain_sweet',
            'tooth_hole',
            'food_stuck',
            'pain_chewing',
            'tooth_discolored',
        ],
        symptom_weights: {
            tooth_hole: 100,
            pain_sweet: 85,
            pain_cold: 75,
            food_stuck: 65,
            pain_chewing: 60,
            tooth_discolored: 50,
        },
        severity_levels: [
            { level: 'بسيط', description: 'تسوس سطحي في طبقة المينا - يحتاج حشوة بسيطة' },
            { level: 'متوسط', description: 'تسوس وصل للعاج - حشوة عميقة' },
            { level: 'شديد', description: 'تسوس وصل للعصب - يحتاج علاج عصب' },
        ],
        urgency: 'important',
        urgency_message: 'راجع طبيب الأسنان خلال أسبوع',
        treatments: [
            'حشوة تجميلية (كومبوزيت)',
            'حشوة فضية (أملغم)',
            'علاج عصب + تاج (للحالات المتقدمة)',
        ],
        prevention: [
            'تفريش الأسنان مرتين يومياً بمعجون فلورايد',
            'استخدام خيط الأسنان يومياً',
            'تقليل تناول السكريات والمشروبات الغازية',
            'زيارة طبيب الأسنان كل 6 أشهر للفحص والتنظيف',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. التهاب عصب السن
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'pulpitis',
        name: 'التهاب عصب السن',
        name_en: 'Pulpitis',
        description: 'التهاب في لب السن (العصب) نتيجة تسوس عميق أو رضة، يسبب ألماً شديداً.',
        symptoms: [
            'pain_spontaneous',
            'pain_throbbing',
            'pain_night',
            'pain_hot',
            'pain_cold',
            'pain_spreading',
        ],
        symptom_weights: {
            pain_spontaneous: 95,
            pain_throbbing: 90,
            pain_night: 90,
            pain_hot: 80,
            pain_spreading: 75,
            pain_cold: 60,
        },
        severity_levels: [
            { level: 'قابل للعلاج', description: 'الألم يختفي بعد زوال المحفز - قد يُحفظ العصب' },
            { level: 'غير قابل للعلاج', description: 'ألم مستمر تلقائي - يحتاج سحب عصب' },
        ],
        urgency: 'urgent',
        urgency_message: 'راجع طبيب الأسنان خلال 24-48 ساعة',
        treatments: [
            'علاج عصب (Root Canal Treatment)',
            'حشوة مؤقتة للتهدئة',
            'تاج بعد علاج العصب لحماية السن',
        ],
        prevention: [
            'علاج التسوس مبكراً قبل وصوله للعصب',
            'استخدام واقي الأسنان عند ممارسة الرياضة',
            'تجنب مضغ الأشياء الصلبة',
        ],
        emergency_signs: [
            'ألم شديد لا يستجيب للمسكنات',
            'تورم في الوجه',
            'حمى مصاحبة',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. التهاب اللثة
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'gingivitis',
        name: 'التهاب اللثة',
        name_en: 'Gingivitis',
        description: 'التهاب في أنسجة اللثة نتيجة تراكم البلاك والجير، وهو قابل للعلاج والشفاء التام.',
        symptoms: [
            'gum_bleeding',
            'gum_redness',
            'gum_swelling',
            'gum_bad_breath',
        ],
        symptom_weights: {
            gum_bleeding: 90,
            gum_redness: 80,
            gum_swelling: 75,
            gum_bad_breath: 60,
        },
        severity_levels: [
            { level: 'خفيف', description: 'احمرار بسيط ونزيف عند التفريش' },
            { level: 'متوسط', description: 'تورم واضح ونزيف متكرر' },
            { level: 'شديد', description: 'التهاب حاد قد يتطور لأمراض دواعم السن' },
        ],
        urgency: 'routine',
        urgency_message: 'راجع طبيب الأسنان خلال أسبوعين',
        treatments: [
            'تنظيف الجير المحترف (Scaling)',
            'تحسين نظافة الفم المنزلية',
            'غسول فم مضاد للبكتيريا',
        ],
        prevention: [
            'تفريش الأسنان مرتين يومياً',
            'استخدام خيط الأسنان يومياً',
            'تنظيف الجير كل 6 أشهر',
            'الإقلاع عن التدخين',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. أمراض دواعم السن (اللثة المتقدمة)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'periodontitis',
        name: 'أمراض دواعم السن',
        name_en: 'Periodontitis',
        description: 'مرض متقدم يصيب الأنسجة الداعمة للأسنان (اللثة، العظم، الأربطة)، قد يؤدي لفقدان الأسنان.',
        symptoms: [
            'gum_recession',
            'tooth_loose',
            'gum_pus',
            'gum_bleeding',
            'gum_bad_breath',
            'gum_bad_taste',
        ],
        symptom_weights: {
            tooth_loose: 100,
            gum_recession: 90,
            gum_pus: 85,
            gum_bleeding: 70,
            gum_bad_breath: 60,
            gum_bad_taste: 55,
        },
        severity_levels: [
            { level: 'مبكر', description: 'جيوب لثوية 4-5 ملم مع فقد عظمي بسيط' },
            { level: 'متوسط', description: 'جيوب 5-7 ملم مع تحرك بسيط بالأسنان' },
            { level: 'متقدم', description: 'جيوب أكثر من 7 ملم مع تحرك واضح' },
        ],
        urgency: 'important',
        urgency_message: 'راجع طبيب الأسنان المتخصص خلال أسبوع',
        treatments: [
            'تنظيف عميق (Scaling and Root Planing)',
            'علاج جراحي للثة في الحالات المتقدمة',
            'مضادات حيوية موضعية أو جهازية',
        ],
        prevention: [
            'علاج التهاب اللثة مبكراً',
            'المتابعة الدورية مع طبيب الأسنان',
            'السيطرة على السكري',
            'الإقلاع عن التدخين',
        ],
        warning: 'إذا لم يُعالج، قد يؤدي لفقدان الأسنان وتأثيرات على الصحة العامة',
    },

    // ═══════════════════════════════════════════════════════════════
    // 5. خراج الأسنان
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'dental_abscess',
        name: 'خراج الأسنان',
        name_en: 'Dental Abscess',
        description: 'تجمع صديدي نتيجة عدوى بكتيرية في السن أو اللثة، حالة خطيرة تتطلب علاجاً فورياً.',
        symptoms: [
            'pain_throbbing',
            'facial_swelling',
            'fever',
            'gum_pus',
            'gum_bad_taste',
            'lymph_swelling',
            'pain_spontaneous',
        ],
        symptom_weights: {
            facial_swelling: 100,
            gum_pus: 95,
            fever: 90,
            pain_throbbing: 85,
            lymph_swelling: 80,
            gum_bad_taste: 60,
            pain_spontaneous: 55,
        },
        severity_levels: [
            { level: 'موضعي', description: 'خراج محدود حول السن' },
            { level: 'منتشر', description: 'انتشار العدوى للأنسجة المحيطة' },
        ],
        urgency: 'emergency',
        urgency_message: 'راجع طبيب الأسنان اليوم أو اذهب للطوارئ!',
        treatments: [
            'تصريف الخراج',
            'مضادات حيوية',
            'علاج عصب أو خلع السن حسب الحالة',
        ],
        prevention: [
            'علاج التسوس مبكراً',
            'عدم إهمال آلام الأسنان',
            'نظافة الفم الجيدة',
        ],
        emergency_signs: [
            'صعوبة في التنفس أو البلع',
            'تورم يمتد للرقبة أو العين',
            'حمى عالية',
            'عدم القدرة على فتح الفم',
        ],
        warning: 'إذا كان هناك صعوبة بالتنفس أو البلع، اذهب للطوارئ فوراً!',
    },

    // ═══════════════════════════════════════════════════════════════
    // 6. حساسية الأسنان
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'tooth_sensitivity',
        name: 'حساسية الأسنان',
        name_en: 'Tooth Sensitivity',
        description: 'ألم قصير وحاد عند تعرض الأسنان لمحفزات معينة مثل البرودة أو الحرارة أو الحلو.',
        symptoms: [
            'pain_cold',
            'pain_hot',
            'pain_sweet',
            'gum_recession',
        ],
        symptom_weights: {
            pain_cold: 90,
            pain_hot: 70,
            pain_sweet: 65,
            gum_recession: 60,
        },
        severity_levels: [
            { level: 'خفيف', description: 'حساسية عرضية لمحفزات قوية' },
            { level: 'متوسط', description: 'حساسية متكررة تؤثر على الأكل' },
            { level: 'شديد', description: 'حساسية مستمرة حتى للهواء' },
        ],
        urgency: 'routine',
        urgency_message: 'راجع طبيب الأسنان لتحديد السبب',
        treatments: [
            'معجون أسنان للحساسية',
            'فلورايد موضعي',
            'علاج انحسار اللثة',
            'حشوات للأسنان المتآكلة',
        ],
        prevention: [
            'استخدام فرشاة ناعمة',
            'تجنب التفريش بقوة',
            'تقليل الأطعمة الحمضية',
            'استخدام واقي الأسنان إذا كنت تطحن أسنانك',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 7. ضرس العقل المدفون
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'impacted_wisdom',
        name: 'مشاكل ضرس العقل',
        name_en: 'Impacted Wisdom Tooth',
        description: 'ضرس العقل لا يجد مساحة كافية للبزوغ، مما يسبب ألماً والتهاباً.',
        symptoms: [
            'pain_jaw',
            'difficulty_opening',
            'gum_swelling',
            'gum_bad_breath',
            'pain_spreading',
            'fever',
        ],
        symptom_weights: {
            pain_jaw: 90,
            difficulty_opening: 85,
            gum_swelling: 80,
            pain_spreading: 70,
            gum_bad_breath: 55,
            fever: 75,
        },
        severity_levels: [
            { level: 'التهاب التاج', description: 'التهاب اللثة المحيطة بضرس العقل' },
            { level: 'انطمار جزئي', description: 'الضرس بارز جزئياً ويسبب مشاكل' },
            { level: 'انطمار كامل', description: 'الضرس مدفون بالكامل ويضغط على الأسنان' },
        ],
        urgency: 'urgent',
        urgency_message: 'راجع طبيب الأسنان خلال 2-3 أيام',
        treatments: [
            'مضادات حيوية للالتهاب الحاد',
            'خلع جراحي لضرس العقل',
            'متابعة فقط إذا بدون أعراض',
        ],
        prevention: [
            'الفحص الدوري بالأشعة',
            'نظافة المنطقة الخلفية جيداً',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 8. اضطراب المفصل الصدغي الفكي
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'tmj_disorder',
        name: 'اضطراب مفصل الفك',
        name_en: 'TMJ Disorder',
        description: 'مشاكل في المفصل الصدغي الفكي تسبب ألماً وصوت طقطقة وصعوبة في فتح الفم.',
        symptoms: [
            'jaw_clicking',
            'pain_jaw',
            'difficulty_opening',
            'jaw_locking',
            'pain_spreading',
            'teeth_grinding',
        ],
        symptom_weights: {
            jaw_clicking: 90,
            pain_jaw: 85,
            difficulty_opening: 80,
            jaw_locking: 85,
            pain_spreading: 65,
            teeth_grinding: 70,
        },
        severity_levels: [
            { level: 'خفيف', description: 'طقطقة بدون ألم' },
            { level: 'متوسط', description: 'ألم وطقطقة مع صعوبة عرضية بفتح الفم' },
            { level: 'شديد', description: 'ألم مزمن وتيبس متكرر' },
        ],
        urgency: 'important',
        urgency_message: 'راجع متخصص في مفصل الفك',
        treatments: [
            'واقي الأسنان الليلي (Night Guard)',
            'علاج طبيعي للفك',
            'تقليل التوتر والضغط النفسي',
            'أدوية مضادة للالتهاب',
        ],
        prevention: [
            'تجنب فتح الفم بشكل واسع',
            'تقليل مضغ العلكة',
            'إدارة التوتر',
            'عدم الضغط على الفك',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 9. سن مكسور
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'broken_tooth',
        name: 'سن مكسور أو متشقق',
        name_en: 'Broken or Cracked Tooth',
        description: 'كسر أو شق في السن نتيجة رضة أو عض على شيء صلب.',
        symptoms: [
            'tooth_broken',
            'pain_chewing',
            'pain_cold',
            'pain_hot',
        ],
        symptom_weights: {
            tooth_broken: 100,
            pain_chewing: 80,
            pain_cold: 60,
            pain_hot: 60,
        },
        severity_levels: [
            { level: 'شق سطحي', description: 'شق في المينا فقط، عادة لا يحتاج علاج' },
            { level: 'كسر متوسط', description: 'كسر يصل للعاج، يحتاج حشوة أو تاج' },
            { level: 'كسر عميق', description: 'كسر يصل للعصب، يحتاج علاج عصب أو خلع' },
        ],
        urgency: 'urgent',
        urgency_message: 'راجع طبيب الأسنان خلال 24-48 ساعة',
        treatments: [
            'حشوة أو ترميم',
            'تاج (Crown)',
            'علاج عصب إذا وصل الكسر للعصب',
            'خلع في الحالات الشديدة',
        ],
        prevention: [
            'استخدام واقي الأسنان عند الرياضة',
            'تجنب مضغ الثلج أو الأشياء الصلبة',
            'علاج صرير الأسنان',
        ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 10. التهاب الغشاء المبطن لضرس العقل
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'pericoronitis',
        name: 'التهاب غطاء ضرس العقل',
        name_en: 'Pericoronitis',
        description: 'التهاب اللثة المحيطة بضرس العقل البارز جزئياً.',
        symptoms: [
            'gum_swelling',
            'pain_chewing',
            'difficulty_opening',
            'gum_bad_taste',
            'fever',
            'lymph_swelling',
        ],
        symptom_weights: {
            gum_swelling: 95,
            difficulty_opening: 85,
            pain_chewing: 80,
            gum_bad_taste: 70,
            fever: 75,
            lymph_swelling: 70,
        },
        severity_levels: [
            { level: 'حاد', description: 'التهاب حاد مع ألم وتورم' },
            { level: 'مزمن', description: 'التهابات متكررة' },
        ],
        urgency: 'urgent',
        urgency_message: 'راجع طبيب الأسنان خلال 24-48 ساعة',
        treatments: [
            'مضادات حيوية',
            'غسول فم مطهر',
            'خلع ضرس العقل لمنع التكرار',
        ],
        prevention: [
            'نظافة منطقة ضرس العقل جيداً',
            'خلع ضرس العقل المدفون قبل حدوث مشاكل',
        ],
    },
];

// دالة للحصول على مشكلة بالـ ID
export function getProblemById(id: string): DentalProblem | undefined {
    return dentalProblems.find(p => p.id === id);
}

// دالة للحصول على المشاكل حسب مستوى الإلحاح
export function getProblemsByUrgency(urgency: DentalProblem['urgency']): DentalProblem[] {
    return dentalProblems.filter(p => p.urgency === urgency);
}
