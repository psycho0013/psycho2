import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState } from '../../pages/Diagnosis';
import { symptomCategories, type Symptom, type Severity } from '@/types/medical';
import DbManager from '@/services/dbManager';

interface Props {
    state: DiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

const StepSymptoms = ({ state, setState, onNext, onPrev }: Props) => {
    const [activeCategory, setActiveCategory] = useState(symptomCategories[0].id);
    const [selectedSymptomForSeverity, setSelectedSymptomForSeverity] = useState<Symptom | null>(null);
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await DbManager.getSymptoms();
            setSymptomsList(data);
        };
        loadData();
    }, []);

    const toggleSymptom = (symptom: Symptom) => {
        const exists = state.selectedSymptoms.find((s) => s.id === symptom.id);
        if (exists) {
            setState((prev) => ({
                ...prev,
                selectedSymptoms: prev.selectedSymptoms.filter((s) => s.id !== symptom.id),
            }));
        } else {
            setSelectedSymptomForSeverity(symptom);
        }
    };

    const confirmSeverity = (severity: Severity) => {
        if (selectedSymptomForSeverity) {
            setState((prev) => ({
                ...prev,
                selectedSymptoms: [...prev.selectedSymptoms, { id: selectedSymptomForSeverity.id, severity }],
            }));
            setSelectedSymptomForSeverity(null);
        }
    };

    const filteredSymptoms = symptomsList.filter((s) => s.category === activeCategory);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">بماذا تشعر؟</h2>
            <p className="text-slate-500 mb-6">اختر الأعراض التي تعاني منها حالياً.</p>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {symptomCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                            activeCategory === cat.id
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 h-80 overflow-y-auto pr-2">
                {filteredSymptoms.map((symptom) => {
                    const isSelected = state.selectedSymptoms.find((s) => s.id === symptom.id);
                    return (
                        <motion.button
                            key={symptom.id}
                            layout
                            onClick={() => toggleSymptom(symptom)}
                            className={cn(
                                "p-4 rounded-xl border text-right transition-all flex flex-col justify-between h-24",
                                isSelected
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                            )}
                        >
                            <span className={cn("font-medium", isSelected ? "text-primary" : "text-slate-700")}>
                                {symptom.name}
                            </span>
                            {isSelected && (
                                <span className="text-xs px-2 py-1 rounded bg-primary text-white self-start">
                                    {isSelected.severity}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Severity Modal */}
            <AnimatePresence>
                {selectedSymptomForSeverity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-900">ما مدى حدة {selectedSymptomForSeverity.name}؟</h3>
                                <button onClick={() => setSelectedSymptomForSeverity(null)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                                    <button
                                        key={sev}
                                        onClick={() => confirmSeverity(sev)}
                                        className="w-full p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 text-right transition-all"
                                    >
                                        <div className="font-bold text-slate-900 capitalize">
                                            {sev === 'mild' ? 'خفيف' : sev === 'moderate' ? 'متوسط' : 'شديد'}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {sev === 'mild' ? 'انزعاج بسيط، لا يؤثر على الحياة اليومية' :
                                                sev === 'moderate' ? 'مزعج، قد يحد من بعض الأنشطة' :
                                                    'ألم شديد، يمنع الأنشطة اليومية'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="pt-6 flex justify-between border-t border-slate-100">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-all"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    disabled={state.selectedSymptoms.length === 0}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    الخطوة التالية
                </button>
            </div>
        </div>
    );
};

export default StepSymptoms;
