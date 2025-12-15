
export type TestType =
    | 'cbc'
    | 'kidney'
    | 'liver'
    | 'thyroid'
    | 'sugar'
    | 'lipid'
    | 'vitamin'
    | 'iron'
    | 'urine'
    | 'stool';

export interface TestField {
    id: string;
    label: string;
    unit?: string;
    type: 'number' | 'text' | 'select';
    options?: string[]; // For select type
    min?: number;
    max?: number;
    description?: string;
}

export interface TestDefinition {
    id: TestType;
    title: string;
    titleAr: string;
    fields: TestField[];
}

export const LAB_TESTS: TestDefinition[] = [
    {
        id: 'cbc',
        title: 'CBC (Complete Blood Count)',
        titleAr: 'تعداد الدم الكامل',
        fields: [
            { id: 'wbc', label: 'WBC - كريات الدم البيضاء (White Blood Cells)', unit: '10^3/µL', type: 'number', min: 4.5, max: 11.0 },
            { id: 'rbc', label: 'RBC - كريات الدم الحمراء (Red Blood Cells)', unit: '10^6/µL', type: 'number', min: 4.5, max: 5.9 },
            { id: 'hgb', label: 'HGB - الهيموغلوبين (Hemoglobin)', unit: 'g/dL', type: 'number', min: 13.5, max: 17.5 },
            { id: 'hct', label: 'HCT - الهيماتوكريت (Hematocrit)', unit: '%', type: 'number', min: 41, max: 50 },
            { id: 'mcv', label: 'MCV - متوسط حجم الكرية (Mean Corpuscular Volume)', unit: 'fL', type: 'number', min: 80, max: 96 },
            { id: 'mch', label: 'MCH - متوسط هيموغلوبين الكرية (Mean Corpuscular Hemoglobin)', unit: 'pg', type: 'number', min: 27, max: 33 },
            { id: 'mchc', label: 'MCHC - تركيز هيموغلوبين الكرية (Mean Corpuscular Hemoglobin Concentration)', unit: 'g/dL', type: 'number', min: 33, max: 36 },
            { id: 'rdw_cv', label: 'RDW-CV - توزيع حجم الكريات الحمراء (Red Cell Distribution Width – CV)', unit: '%', type: 'number', min: 11.5, max: 14.5 },
            { id: 'rdw_sd', label: 'RDW-SD - توزيع حجم الكريات الحمراء (Red Cell Distribution Width – SD)', unit: 'fL', type: 'number', min: 39, max: 46 },
            { id: 'plt', label: 'PLT - الصفيحات الدموية (Platelets)', unit: '10^3/µL', type: 'number', min: 150, max: 450 },
            { id: 'mpv', label: 'MPV - متوسط حجم الصفيحات (Mean Platelet Volume)', unit: 'fL', type: 'number', min: 7.4, max: 10.4 },
            { id: 'pdw', label: 'PDW - توزيع عرض الصفيحات (Platelet Distribution Width)', unit: 'fL', type: 'number', min: 9.0, max: 17.0 },
            { id: 'pct', label: 'PCT - نسبة الصفيحات (Plateletcrit)', unit: '%', type: 'number', min: 0.10, max: 0.28 },
            { id: 'p_lcr', label: 'P-LCR - نسبة الصفيحات الكبيرة (Platelet Larger Cell Ratio)', unit: '%', type: 'number', min: 15, max: 35 },
            { id: 'p_lcc', label: 'P-LCC - عدد الصفيحات الكبيرة (Platelet Large Cell Count)', unit: '10^9/L', type: 'number', min: 30, max: 90 },
        ]
    },
    {
        id: 'kidney',
        title: 'RFT (Renal Function Test)',
        titleAr: 'وظائف الكلى',
        fields: [
            { id: 'bun', label: 'Urea (BUN) - اليوريا', unit: 'mg/dL', type: 'number', min: 7, max: 20 },
            { id: 'creatinine', label: 'Creatinine - الكرياتينين', unit: 'mg/dL', type: 'number', min: 0.6, max: 1.2 },
            { id: 'egfr', label: 'eGFR - معدل الترشيح الكبيبي', unit: 'mL/min/1.73m²', type: 'number', min: 90, max: 120 },
            { id: 'sodium', label: 'Sodium (Na) - الصوديوم', unit: 'mEq/L', type: 'number', min: 135, max: 145 },
            { id: 'potassium', label: 'Potassium (K) - البوتاسيوم', unit: 'mEq/L', type: 'number', min: 3.5, max: 5.0 },
            { id: 'chloride', label: 'Chloride (Cl) - الكلوريد', unit: 'mEq/L', type: 'number', min: 98, max: 107 },
            { id: 'bicarbonate', label: 'Bicarbonate (HCO3) - البيكربونات', unit: 'mEq/L', type: 'number', min: 22, max: 29 },
            { id: 'uric_acid', label: 'Uric Acid - حمض اليوريك', unit: 'mg/dL', type: 'number', min: 3.5, max: 7.2 },
        ]
    },
    {
        id: 'liver',
        title: 'LFT (Liver Function Test)',
        titleAr: 'وظائف الكبد',
        fields: [
            { id: 'ast', label: 'AST (SGOT) - إنزيم الكبد', unit: 'U/L', type: 'number', min: 10, max: 40 },
            { id: 'alt', label: 'ALT (SGPT) - إنزيم الكبد', unit: 'U/L', type: 'number', min: 7, max: 56 },
            { id: 'alp', label: 'ALP (Alkaline Phosphatase) - الفوسفاتاز القلوي', unit: 'U/L', type: 'number', min: 44, max: 147 },
            { id: 'ggt', label: 'GGT - ناقلة الببتيد غاما غلوتاميل', unit: 'U/L', type: 'number', min: 9, max: 48 },
            { id: 'total_bilirubin', label: 'Total Bilirubin - البيليروبين الكلي', unit: 'mg/dL', type: 'number', min: 0.1, max: 1.2 },
            { id: 'direct_bilirubin', label: 'Direct Bilirubin - البيليروبين المباشر', unit: 'mg/dL', type: 'number', min: 0.0, max: 0.3 },
            { id: 'indirect_bilirubin', label: 'Indirect Bilirubin - البيليروبين غير المباشر', unit: 'mg/dL', type: 'number', min: 0.2, max: 0.8 },
            { id: 'total_protein', label: 'Total Protein - البروتين الكلي', unit: 'g/dL', type: 'number', min: 6.0, max: 8.3 },
            { id: 'albumin', label: 'Albumin - الألبومين', unit: 'g/dL', type: 'number', min: 3.5, max: 5.5 },
        ]
    },
    {
        id: 'thyroid',
        title: 'TFT (Thyroid Function Test)',
        titleAr: 'وظائف الغدة الدرقية',
        fields: [
            { id: 'tsh', label: 'TSH - الهرمون المنبه للدرقية', unit: 'mIU/L', type: 'number', min: 0.4, max: 4.0 },
            { id: 'free_t4', label: 'Free T4 - الثيروكسين الحر', unit: 'ng/dL', type: 'number', min: 0.8, max: 1.8 },
            { id: 'free_t3', label: 'Free T3 - ثلاثي يود الثيرونين الحر', unit: 'pg/mL', type: 'number', min: 2.3, max: 4.2 },
        ]
    },
    {
        id: 'sugar',
        title: 'Blood Sugar Tests',
        titleAr: 'فحوصات السكر',
        fields: [
            { id: 'fbs', label: 'Fasting Blood Sugar (FBS) - سكر الدم الصائم', unit: 'mg/dL', type: 'number', min: 70, max: 100 },
            { id: 'fasting_hours', label: 'عدد ساعات الصيام (لـ FBS)', unit: 'ساعة', type: 'number', min: 0, max: 24 },
            { id: 'rbs', label: 'Random Blood Sugar (RBS) - سكر الدم العشوائي', unit: 'mg/dL', type: 'number', min: 70, max: 140 },
            { id: 'pp2hr', label: '2hr Postprandial (2hr PP) - سكر بعد الأكل بساعتين', unit: 'mg/dL', type: 'number', min: 70, max: 140 },
            { id: 'hba1c', label: 'HbA1c - السكر التراكمي', unit: '%', type: 'number', min: 4.0, max: 5.6 },
        ]
    },
    {
        id: 'lipid',
        title: 'Lipid Profile',
        titleAr: 'صورة الدهون',
        fields: [
            { id: 'total_cholesterol', label: 'Total Cholesterol - الكوليسترول الكلي', unit: 'mg/dL', type: 'number', min: 0, max: 200 },
            { id: 'ldl', label: 'LDL (Bad Cholesterol) - الكوليسترول الضار', unit: 'mg/dL', type: 'number', min: 0, max: 100 },
            { id: 'hdl', label: 'HDL (Good Cholesterol) - الكوليسترول النافع', unit: 'mg/dL', type: 'number', min: 40, max: 60 },
            { id: 'triglycerides', label: 'Triglycerides - الدهون الثلاثية', unit: 'mg/dL', type: 'number', min: 0, max: 150 },
            { id: 'vldl', label: 'VLDL - البروتين الدهني منخفض الكثافة جداً', unit: 'mg/dL', type: 'number', min: 2, max: 30 },
        ]
    },
    {
        id: 'vitamin',
        title: 'Vitamin Tests',
        titleAr: 'فحوصات الفيتامينات',
        fields: [
            { id: 'vit_d', label: 'Vitamin D - فيتامين د', unit: 'ng/mL', type: 'number', min: 30, max: 100 },
            { id: 'vit_b12', label: 'Vitamin B12 - فيتامين ب12', unit: 'pg/mL', type: 'number', min: 200, max: 900 },
            { id: 'folate', label: 'Folate - حمض الفوليك', unit: 'ng/mL', type: 'number', min: 2.7, max: 17.0 },
        ]
    },
    {
        id: 'iron',
        title: 'Iron Studies',
        titleAr: 'دراسة الحديد',
        fields: [
            { id: 'serum_iron', label: 'Serum Iron - حديد المصل', unit: 'µg/dL', type: 'number', min: 60, max: 170 },
            { id: 'ferritin', label: 'Ferritin - مخزون الحديد', unit: 'ng/mL', type: 'number', min: 12, max: 300 },
            { id: 'tibc', label: 'TIBC - سعة ارتباط الحديد الكلية', unit: 'µg/dL', type: 'number', min: 240, max: 450 },
            { id: 'transferrin_sat', label: 'Transferrin Saturation - تشبع الترانسفيرين', unit: '%', type: 'number', min: 20, max: 50 },
        ]
    },
    {
        id: 'urine',
        title: 'G.U.E (General Urine Examination)',
        titleAr: 'فحص البول العام',
        fields: [
            { id: 'color', label: 'Color - اللون', type: 'text' },
            { id: 'appearance', label: 'Appearance - المظهر', type: 'text' },
            { id: 'specific_gravity', label: 'Specific Gravity - الكثافة النوعية', type: 'number', min: 1.005, max: 1.030 },
            { id: 'ph', label: 'pH - الأس الهيدروجيني', type: 'number', min: 4.5, max: 8.0 },
            { id: 'protein', label: 'Protein - البروتين', type: 'select', options: ['Negative', 'Trace', '1+', '2+', '3+', '4+'] },
            { id: 'glucose', label: 'Glucose - الجلوكوز', type: 'select', options: ['Negative', 'Trace', '1+', '2+', '3+', '4+'] },
            { id: 'ketones', label: 'Ketones - الكيتونات', type: 'select', options: ['Negative', 'Trace', '1+', '2+', '3+', '4+'] },
            { id: 'blood', label: 'Blood - الدم', type: 'select', options: ['Negative', 'Trace', '1+', '2+', '3+', '4+'] },
            { id: 'bilirubin', label: 'Bilirubin - البيليروبين', type: 'select', options: ['Negative', '1+', '2+', '3+'] },
            { id: 'urobilinogen', label: 'Urobilinogen - اليوروبيلينوجين', unit: 'EU/dL', type: 'number', min: 0.2, max: 1.0 },
            { id: 'nitrite', label: 'Nitrite - النيتريت', type: 'select', options: ['Negative', 'Positive'] },
            { id: 'leukocyte_esterase', label: 'Leukocyte Esterase - إستراز الكريات البيض', type: 'select', options: ['Negative', 'Trace', '1+', '2+', '3+'] },
            { id: 'rbc_hpf', label: 'RBC / HPF - كريات دم حمراء', type: 'number', min: 0, max: 2 },
            { id: 'wbc_hpf', label: 'WBC / HPF - كريات دم بيضاء', type: 'number', min: 0, max: 5 },
            { id: 'epithelial', label: 'Epithelial Cells - خلايا طلائية', type: 'select', options: ['Few', 'Moderate', 'Many'] },
            { id: 'bacteria', label: 'Bacteria - بكتيريا', type: 'select', options: ['None', 'Few', 'Moderate', 'Many'] },
            { id: 'crystals', label: 'Crystals - بلورات', type: 'text' },
            { id: 'casts', label: 'Casts - اسطوانات', type: 'text' },
        ]
    },
    {
        id: 'stool',
        title: 'G.S.E (General Stool Examination)',
        titleAr: 'فحص البراز العام',
        fields: [
            { id: 'color', label: 'Color - اللون', type: 'text' },
            { id: 'consistency', label: 'Consistency - القوام', type: 'text' },
            { id: 'mucus', label: 'Mucus - مخاط', type: 'select', options: ['Absent', 'Present'] },
            { id: 'blood', label: 'Blood - دم', type: 'select', options: ['Absent', 'Present'] },
            { id: 'occult_blood', label: 'Occult Blood - دم خفي', type: 'select', options: ['Negative', 'Positive'] },
            { id: 'wbc', label: 'WBC - كريات دم بيضاء', type: 'select', options: ['None', 'Few', 'Moderate', 'Many'] },
            { id: 'rbc', label: 'RBC - كريات دم حمراء', type: 'select', options: ['None', 'Few', 'Moderate', 'Many'] },
            { id: 'ova_parasites', label: 'Ova & Parasites - طفيليات وبيوض', type: 'text' },
            { id: 'cysts', label: 'Cysts - أكياس', type: 'text' },
            { id: 'fat', label: 'Fat - دهون', type: 'select', options: ['Absent', 'Present'] },
            { id: 'culture', label: 'Stool Culture Result - نتيجة المزرعة', type: 'text' },
        ]
    },
];

