import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, Activity } from 'lucide-react';
import type { AnalysisResult } from '@/services/labAnalysisService';
import { cn } from '@/lib/utils';

interface Props {
    results: AnalysisResult[];
    onReset: () => void;
}

const LabResult = ({ results, onReset }: Props) => {
    const abnormalCount = results.filter(r => r.status !== 'normal').length;

    return (
        <div className="space-y-8">
            <div className="text-center mb-8 relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={cn(
                        "w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-md border border-white/50",
                        abnormalCount === 0
                            ? "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 shadow-amber-500/20"
                    )}
                >
                    {abnormalCount === 0 ? <CheckCircle size={48} strokeWidth={1.5} /> : <AlertTriangle size={48} strokeWidth={1.5} />}
                </motion.div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                    {abnormalCount === 0 ? 'جميع النتائج طبيعية' : `تم العثور على ${abnormalCount} ملاحظات`}
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                    {abnormalCount === 0
                        ? 'نتائج التحليل تقع ضمن المعدلات الطبيعية. صحتك في حالة ممتازة!'
                        : 'يرجى مراجعة التفاصيل أدناه واستشارة الطبيب المختص.'}
                </p>
            </div>

            <div className="space-y-4">
                {results.map((result, index) => (
                    <motion.div
                        key={result.fieldId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        className={cn(
                            "glass-panel p-5 flex items-center justify-between transition-all duration-300",
                            result.status === 'normal'
                                ? "border-emerald-100/30 bg-white/40"
                                : result.status === 'low' || result.status === 'high'
                                    ? "border-amber-200/50 bg-amber-50/40 shadow-lg shadow-amber-500/5"
                                    : "border-red-200/50 bg-red-50/40 shadow-lg shadow-red-500/5"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border border-white/50 shadow-sm",
                                result.status === 'normal' ? "bg-emerald-100/50 text-emerald-600" :
                                    result.status === 'abnormal' ? "bg-red-100/50 text-red-600" :
                                        "bg-amber-100/50 text-amber-600"
                            )}>
                                <Activity size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{result.fieldLabel}</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    القيمة المسجلة: <span className="text-slate-900 font-bold">{result.value}</span>
                                </p>
                            </div>
                        </div>

                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold backdrop-blur-sm",
                            result.status === 'normal'
                                ? "bg-emerald-100/40 border-emerald-200/50 text-emerald-700"
                                : result.status === 'abnormal'
                                    ? "bg-red-100/40 border-red-200/50 text-red-700"
                                    : "bg-amber-100/40 border-amber-200/50 text-amber-700"
                        )}>
                            {result.status === 'normal' && <CheckCircle size={16} />}
                            {(result.status === 'low' || result.status === 'high') && <Info size={16} />}
                            {result.status === 'abnormal' && <XCircle size={16} />}
                            <span>{result.message}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-panel bg-blue-50/30 border-blue-100/50 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/50 shadow-sm">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1 text-lg">تنويه طبي هام</h4>
                        <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                            هذا التحليل هو أداة مساعدة مدعومة بالذكاء الاصطناعي ولا يغني عن استشارة الطبيب المختص. النتائج قد تختلف بناءً على المعايير الخاصة بالمختبر.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-6 border-t border-slate-200/50">
                <button
                    onClick={onReset}
                    className="glass-button glass-button-primary px-8 py-3 shadow-xl shadow-slate-900/20 bg-slate-900 hover:bg-slate-800 text-white"
                >
                    إجراء تحليل جديد
                </button>
            </div>
        </div>
    );
};

export default LabResult;
