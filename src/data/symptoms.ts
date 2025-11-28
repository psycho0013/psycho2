export type Severity = 'mild' | 'moderate' | 'severe';

export interface Symptom {
    id: string;
    name: string;
    category: string;
    severities: Severity[];
}

export const symptoms: Symptom[] = [
    // Respiratory
    { id: 'cough', name: 'سعال', category: 'Respiratory', severities: ['mild', 'moderate', 'severe'] },
    { id: 'shortness_of_breath', name: 'ضيق في التنفس', category: 'Respiratory', severities: ['mild', 'moderate', 'severe'] },
    { id: 'sore_throat', name: 'التهاب الحلق', category: 'Respiratory', severities: ['mild', 'moderate', 'severe'] },
    { id: 'runny_nose', name: 'سيلان الأنف', category: 'Respiratory', severities: ['mild', 'moderate'] },

    // Cardiovascular
    { id: 'chest_pain', name: 'ألم في الصدر', category: 'Cardiovascular', severities: ['mild', 'moderate', 'severe'] },
    { id: 'palpitations', name: 'خفقان القلب', category: 'Cardiovascular', severities: ['mild', 'moderate', 'severe'] },

    // Digestive
    { id: 'nausea', name: 'غثيان', category: 'Digestive', severities: ['mild', 'moderate', 'severe'] },
    { id: 'vomiting', name: 'قيء', category: 'Digestive', severities: ['mild', 'moderate', 'severe'] },
    { id: 'abdominal_pain', name: 'ألم في البطن', category: 'Digestive', severities: ['mild', 'moderate', 'severe'] },
    { id: 'diarrhea', name: 'إسهال', category: 'Digestive', severities: ['mild', 'moderate', 'severe'] },

    // General
    { id: 'fever', name: 'حمى', category: 'General', severities: ['mild', 'moderate', 'severe'] },
    { id: 'fatigue', name: 'تعب وإرهاق', category: 'General', severities: ['mild', 'moderate', 'severe'] },
    { id: 'headache', name: 'صداع', category: 'General', severities: ['mild', 'moderate', 'severe'] },
];

export const symptomCategories = [
    { id: 'Respiratory', name: 'الجهاز التنفسي' },
    { id: 'Cardiovascular', name: 'القلب والأوعية الدموية' },
    { id: 'Digestive', name: 'الجهاز الهضمي' },
    { id: 'General', name: 'أعراض عامة' },
];
