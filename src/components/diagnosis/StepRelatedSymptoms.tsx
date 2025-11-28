import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">هل لديك أي من هذه الأعراض ذات الصلة؟</h2>
                <p className="text-slate-500">بناءً على ما أخبرتنا به، قد تعاني أيضاً من هذه الأعراض.</p>
            </div>

            {suggestedSymptoms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestedSymptoms.map((symptom) => {
                        const isSelected = state.relatedSymptoms.includes(symptom.id);
                        return (
                            <motion.button
                                key={symptom.id}
                                layout
                                onClick={() => toggleRelated(symptom.id)}
                                className={cn(
                                    "p-4 rounded-xl border text-right transition-all flex items-center justify-between group",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                                )}
                            >
                                <span className={cn("font-medium", isSelected ? "text-primary" : "text-slate-700")}>
                                    {symptom.name}
                                </span>
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                    isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500">لم يتم العثور على أعراض ذات صلة بناءً على اختيارك.</p>
                </div>
            )}

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
                    {state.relatedSymptoms.length > 0 ? 'الخطوة التالية' : 'تخطي ومتابعة'}
                </button>
            </div>
        </div>
    );
};

export default StepRelatedSymptoms;
