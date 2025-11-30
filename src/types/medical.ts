export type Severity = 'mild' | 'moderate' | 'severe';

export interface Symptom {
    id: string;
    name: string;
    category: string;
    severities: Severity[];
}

export interface Treatment {
    id: string;
    name: string;
    description: string;
    type: 'دواء' | 'نمط حياة' | 'إجراء طبي';
    dosage?: string;
    side_effects?: string[];
    precautions?: string[];
    instructions?: string;
    duration?: string;
    price?: number;
}

export interface Disease {
    id: string;
    name: string;
    description: string;
    symptoms: string[]; // Array of symptom IDs
    treatments: string[]; // Array of treatment IDs
    prevention: string[];
    causes: string[];
    complications: string[];
    diagnosis_method: string;
}

export const symptomCategories = [
    { id: 'Respiratory', name: 'الجهاز التنفسي' },
    { id: 'Cardiovascular', name: 'القلب والأوعية الدموية' },
    { id: 'Digestive', name: 'الجهاز الهضمي' },
    { id: 'General', name: 'أعراض عامة' },
];
