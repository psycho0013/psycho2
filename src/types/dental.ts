/**
 * Dental Diagnosis Types
 * أنواع تشخيص الأسنان
 */

// مستوى الشدة
export type DentalSeverity = 'mild' | 'moderate' | 'severe';

// مستوى الإلحاح
export type UrgencyLevel = 'emergency' | 'urgent' | 'important' | 'routine';

// موقع السن في الفم
export interface ToothLocation {
    quadrant: 'upper-right' | 'upper-left' | 'lower-right' | 'lower-left';
    toothNumber: number; // 1-8
}

// منطقة المشكلة
export type ProblemArea =
    | 'specific-tooth'      // سن معين
    | 'upper-right'         // الفك العلوي الأيمن
    | 'upper-left'          // الفك العلوي الأيسر
    | 'lower-right'         // الفك السفلي الأيمن
    | 'lower-left'          // الفك السفلي الأيسر
    | 'gums-general'        // اللثة عموماً
    | 'whole-mouth'         // الفم كاملاً
    | 'jaw-joint'           // مفصل الفك
    | 'unknown';            // لا أعرف

// فئة العرض
export type SymptomCategory =
    | 'pain'                // ألم
    | 'gum'                 // لثة
    | 'appearance'          // مظهر
    | 'function'            // وظيفة
    | 'general';            // عام

// عرض السن
export interface DentalSymptom {
    id: string;
    name: string;
    name_en: string;
    category: SymptomCategory;
    severities: DentalSeverity[];
    description?: string;
    followUpQuestions?: string[];
}

// عرض مختار
export interface SelectedDentalSymptom {
    id: string;
    severity: DentalSeverity;
    followUpAnswers?: Record<string, string | boolean>;
}

// مستوى شدة المشكلة
export interface SeverityLevel {
    level: string;
    description: string;
}

// مشكلة الأسنان
export interface DentalProblem {
    id: string;
    name: string;
    name_en: string;
    description: string;
    symptoms: string[];
    symptom_weights: Record<string, number>;
    severity_levels: SeverityLevel[];
    urgency: UrgencyLevel;
    urgency_message: string;
    treatments: string[];
    prevention: string[];
    emergency_signs?: string[];
    warning?: string;
}

// نتيجة التشخيص
export interface DentalDiagnosisResult {
    problem: DentalProblem;
    score: number;
    matchedSymptoms: string[];
    matchPercentage: number;
    suggestedUrgency: UrgencyLevel;
}

// حالة التشخيص
export interface DentalDiagnosisState {
    step: number;

    // معلومات المريض
    patientInfo: {
        age: string;
        gender: 'male' | 'female';
        lastDentalVisit: 'less-6-months' | '6-12-months' | 'more-than-year' | 'never';
        isPregnant: boolean;
        isBreastfeeding: boolean;
        chronicDiseases: string[];
        currentMedications: string[];
    };

    // منطقة المشكلة
    problemArea: ProblemArea;
    selectedTooth?: ToothLocation;

    // الأعراض المختارة
    selectedSymptoms: SelectedDentalSymptom[];

    // إجابات الأسئلة الإضافية
    followUpAnswers: Record<string, string | boolean>;

    // مدة المشكلة
    problemDuration: 'today' | '1-3-days' | '3-7-days' | 'more-than-week' | 'chronic';
}

// الأمراض المزمنة المؤثرة على الأسنان
export const DENTAL_CHRONIC_DISEASES = [
    { id: 'diabetes', name: 'السكري', icon: '🩸' },
    { id: 'heart-disease', name: 'أمراض القلب', icon: '❤️' },
    { id: 'osteoporosis', name: 'هشاشة العظام', icon: '🦴' },
    { id: 'blood-thinners', name: 'أدوية مميعة للدم', icon: '💊' },
    { id: 'immunocompromised', name: 'ضعف المناعة', icon: '🛡️' },
];

// أسماء مناطق الفم
export const PROBLEM_AREA_NAMES: Record<ProblemArea, string> = {
    'specific-tooth': 'سن معين',
    'upper-right': 'الفك العلوي الأيمن',
    'upper-left': 'الفك العلوي الأيسر',
    'lower-right': 'الفك السفلي الأيمن',
    'lower-left': 'الفك السفلي الأيسر',
    'gums-general': 'اللثة بشكل عام',
    'whole-mouth': 'الفم كاملاً',
    'jaw-joint': 'مفصل الفك',
    'unknown': 'لا أعرف بالضبط'
};

// ألوان مستويات الإلحاح
export const URGENCY_COLORS: Record<UrgencyLevel, { bg: string; text: string; border: string }> = {
    emergency: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    urgent: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    important: { bg: 'bg-yellow-500', text: 'text-gray-900', border: 'border-yellow-600' },
    routine: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' }
};

// رسائل الإلحاح
export const URGENCY_MESSAGES: Record<UrgencyLevel, { title: string; message: string; icon: string }> = {
    emergency: {
        title: '🚨 حالة طوارئ',
        message: 'اذهب للطوارئ أو طبيب الأسنان فوراً!',
        icon: '🚑'
    },
    urgent: {
        title: '⚠️ عاجل',
        message: 'راجع طبيب الأسنان خلال 24-48 ساعة',
        icon: '⏰'
    },
    important: {
        title: '📋 مهم',
        message: 'احجز موعد خلال 2-3 أيام',
        icon: '📅'
    },
    routine: {
        title: '✅ روتيني',
        message: 'راجع طبيب الأسنان خلال أسبوعين',
        icon: '🦷'
    }
};
