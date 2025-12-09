export type Severity = 'mild' | 'moderate' | 'severe';

export interface Symptom {
    id: string;
    name: string; // Deprecated, kept for backward compatibility
    name_ar: string;
    name_en: string;
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
    symptom_weights?: Record<string, number>; // Optional: { symptom_id: weight (0-100) }
    treatments: string[]; // Array of treatment IDs
    prevention: string[];
    causes: string[];
    complications: string[];
    diagnosis_method: string;
}

export const symptomCategories = [
    { id: 'General', name: 'أعراض عامة', name_en: 'General Symptoms' },
    { id: 'Respiratory', name: 'الجهاز التنفسي', name_en: 'Respiratory System' },
    { id: 'Cardiovascular', name: 'القلب والأوعية الدموية', name_en: 'Cardiovascular System' },
    { id: 'Digestive', name: 'الجهاز الهضمي', name_en: 'Digestive System' },
    { id: 'Neurological', name: 'الجهاز العصبي', name_en: 'Nervous System' },
    { id: 'Musculoskeletal', name: 'العضلات والعظام', name_en: 'Musculoskeletal System' },
    { id: 'Dermatological', name: 'الجلدية', name_en: 'Dermatological' },
    { id: 'ENT', name: 'الأنف والأذن والحنجرة', name_en: 'Ear, Nose, and Throat (ENT)' },
    { id: 'Ophthalmological', name: 'العيون', name_en: 'Ophthalmological' },
    { id: 'Urinary', name: 'المسالك البولية', name_en: 'Urinary System' },
    { id: 'Reproductive', name: 'الجهاز التناسلي', name_en: 'Reproductive System' },
    { id: 'Psychological', name: 'النفسية والعقلية', name_en: 'Psychological & Mental' },
    { id: 'Endocrine', name: 'الغدد الصماء', name_en: 'Endocrine System' },
    { id: 'Hematological', name: 'الدم والمناعة', name_en: 'Hematological & Immune' },
    { id: 'Pediatric', name: 'طب الأطفال', name_en: 'Pediatric' },
    { id: 'Geriatric', name: 'طب الشيخوخة', name_en: 'Geriatric' },
];
