import { motion } from 'framer-motion';
import { LAB_TESTS, type TestType } from '@/services/labAnalysisService';

interface Props {
    testType: TestType;
    data: Record<string, any>;
    update: (fieldId: string, value: any) => void;
    onNext: () => void;
    onBack: () => void;
}

const LabTestForm = ({ testType, data, update, onNext, onBack }: Props) => {
    const testDef = LAB_TESTS.find(t => t.id === testType);

    if (!testDef) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">{testDef.title}</h2>
                <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900">
                    تغيير التحليل
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testDef.fields.map((field) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        <label className="block text-sm font-medium text-slate-700">
                            {field.label}
                            {field.unit && <span className="text-slate-400 mr-1">({field.unit})</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                value={data[field.id] || ''}
                                onChange={(e) => update(field.id, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="">اختر القيمة</option>
                                {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                value={data[field.id] || ''}
                                onChange={(e) => update(field.id, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder={field.unit ? `القيمة بـ ${field.unit}` : ''}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                    التالي: بيانات المريض
                </button>
            </div>
        </div>
    );
};

export default LabTestForm;