export interface AnalysisResult {
    fieldId: string;
    fieldLabel: string;
    value: string | number;
    status: 'normal' | 'low' | 'high' | 'abnormal' | 'unknown';
    message: string;
}

export const analyzeLabResults = (
    testType: TestType,
    data: Record<string, any>,
    _patientInfo: any
): AnalysisResult[] => {
    const testDef = LAB_TESTS.find(t => t.id === testType);
    if (!testDef) return [];

    const results: AnalysisResult[] = [];

    testDef.fields.forEach(field => {
        const value = data[field.id];
        if (value === undefined || value === '') return;

        let status: AnalysisResult['status'] = 'normal';
        let message = 'ضمن المعدل الطبيعي';

        if (field.type === 'number') {
            const numVal = parseFloat(value);
            if (!isNaN(numVal) && field.min !== undefined && field.max !== undefined) {
                if (numVal < field.min) {
                    status = 'low';
                    message = `أقل من المعدل الطبيعي (${field.min} - ${field.max})`;
                } else if (numVal > field.max) {
                    status = 'high';
                    message = `أعلى من المعدل الطبيعي (${field.min} - ${field.max})`;
                }
            }
        } else if (field.type === 'select') {
            // Basic logic for select fields (mostly for Urine/Stool)
            const abnormalValues = ['Positive', 'Present', 'Many', 'Moderate', '1+', '2+', '3+', '4+'];
            if (abnormalValues.includes(value)) {
                status = 'abnormal';
                message = 'نتيجة غير طبيعية قد تستدعي الانتباه';
            }
        }

        results.push({
            fieldId: field.id,
            fieldLabel: field.label,
            value: value,
            status,
            message
        });
    });

    return results;
};
