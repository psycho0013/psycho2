import { motion } from 'framer-motion';
import { ArrowRight, Beaker } from 'lucide-react';
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
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <Beaker size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{testDef.title}</h2>
                        <p className="text-sm text-slate-500">أدخل قيم الفحص كما في ورقة التحليل</p>
                    </div>
                </div>
                <button onClick={onBack} className="text-sm px-4 py-2 rounded-lg bg-white/50 hover:bg-white text-slate-500 hover:text-red-500 transition-all">
                    تغيير التحليل
                </button>
            </div>

            <div className="glass-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {testDef.fields.map((field, idx) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="space-y-2 group"
                    >
                        <label className="flex items-center justify-between text-sm font-medium text-slate-700 group-focus-within:text-primary transition-colors">
                            <span>{field.label}</span>
                            {field.unit && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 group-focus-within:bg-primary/10 group-focus-within:text-primary transition-colors">{field.unit}</span>}
                        </label>

                        {field.type === 'select' ? (
                            <div className="relative">
                                <select
                                    value={data[field.id] || ''}
                                    onChange={(e) => update(field.id, e.target.value)}
                                    className="glass-input appearance-none cursor-pointer"
                                >
                                    <option value="">اختر القيمة</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                value={data[field.id] || ''}
                                onChange={(e) => update(field.id, e.target.value)}
                                className="glass-input"
                                placeholder={field.unit ? `0.00` : ''}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200/50">
                <button
                    onClick={onBack}
                    className="glass-button px-8 py-3 hover:bg-white/60"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="glass-button glass-button-primary px-10 py-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    التالي: تحليل النتائج
                </button>
            </div>
        </div>
    );
};

export default LabTestForm;
