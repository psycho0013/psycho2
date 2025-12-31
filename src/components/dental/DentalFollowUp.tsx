/**
 * Dental Follow Up Component - Premium Version
 * خطوة الأسئلة الإضافية - النسخة المحسنة
 */

import { motion } from 'framer-motion';
import {
    MapPin,
    Clock,
    ChevronRight,
    Check,
    X,
    HelpCircle,
    Calendar,
    AlertCircle
} from 'lucide-react';
import type { DentalDiagnosisState } from '@/types/dental';
import { followUpQuestionsBySymptom } from '@/data/dentalSymptoms';
import DentalMap from './DentalMap';

interface DentalFollowUpProps {
    state: DentalDiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DentalDiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

const durationOptions = [
    { id: 'today', label: 'اليوم', color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
    { id: '1-3-days', label: '1-3 أيام', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
    { id: '3-7-days', label: '3-7 أيام', color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-200' },
    { id: 'more-than-week', label: 'أكثر من أسبوع', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
    { id: 'chronic', label: 'مشكلة مزمنة', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
];

export default function DentalFollowUp({ state, setState, onNext, onPrev }: DentalFollowUpProps) {
    // الحصول على الأسئلة الإضافية
    const getRelevantQuestions = () => {
        const questions: { symptomId: string; question: string; type: 'boolean' | 'choice'; options?: string[]; key: string }[] = [];

        state.selectedSymptoms.forEach(symptom => {
            const symptomQuestions = followUpQuestionsBySymptom[symptom.id];
            if (symptomQuestions) {
                symptomQuestions.forEach((q, idx) => {
                    questions.push({
                        symptomId: symptom.id,
                        question: q.question,
                        type: q.type,
                        options: q.options,
                        key: `${symptom.id}_${idx}`,
                    });
                });
            }
        });

        return questions;
    };

    const questions = getRelevantQuestions();

    const updateAnswer = (key: string, value: string | boolean) => {
        setState(prev => ({
            ...prev,
            followUpAnswers: {
                ...prev.followUpAnswers,
                [key]: value,
            }
        }));
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-4">
                    <HelpCircle size={14} className="fill-blue-600/20" />
                    خطوة 3 من 4
                </span>
                <h2 className="text-2xl font-bold text-slate-800">تفاصيل إضافية</h2>
                <p className="text-slate-500 mt-2">تحديد الموقع والمدة يساعد في دقة التشخيص</p>
            </div>

            {/* تحديد منطقة المشكلة */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">أين المشكلة؟</h3>
                        <p className="text-slate-500 text-sm">حدد السن أو المنطقة المصابة</p>
                    </div>
                </div>
                <DentalMap
                    selectedArea={state.problemArea}
                    selectedTooth={state.selectedTooth}
                    onSelectArea={(area) => setState(prev => ({ ...prev, problemArea: area }))}
                    onSelectTooth={(tooth) => setState(prev => ({ ...prev, selectedTooth: tooth }))}
                />
            </div>

            {/* مدة المشكلة */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-700">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">مدة الأعراض</h3>
                        <p className="text-slate-500 text-sm">منذ متى بدأت تشعر بالمشكلة؟</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {durationOptions.map((option, index) => (
                        <motion.button
                            key={option.id}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setState(prev => ({
                                ...prev,
                                problemDuration: option.id as DentalDiagnosisState['problemDuration']
                            }))}
                            className={`
                                p-4 rounded-2xl transition-all duration-300 border-2
                                flex flex-col items-center justify-center gap-2 font-bold
                                ${state.problemDuration === option.id
                                    ? `${option.bgColor} ${option.color} border-current shadow-lg`
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                }
                            `}
                        >
                            <Clock size={20} className={state.problemDuration === option.id ? 'opacity-100' : 'opacity-50'} />
                            <span>{option.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* الأسئلة الإضافية */}
            {questions.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">أسئلة توضيحية</h3>
                            <p className="text-slate-500 text-sm">إجابات دقيقة = تشخيص أدق</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <motion.div
                                key={q.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                            >
                                <p className="font-bold text-slate-700 mb-4 flex items-start gap-2">
                                    <AlertCircle size={18} className="text-slate-400 mt-1 shrink-0" />
                                    {q.question}
                                </p>

                                {q.type === 'boolean' ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateAnswer(q.key, true)}
                                            className={`
                                                flex-1 py-3 px-4 rounded-xl transition-all duration-200 border-2
                                                flex items-center justify-center gap-2 font-bold
                                                ${state.followUpAnswers[q.key] === true
                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
                                                }
                                            `}
                                        >
                                            <Check size={18} />
                                            نعم
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateAnswer(q.key, false)}
                                            className={`
                                                flex-1 py-3 px-4 rounded-xl transition-all duration-200 border-2
                                                flex items-center justify-center gap-2 font-bold
                                                ${state.followUpAnswers[q.key] === false
                                                    ? 'bg-slate-800 border-slate-800 text-white shadow-lg'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                                }
                                            `}
                                        >
                                            <X size={18} />
                                            لا
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options?.map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => updateAnswer(q.key, option)}
                                                className={`
                                                    py-3 px-4 rounded-xl transition-all duration-200 border-2 text-right
                                                    text-sm font-bold
                                                    ${state.followUpAnswers[q.key] === option
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200'
                                                    }
                                                `}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={onPrev}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="flex-[2] py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                    <span>عرض النتائج</span>
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
