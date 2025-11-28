import { motion } from 'framer-motion';
import { Thermometer, Activity, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState } from '../../pages/Diagnosis';

interface Props {
    state: DiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

const chronicDiseasesList = [
    { id: 'diabetes', name: 'السكري' },
    { id: 'hypertension', name: 'ارتفاع ضغط الدم' },
    { id: 'asthma', name: 'الربو' },
    { id: 'heart_disease', name: 'أمراض القلب' },
    { id: 'none', name: 'لا يوجد' },
];

const StepVitals = ({ state, setState, onNext, onPrev }: Props) => {
    const toggleDisease = (id: string) => {
        if (id === 'none') {
            setState(prev => ({
                ...prev,
                vitals: { ...prev.vitals, chronicDiseases: prev.vitals.chronicDiseases.includes('none') ? [] : ['none'] }
            }));
        } else {
            setState(prev => ({
                ...prev,
                vitals: {
                    ...prev.vitals,
                    chronicDiseases: prev.vitals.chronicDiseases.includes('none')
                        ? [id]
                        : prev.vitals.chronicDiseases.includes(id)
                            ? prev.vitals.chronicDiseases.filter(d => d !== id)
                            : [...prev.vitals.chronicDiseases, id]
                }
            }));
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">العلامات الحيوية والتاريخ المرضي</h2>
                <p className="text-slate-500">ساعدنا في فهم حالتك الصحية بشكل أفضل.</p>
            </div>

            {/* Temperature */}
            <div className="space-y-4">
                <label className="text-lg font-medium text-slate-900 flex items-center gap-2">
                    <Thermometer className="text-rose-500" />
                    درجة حرارة الجسم (تقريباً)
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="35"
                        max="42"
                        step="0.1"
                        value={parseFloat(state.vitals.temperature) || 37}
                        onChange={(e) => setState(prev => ({ ...prev, vitals: { ...prev.vitals, temperature: e.target.value } }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="w-20 text-center font-bold text-xl text-primary bg-primary/10 py-2 rounded-xl">
                        {state.vitals.temperature || 37}°C
                    </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>35°C</span>
                    <span>37°C (طبيعي)</span>
                    <span>42°C</span>
                </div>
            </div>

            {/* Chronic Diseases */}
            <div className="space-y-4">
                <label className="text-lg font-medium text-slate-900 flex items-center gap-2">
                    <Activity className="text-blue-500" />
                    هل تعاني من أي أمراض مزمنة؟
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {chronicDiseasesList.map((disease) => {
                        const isSelected = state.vitals.chronicDiseases.includes(disease.id);
                        return (
                            <motion.button
                                key={disease.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleDisease(disease.id)}
                                className={cn(
                                    "p-4 rounded-xl border text-right transition-all flex items-center justify-between",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                                )}
                            >
                                <span className={cn("font-medium", isSelected ? "text-primary" : "text-slate-700")}>
                                    {disease.name}
                                </span>
                                {isSelected && (
                                    <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                        <Check size={12} />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-6 flex justify-between border-t border-slate-100">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-all"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                    مراجعة البيانات
                </button>
            </div>
        </div>
    );
};

export default StepVitals;
