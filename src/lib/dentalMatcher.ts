/**
 * Dental Diagnosis Matcher
 * خوارزمية تشخيص الأسنان
 */

import type {
    DentalDiagnosisResult,
    SelectedDentalSymptom,
    UrgencyLevel
} from '@/types/dental';
import { dentalProblems } from '@/data/dentalProblems';

// مضاعفات الشدة
const SEVERITY_MULTIPLIER: Record<string, number> = {
    mild: 0.6,
    moderate: 1.0,
    severe: 1.5,
};

// الوزن الافتراضي
const DEFAULT_WEIGHT = 50;

/**
 * حساب نتائج التشخيص لكل مشكلة أسنان
 */
export function calculateDentalDiagnosisScores(
    selectedSymptoms: SelectedDentalSymptom[],
    followUpAnswers: Record<string, string | boolean> = {}
): DentalDiagnosisResult[] {
    // إنشاء خريطة للأعراض المختارة
    const symptomMap = new Map<string, number>();
    selectedSymptoms.forEach(s => {
        const multiplier = SEVERITY_MULTIPLIER[s.severity] || 1.0;
        const existing = symptomMap.get(s.id) || 0;
        symptomMap.set(s.id, Math.max(existing, multiplier));
    });

    const results: DentalDiagnosisResult[] = dentalProblems.map(problem => {
        let score = 0;
        let maxPossibleScore = 0;
        const matchedSymptoms: string[] = [];

        // حساب النتيجة بناءً على أعراض المشكلة
        problem.symptoms.forEach(symptomId => {
            const weight = problem.symptom_weights?.[symptomId] ?? DEFAULT_WEIGHT;
            maxPossibleScore += weight;

            const severityMultiplier = symptomMap.get(symptomId);
            if (severityMultiplier !== undefined) {
                score += weight * severityMultiplier;
                matchedSymptoms.push(symptomId);
            }
        });

        // خصم للأعراض غير المطابقة
        const unmatchedUserSymptoms = selectedSymptoms.filter(
            s => !problem.symptoms.includes(s.id)
        ).length;
        const penalty = unmatchedUserSymptoms * 3;
        score = Math.max(0, score - penalty);

        // حساب نسبة التطابق
        const matchPercentage = problem.symptoms.length > 0
            ? (matchedSymptoms.length / problem.symptoms.length) * 100
            : 0;

        // تعديل مستوى الإلحاح بناءً على الأعراض الطارئة
        let suggestedUrgency = problem.urgency;
        if (hasEmergencySigns(selectedSymptoms, followUpAnswers)) {
            suggestedUrgency = 'emergency';
        }

        return {
            problem,
            score: maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0,
            matchedSymptoms,
            matchPercentage,
            suggestedUrgency,
        };
    });

    // ترتيب حسب النتيجة ثم نسبة التطابق
    return results
        .filter(r => r.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return b.matchPercentage - a.matchPercentage;
        });
}

/**
 * التحقق من علامات الطوارئ
 */
function hasEmergencySigns(
    symptoms: SelectedDentalSymptom[],
    followUpAnswers: Record<string, string | boolean>
): boolean {
    // علامات الطوارئ: تورم الوجه، صعوبة البلع، حمى، تنميل

    // إذا كان هناك تورم بالوجه مع شدة عالية
    const hasSevereFacialSwelling = symptoms.some(
        s => s.id === 'facial_swelling' && s.severity === 'severe'
    );

    // إذا كان هناك صعوبة بالبلع
    const hasDifficultySwallowing = symptoms.some(
        s => s.id === 'difficulty_swallowing'
    );

    // إذا أجاب بنعم على سؤال صعوبة التنفس/البلع
    const hasBreathingDifficulty = followUpAnswers['breathing_difficulty'] === true;

    return hasSevereFacialSwelling || hasDifficultySwallowing || hasBreathingDifficulty;
}

/**
 * الحصول على أفضل المرشحين
 */
export function getTopDentalCandidates(
    selectedSymptoms: SelectedDentalSymptom[],
    followUpAnswers: Record<string, string | boolean> = {},
    topN: number = 5
): DentalDiagnosisResult[] {
    const results = calculateDentalDiagnosisScores(selectedSymptoms, followUpAnswers);
    return results.slice(0, topN);
}

/**
 * تحديد مستوى الإلحاح النهائي
 */
export function determineFinalUrgency(
    results: DentalDiagnosisResult[]
): UrgencyLevel {
    if (results.length === 0) return 'routine';

    // الأولوية للطوارئ
    const urgencyPriority: UrgencyLevel[] = ['emergency', 'urgent', 'important', 'routine'];

    for (const level of urgencyPriority) {
        if (results.some(r => r.suggestedUrgency === level && r.score > 30)) {
            return level;
        }
    }

    return 'routine';
}

/**
 * الحصول على نصائح مؤقتة حسب الأعراض
 */
export function getTemporaryAdvice(symptoms: SelectedDentalSymptom[]): string[] {
    const advice: string[] = [];

    const hasToothPain = symptoms.some(s =>
        s.id.includes('pain') && s.severity !== 'mild'
    );

    const hasSwelling = symptoms.some(s =>
        s.id === 'facial_swelling' || s.id === 'gum_swelling'
    );

    const hasBleeding = symptoms.some(s => s.id === 'gum_bleeding');

    if (hasToothPain) {
        advice.push('يمكنك تناول مسكن ألم مثل باراسيتامول أو إيبوبروفين');
        advice.push('تجنب الأطعمة والمشروبات الساخنة والباردة جداً');
        advice.push('❌ لا تضع أسبرين مباشرة على السن أو اللثة');
    }

    if (hasSwelling) {
        advice.push('ضع كمادة باردة على الخد من الخارج (20 دقيقة، ثم راحة)');
        advice.push('نم على وسادة مرتفعة لتقليل التورم');
    }

    if (hasBleeding) {
        advice.push('اضغط بقطعة شاش نظيفة على مكان النزيف');
        advice.push('تجنب غسول الفم الكحولي');
    }

    advice.push('تجنب المضمضة بالماء الملح إذا كان هناك جرح مفتوح');

    return advice;
}

/**
 * تنسيق النتائج للعرض
 */
export function formatResultsForDisplay(results: DentalDiagnosisResult[]): {
    primary: DentalDiagnosisResult | null;
    secondary: DentalDiagnosisResult[];
    urgency: UrgencyLevel;
} {
    if (results.length === 0) {
        return {
            primary: null,
            secondary: [],
            urgency: 'routine',
        };
    }

    const primary = results[0];
    const secondary = results.slice(1, 3);
    const urgency = determineFinalUrgency(results);

    return { primary, secondary, urgency };
}
