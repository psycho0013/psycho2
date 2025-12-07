import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';
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
        <div className="space-y-8">
            <div className="text-center relative z-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    بماذا تشعر؟
                </h2>
                <p className="text-slate-500">اختر الأعراض التي تعاني منها حالياً وسنساعدك في التشخيص.</p>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide -mx-2">
                {symptomCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "px-5 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 backdrop-blur-md",
                            activeCategory === cat.id
                                ? "bg-slate-900/90 text-white shadow-lg shadow-slate-900/20 scale-105"
                                : "bg-white/40 text-slate-600 hover:bg-white/60 border border-white/50"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-96 overflow-y-auto pr-2 custom-scrollbar">
                {filteredSymptoms.map((symptom) => {
                    const isSelected = state.selectedSymptoms.find((s) => s.id === symptom.id);
                    return (
                        <motion.button
                            key={symptom.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleSymptom(symptom)}
                            className={cn(
                                "glass-card p-5 flex flex-col justify-between h-28 text-right group relative",
                                isSelected && "selected border-primary/50 bg-primary/5"
                            )}
                        >
                            <span className={cn(
                                "font-bold text-lg transition-colors",
                                isSelected ? "text-primary" : "text-slate-700 group-hover:text-slate-900"
                            )}>
                                {symptom.name}
                            </span>

                            {isSelected ? (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 self-start font-medium"
                                >
                                    {isSelected.severity === 'mild' ? 'خفيف' : isSelected.severity === 'moderate' ? 'محتمل' : 'شديد'}
                                </motion.span>
                            ) : (
                                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-slate-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Activity size={16} className="text-slate-400" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Severity Modal */}
            <AnimatePresence>
                {selectedSymptomForSeverity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                            onClick={() => setSelectedSymptomForSeverity(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel p-6 w-full max-w-sm relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">ما مدى حدة {selectedSymptomForSeverity.name}؟</h3>
                                <button onClick={() => setSelectedSymptomForSeverity(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                                    <button
                                        key={sev}
                                        onClick={() => confirmSeverity(sev)}
                                        className="group w-full p-4 rounded-2xl border border-white/60 bg-white/40 hover:bg-white/80 hover:scale-[1.02] active:scale-[0.98] transition-all text-right shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "font-bold text-lg",
                                                sev === 'severe' ? "text-rose-600" : sev === 'moderate' ? "text-amber-600" : "text-emerald-600"
                                            )}>
                                                {sev === 'mild' ? 'خفيف' : sev === 'moderate' ? 'متوسط' : 'شديد'}
                                            </span>
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                sev === 'severe' ? "bg-rose-500" : sev === 'moderate' ? "bg-amber-500" : "bg-emerald-500"
                                            )} />
                                        </div>
                                        <div className="text-xs text-slate-500 opacity-80 group-hover:opacity-100">
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

            <div className="pt-6 flex justify-between border-t border-slate-200/50">
                <button
                    onClick={onPrev}
                    className="glass-button px-8 py-3 hover:bg-white/60"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    disabled={state.selectedSymptoms.length === 0}
                    className="glass-button glass-button-primary px-10 py-3 disabled:opacity-50 disabled:grayscale"
                >
                    الخطوة التالية
                </button>
            </div>
        </div>
    );
};

export default StepSymptoms;
