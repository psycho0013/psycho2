/**
 * Dental Step Info Component - Premium Version
 * خطوة المعلومات الأساسية لتشخيص الأسنان - النسخة المحسنة
 */

import { motion } from 'framer-motion';
import {
    User,
    Calendar,
    Heart,
    ChevronRight,
    Stethoscope
} from 'lucide-react';
import type { DentalDiagnosisState } from '@/types/dental';
import { DENTAL_CHRONIC_DISEASES } from '@/types/dental';

interface DentalStepInfoProps {
    data: DentalDiagnosisState['patientInfo'];
    onUpdate: (data: Partial<DentalDiagnosisState['patientInfo']>) => void;
    onNext: () => void;
}

const lastVisitOptions = [
    { id: 'less-6-months', label: 'أقل من 6 أشهر', color: 'from-emerald-500 to-green-500' },
    { id: '6-12-months', label: '6-12 شهر', color: 'from-blue-500 to-indigo-500' },
    { id: 'more-than-year', label: 'أكثر من سنة', color: 'from-amber-500 to-orange-500' },
    { id: 'never', label: 'لم أزر أبداً', color: 'from-red-500 to-rose-500' },
];

export default function DentalStepInfo({ data, onUpdate, onNext }: DentalStepInfoProps) {
    const isValid = data.age && parseInt(data.age) > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) onNext();
    };

    const toggleChronicDisease = (diseaseId: string) => {
        const current = data.chronicDiseases || [];
        const newDiseases = current.includes(diseaseId)
            ? current.filter(d => d !== diseaseId)
            : [...current, diseaseId];
        onUpdate({ chronicDiseases: newDiseases });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* العنوان */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 
                               rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30
                               rotate-12"
                >
                    <Stethoscope size={36} className="text-white -rotate-12" />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-800">معلوماتك الأساسية</h2>
                <p className="text-slate-500 mt-2">بعض المعلومات لمساعدتنا على تقديم تشخيص أدق</p>
            </div>

            {/* العمر والجنس */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* العمر */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <User size={16} className="text-slate-500" />
                        العمر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max="120"
                            value={data.age}
                            onChange={(e) => onUpdate({ age: e.target.value })}
                            placeholder="25"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 
                                     focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20
                                     transition-all duration-300 text-lg font-semibold
                                     bg-white hover:border-slate-300"
                        />
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                            سنة
                        </span>
                    </div>
                </div>

                {/* الجنس */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Heart size={16} className="text-slate-500" />
                        الجنس
                    </label>
                    <div className="flex gap-3">
                        {[
                            { id: 'male', label: 'ذكر', color: 'from-blue-500 to-indigo-500' },
                            { id: 'female', label: 'أنثى', color: 'from-pink-500 to-rose-500' },
                        ].map(option => (
                            <motion.button
                                key={option.id}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onUpdate({ gender: option.id as 'male' | 'female' })}
                                className={`
                                    flex-1 py-4 px-4 rounded-2xl transition-all duration-300
                                    flex items-center justify-center gap-2 font-semibold
                                    ${data.gender === option.id
                                        ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300'
                                    }
                                `}
                            >
                                {option.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* للإناث: الحمل والرضاعة */}
            {data.gender === 'female' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50"
                >
                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: 'pregnant', label: 'حامل', checked: data.isPregnant, onChange: (v: boolean) => onUpdate({ isPregnant: v }) },
                            { id: 'breastfeeding', label: 'مرضعة', checked: data.isBreastfeeding, onChange: (v: boolean) => onUpdate({ isBreastfeeding: v }) },
                        ].map(option => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`
                                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                                    ${option.checked
                                        ? 'bg-gradient-to-br from-pink-500 to-rose-500 border-pink-500'
                                        : 'border-pink-300 bg-white group-hover:border-pink-400'
                                    }
                                `}>
                                    {option.checked && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <ChevronRight size={14} className="text-white rotate-45" />
                                        </motion.div>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={option.checked}
                                    onChange={(e) => option.onChange(e.target.checked)}
                                    className="hidden"
                                />
                                <span className="font-medium text-slate-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* آخر زيارة لطبيب الأسنان */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Calendar size={16} className="text-slate-500" />
                    آخر زيارة لطبيب الأسنان
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {lastVisitOptions.map((option, index) => (
                        <motion.button
                            key={option.id}
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onUpdate({ lastDentalVisit: option.id as DentalDiagnosisState['patientInfo']['lastDentalVisit'] })}
                            className={`
                                p-4 rounded-2xl transition-all duration-300
                                flex items-center justify-center font-medium
                                ${data.lastDentalVisit === option.id
                                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                                    : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md'
                                }
                            `}
                        >
                            {option.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* الأمراض المزمنة */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Heart size={16} className="text-slate-500" />
                    هل تعاني من أمراض مزمنة؟
                    <span className="text-slate-400 font-normal text-xs">(اختياري)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {DENTAL_CHRONIC_DISEASES.map(disease => {
                        const isSelected = data.chronicDiseases?.includes(disease.id);
                        return (
                            <motion.button
                                key={disease.id}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleChronicDisease(disease.id)}
                                className={`
                                    px-4 py-2.5 rounded-xl transition-all duration-300
                                    flex items-center gap-2 font-medium text-sm
                                    ${isSelected
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-amber-300'
                                    }
                                `}
                            >
                                {disease.name}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* زر المتابعة */}
            <motion.button
                type="submit"
                disabled={!isValid}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                className={`
                    w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300
                    flex items-center justify-center gap-3
                    ${isValid
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                `}
            >
                <span>التالي</span>
                <ChevronRight size={22} />
            </motion.button>
        </form>
    );
}
