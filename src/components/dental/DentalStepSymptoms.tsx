/**
 * Dental Step Symptoms Component - Refined Version
 * خطوة اختيار أعراض الأسنان - نسخة محسنة
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    Thermometer,
    Droplets,
    Eye,
    Settings,
    Activity,
    Check,
    X,
    ChevronRight,
    Star
} from 'lucide-react';
import type { DentalDiagnosisState, DentalSeverity } from '@/types/dental';
import { dentalSymptoms, dentalSymptomCategories } from '@/data/dentalSymptoms';

interface DentalStepSymptomsProps {
    state: DentalDiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DentalDiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

// أيقونات الفئات - Lucide
const categoryIcons: Record<string, React.ReactNode> = {
    pain: <AlertCircle size={20} />,
    gum: <Droplets size={20} />,
    appearance: <Eye size={20} />,
    function: <Settings size={20} />,
    general: <Thermometer size={20} />,
};

const severityOptions: { id: DentalSeverity; label: string; description: string; color: string; bgColor: string; icon: React.ReactNode }[] = [
    {
        id: 'mild',
        label: 'خفيف',
        description: 'ألم بسيط يمكن تحمله، لا يوقظني من النوم',
        color: 'text-emerald-600',
        bgColor: 'from-emerald-400 to-emerald-500',
        icon: <Activity size={24} />
    },
    {
        id: 'moderate',
        label: 'متوسط',
        description: 'ألم مزعج يحتاج لمسكنات، يؤثر على التركيز',
        color: 'text-amber-600',
        bgColor: 'from-amber-400 to-orange-500',
        icon: <AlertCircle size={24} />
    },
    {
        id: 'severe',
        label: 'شديد',
        description: 'ألم لا يحتمل، يمنع النوم والأكل',
        color: 'text-red-600',
        bgColor: 'from-red-500 to-rose-600',
        icon: <Thermometer size={24} />
    },
];

export default function DentalStepSymptoms({ state, setState, onNext, onPrev }: DentalStepSymptomsProps) {
    const [activeCategory, setActiveCategory] = useState<string>('pain');
    const [showSeverityModal, setShowSeverityModal] = useState<string | null>(null);

    const isSymptomSelected = (symptomId: string) => {
        return state.selectedSymptoms.some(s => s.id === symptomId);
    };

    const getSelectedSeverity = (symptomId: string): DentalSeverity | null => {
        const symptom = state.selectedSymptoms.find(s => s.id === symptomId);
        return symptom?.severity || null;
    };

    const toggleSymptom = (symptomId: string, severity?: DentalSeverity) => {
        if (isSymptomSelected(symptomId) && !severity) {
            setState(prev => ({
                ...prev,
                selectedSymptoms: prev.selectedSymptoms.filter(s => s.id !== symptomId)
            }));
        } else if (severity) {
            setState(prev => {
                const existing = prev.selectedSymptoms.filter(s => s.id !== symptomId);
                return {
                    ...prev,
                    selectedSymptoms: [...existing, { id: symptomId, severity }]
                };
            });
            setShowSeverityModal(null);
        } else {
            setShowSeverityModal(symptomId);
        }
    };

    const currentSymptoms = dentalSymptoms.filter(s => s.category === activeCategory);
    const isValid = state.selectedSymptoms.length > 0;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-4">
                    <Star size={14} className="fill-blue-600" />
                    خطوة 2 من 4
                </span>
                <h2 className="text-2xl font-bold text-slate-800">الأعراض الظاهرة</h2>
                <p className="text-slate-500 mt-2">اختر الفئة ثم حدد الأعراض التي تعاني منها</p>
            </div>

            {/* شريط الفئات */}
            <div className="flex overflow-x-auto gap-3 pb-4 -mx-2 px-2 scrollbar-hide snap-x">
                {dentalSymptomCategories.map(category => {
                    const isActive = activeCategory === category.id;
                    return (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveCategory(category.id)}
                            className={`
                                flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap
                                font-bold transition-all duration-300 shrink-0 snap-start
                                ${isActive
                                    ? 'bg-slate-800 text-white shadow-xl shadow-slate-200 ring-2 ring-offset-2 ring-slate-800'
                                    : 'bg-white border text-slate-500 hover:border-slate-300'
                                }
                            `}
                        >
                            <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                                {categoryIcons[category.id]}
                            </span>
                            <span>{category.name}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* قائمة الأعراض */}
            <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-3"
            >
                {currentSymptoms.map(symptom => {
                    const isSelected = isSymptomSelected(symptom.id);
                    const severity = getSelectedSeverity(symptom.id);
                    const severityInfo = severity ? severityOptions.find(s => s.id === severity) : null;

                    return (
                        <motion.button
                            key={symptom.id}
                            whileHover={{ scale: 1.01, backgroundColor: isSelected ? undefined : '#f8fafc' }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleSymptom(symptom.id)}
                            className={`
                                group relative p-5 rounded-2xl text-right transition-all duration-200
                                w-full border-2
                                ${isSelected
                                    ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 z-10'
                                    : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-slate-100'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className={`font-bold text-lg ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                                            {symptom.name}
                                        </h3>
                                        {isSelected && severityInfo && (
                                            <span className={`
                                                inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold
                                                bg-gradient-to-r ${severityInfo.bgColor} text-white
                                            `}>
                                                {severityInfo.label}
                                            </span>
                                        )}
                                    </div>
                                    {symptom.description && (
                                        <p className="text-sm text-slate-400 font-medium group-hover:text-slate-500 transition-colors">
                                            {symptom.description}
                                        </p>
                                    )}
                                </div>

                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0
                                    ${isSelected
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 rotate-0'
                                        : 'bg-slate-50 text-slate-300 rotate-0 group-hover:bg-emerald-50 group-hover:text-emerald-300'
                                    }
                                `}>
                                    {isSelected ? <Check size={24} strokeWidth={3} /> : <ChevronRight size={24} />}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Centered Modal for Severity */}
            <AnimatePresence>
                {showSeverityModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSeverityModal(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />

                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-20"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">تحديد الشدة</h3>
                                        <p className="text-slate-500 mt-2 font-medium bg-slate-100 inline-block px-3 py-1 rounded-lg">
                                            {dentalSymptoms.find(s => s.id === showSeverityModal)?.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowSeverityModal(null)}
                                        className="w-10 h-10 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {severityOptions.map((severity) => (
                                        <button
                                            key={severity.id}
                                            onClick={() => toggleSymptom(showSeverityModal, severity.id)}
                                            className={`
                                                w-full p-4 rounded-2xl flex items-center gap-5 transition-all duration-200
                                                border-2 hover:shadow-xl group text-right relative overflow-hidden
                                                ${severity.id === 'mild' ? 'border-emerald-100 hover:border-emerald-200 bg-emerald-50/30' :
                                                    severity.id === 'moderate' ? 'border-amber-100 hover:border-amber-200 bg-amber-50/30' :
                                                        'border-red-100 hover:border-red-200 bg-red-50/30'}
                                            `}
                                        >
                                            <div className={`
                                                w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg
                                                bg-gradient-to-br ${severity.bgColor} z-10
                                            `}>
                                                {severity.icon}
                                            </div>
                                            <div className="flex-1 z-10">
                                                <span className={`block font-bold text-lg mb-1 ${severity.color}`}>
                                                    {severity.label}
                                                </span>
                                                <span className="text-sm text-slate-500 font-medium block leading-relaxed">
                                                    {severity.description}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
                                                <Check size={20} strokeWidth={3} />
                                            </div>

                                            {/* Hover Gradient Background */}
                                            <div className={`
                                                absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                                                bg-gradient-to-r ${severity.bgColor}
                                            `} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button
                    onClick={onPrev}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`
                        flex-[2] py-4 rounded-2xl font-bold text-white transition-all shadow-xl
                        flex items-center justify-center gap-2
                        ${isValid
                            ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200 hover:translate-y-[-2px]'
                            : 'bg-slate-300 cursor-not-allowed shadow-none'}
                    `}
                >
                    <span>التالي</span>
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
