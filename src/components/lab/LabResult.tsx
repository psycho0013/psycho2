import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { AnalysisResult } from '@/services/labAnalysisService';

interface Props {
    results: AnalysisResult[];
    onReset: () => void;
}

const LabResult = ({ results, onReset }: Props) => {
    const abnormalCount = results.filter(r => r.status !== 'normal').length;

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${abnormalCount === 0 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                        }`}
                >
                    {abnormalCount === 0 ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-900">
                    {abnormalCount === 0 ? 'جميع النتائج طبيعية' : `تم العثور على ${abnormalCount} ملاحظات`}
                </h2>
                <p className="text-slate-500 mt-2">
                    {abnormalCount === 0
                        ? 'نتائج التحليل تقع ضمن المعدلات الطبيعية.'
                        : 'يرجى مراجعة التفاصيل أدناه واستشارة الطبيب المختص.'}
                </p>
            </div>

            <div className="space-y-4">
                {results.map((result, index) => (
                    <motion.div
                        key={result.fieldId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border flex items-center justify-between ${result.status === 'normal'
                            ? 'bg-white border-slate-100'
                            : result.status === 'low' || result.status === 'high'
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                    >
                        <div>
                            <h3 className="font-semibold text-slate-900">{result.fieldLabel}</h3>
                            <p className="text-sm text-slate-500">القيمة: <span className="font-medium text-slate-900">{result.value}</span></p>
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-medium ${result.status === 'normal' ? 'text-green-600' :
                            result.status === 'abnormal' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                            {result.status === 'normal' && <CheckCircle size={16} />}
                            {(result.status === 'low' || result.status === 'high') && <Info size={16} />}
                            {result.status === 'abnormal' && <XCircle size={16} />}
                            <span>{result.message}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
                <div className="flex gap-3">
                    <Info className="text-blue-600 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-1">تنويه هام</h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            هذا التحليل هو أداة مساعدة ولا يغني عن استشارة الطبيب المختص. النتائج قد تختلف بناءً على المعايير الخاصة بالمختبر والعوامل الصحية الأخرى.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-6">
                <button
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all"
                >
                    إجراء تحليل جديد
                </button>
            </div>
        </div>
    );
};

export default LabResult;
