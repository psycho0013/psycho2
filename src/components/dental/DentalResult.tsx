/**
 * Dental Diagnosis Result Component - Premium Version
 * صفحة نتائج تشخيص الأسنان - النسخة المحسنة
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Pill,
    Shield,
    RefreshCw,
    FileText,
    Check,
    ChevronRight,
    MapPin,
    Clock,
    Activity
} from 'lucide-react';
import type { DentalDiagnosisState } from '@/types/dental';
import { PROBLEM_AREA_NAMES } from '@/types/dental';
import { dentalSymptoms } from '@/data/dentalSymptoms';
import {
    getTopDentalCandidates,
    formatResultsForDisplay,
    getTemporaryAdvice
} from '@/lib/dentalMatcher';
import UrgencyBadge from './UrgencyBadge';

interface DentalResultProps {
    state: DentalDiagnosisState;
    onRestart?: () => void;
}

export default function DentalResult({ state, onRestart }: DentalResultProps) {
    const { primary, secondary, urgency } = useMemo(() => {
        const candidates = getTopDentalCandidates(
            state.selectedSymptoms,
            state.followUpAnswers,
            5
        );
        return formatResultsForDisplay(candidates);
    }, [state.selectedSymptoms, state.followUpAnswers]);

    const temporaryAdvice = useMemo(() => {
        return getTemporaryAdvice(state.selectedSymptoms);
    }, [state.selectedSymptoms]);

    const getSymptomName = (id: string) => {
        return dentalSymptoms.find(s => s.id === id)?.name || id;
    };

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'from-emerald-400 to-emerald-500';
        if (score >= 50) return 'from-amber-400 to-orange-500';
        if (score >= 30) return 'from-orange-400 to-red-500';
        return 'from-slate-300 to-slate-400';
    };

    return (
        <div className="space-y-8">
            {/* شارة الإلحاح */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <UrgencyBadge level={urgency} size="lg" showMessage={true} animate={true} />
            </motion.div>

            {/* تحذير للحالات الطارئة */}
            {urgency === 'emergency' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white rounded-3xl shadow-2xl shadow-red-500/30"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-2">تحذير مهم!</h3>
                            <p className="text-red-100 leading-relaxed">
                                الأعراض التي وصفتها قد تشير لحالة تستدعي رعاية طبية عاجلة.
                                إذا كان لديك صعوبة في التنفس أو البلع، اذهب للطوارئ فوراً!
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* النتيجة الرئيسية */}
            {primary && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
                >
                    {/* رأس البطاقة */}
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-emerald-100 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                                التشخيص المحتمل الأول
                            </span>
                            <div className="bg-white/20 px-4 py-1.5 rounded-full">
                                <span className="text-lg font-bold">{Math.round(primary.score)}%</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold">{primary.problem.name}</h2>
                        <p className="text-emerald-100 text-sm mt-1">{primary.problem.name_en}</p>
                    </div>

                    {/* محتوى البطاقة */}
                    <div className="p-6 space-y-6">
                        {/* الوصف */}
                        <p className="text-slate-600 leading-relaxed text-base">{primary.problem.description}</p>

                        {/* شريط التقدم */}
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">نسبة التطابق</span>
                                <span className="font-bold text-emerald-600">{Math.round(primary.matchPercentage)}%</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${primary.matchPercentage}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${getScoreColor(primary.matchPercentage)} rounded-full`}
                                />
                            </div>
                        </div>

                        {/* الأعراض المتطابقة */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                                    <Check size={16} />
                                </div>
                                <h4 className="font-bold text-slate-700">الأعراض المتطابقة</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {primary.matchedSymptoms.map(id => (
                                    <span
                                        key={id}
                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200/50"
                                    >
                                        {getSymptomName(id)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* العلاجات */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                    <Pill size={16} />
                                </div>
                                <h4 className="font-bold text-slate-700">العلاجات الممكنة</h4>
                            </div>
                            <ul className="space-y-2">
                                {primary.problem.treatments.map((treatment, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                        {treatment}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* الوقاية */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/50">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                    <Shield size={16} />
                                </div>
                                <h4 className="font-bold text-blue-700">للوقاية مستقبلاً</h4>
                            </div>
                            <ul className="space-y-2">
                                {primary.problem.prevention.slice(0, 3).map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-blue-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* تحذير إضافي */}
                        {primary.problem.warning && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                                        <AlertTriangle size={16} />
                                    </div>
                                    <p className="text-amber-700 font-medium">{primary.problem.warning}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* النتائج الثانوية */}
            {secondary.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-slate-500" />
                        احتمالات أخرى
                    </h3>
                    <div className="space-y-3">
                        {secondary.map((result) => (
                            <motion.div
                                key={result.problem.id}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between shadow-md hover:shadow-lg transition-all"
                            >
                                <div>
                                    <h4 className="font-bold text-slate-700">{result.problem.name}</h4>
                                    <p className="text-sm text-slate-500">{result.problem.name_en}</p>
                                </div>
                                <div className="text-left">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                                        {Math.round(result.score)}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* نصائح مؤقتة */}
            {temporaryAdvice.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-6 border border-purple-100/50 shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <Pill size={20} />
                        </div>
                        <h3 className="font-bold text-purple-700 text-lg">نصائح مؤقتة قبل زيارة الطبيب</h3>
                    </div>
                    <ul className="space-y-3">
                        {temporaryAdvice.map((advice, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-purple-600">
                                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                                    <ChevronRight size={14} />
                                </div>
                                {advice}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* ملخص المعلومات */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-50 rounded-3xl p-6"
            >
                <h3 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-slate-500" />
                    ملخص معلوماتك
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                            <Activity size={16} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">العمر</span>
                            <span className="font-bold text-slate-700">{state.patientInfo.age} سنة</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-500">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">منطقة المشكلة</span>
                            <span className="font-bold text-slate-700 text-sm">{PROBLEM_AREA_NAMES[state.problemArea]}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                            <Check size={16} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">عدد الأعراض</span>
                            <span className="font-bold text-slate-700">{state.selectedSymptoms.length} أعراض</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500">
                            <Clock size={16} />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">مدة المشكلة</span>
                            <span className="font-bold text-slate-700 text-sm">
                                {state.problemDuration === 'today' ? 'اليوم' :
                                    state.problemDuration === '1-3-days' ? '1-3 أيام' :
                                        state.problemDuration === '3-7-days' ? '3-7 أيام' :
                                            state.problemDuration === 'more-than-week' ? 'أكثر من أسبوع' :
                                                'مشكلة مزمنة'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* تنبيه قانوني */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 text-center"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-amber-600" />
                    <span className="font-bold text-amber-700">تنبيه مهم</span>
                </div>
                <p className="text-amber-700 text-sm">
                    هذا التقييم <strong>لا يغني عن زيارة طبيب الأسنان</strong>.
                    التشخيص النهائي يتطلب فحص سريري وأشعة.
                </p>
            </motion.div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRestart}
                    className="flex-1 py-4 rounded-2xl font-bold border-2 border-slate-200 
                             text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} />
                    <span>تشخيص جديد</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.print()}
                    className="flex-1 py-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 
                             text-white shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                    <FileText size={20} />
                    <span>حفظ التقرير</span>
                </motion.button>
            </div>
        </div>
    );
}
