import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState } from '../../pages/Diagnosis';
import type { Symptom } from '@/types/medical';
import DbManager from '@/services/dbManager';

interface Props {
    state: DiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

const StepRelatedSymptoms = ({ state, setState, onNext, onPrev }: Props) => {
    const [suggestedSymptoms, setSuggestedSymptoms] = useState<Symptom[]>([]);
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await DbManager.getSymptoms();
            setSymptomsList(data);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (symptomsList.length === 0) return;

        // Simple logic: Suggest symptoms from the same categories as selected ones
        const selectedCategories = new Set(
            state.selectedSymptoms
                .map((s) => symptomsList.find((sym) => sym.id === s.id)?.category)
                .filter(Boolean)
        );

        const suggestions = symptomsList.filter(
            (s) =>
                selectedCategories.has(s.category) &&
                !state.selectedSymptoms.find((sel) => sel.id === s.id)
        );

        setSuggestedSymptoms(suggestions.slice(0, 5)); // Limit to 5 suggestions
    }, [state.selectedSymptoms, symptomsList]);

    const toggleRelated = (id: string) => {
        if (state.relatedSymptoms.includes(id)) {
            setState((prev) => ({
                ...prev,
                relatedSymptoms: prev.relatedSymptoms.filter((sid) => sid !== id),
            }));
        } else {
            setState((prev) => ({
                ...prev,
                relatedSymptoms: [...prev.relatedSymptoms, id],
            }));
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    أعراض ذات صلة
                </h2>
                <p className="text-slate-500">بناءً على اختيارك، قد تكون تعاني أيضاً من هذه الأعراض.</p>
            </div>

            {suggestedSymptoms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestedSymptoms.map((symptom) => {
                        const isSelected = state.relatedSymptoms.includes(symptom.id);
                        return (
                            <motion.button
                                key={symptom.id}
                                layout
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleRelated(symptom.id)}
                                className={cn(
                                    "glass-card p-4 flex items-center justify-between group h-20",
                                    isSelected && "selected bg-primary/5 border-primary/50"
                                )}
                            >
                                <span className={cn(
                                    "font-bold text-lg transition-colors",
                                    isSelected ? "text-primary" : "text-slate-700"
                                )}>
                                    {symptom.name}
                                </span>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                                    isSelected ? "bg-primary text-white scale-110 shadow-primary/30" : "bg-white text-slate-400 group-hover:text-primary"
                                )}>
                                    {isSelected ? <Check size={16} /> : <Plus size={16} />}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300/50">
                    <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
                        <Info size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">لم يتم العثور على أعراض إضافية ذات صلة.</p>
                </div>
            )}

            <div className="pt-6 flex justify-between border-t border-slate-200/50">
                <button
                    onClick={onPrev}
                    className="glass-button px-8 py-3 hover:bg-white/60"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="glass-button glass-button-primary px-10 py-3"
                >
                    {state.relatedSymptoms.length > 0 ? 'متابعة' : 'تخطي ومتابعة'}
                </button>
            </div>
        </div>
    );
};

export default StepRelatedSymptoms;
