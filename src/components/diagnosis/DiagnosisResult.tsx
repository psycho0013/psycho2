import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, RefreshCw, Pill, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DiagnosisState } from '../../pages/Diagnosis';
import type { Disease, Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';
import StatisticsManager from '@/services/statisticsManager';

interface Props {
    state: DiagnosisState;
}

const DiagnosisResult = ({ state }: Props) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [isEmergency, setIsEmergency] = useState(false);
    const [treatmentsList, setTreatmentsList] = useState<Treatment[]>([]);
    const hasAnalyzed = useRef(false);

    useEffect(() => {
        const analyze = async () => {
            if (hasAnalyzed.current) return;
            hasAnalyzed.current = true;

            // Fetch data
            const [diseases, treatments] = await Promise.all([
                DbManager.getDiseases(),
                DbManager.getTreatments()
            ]);
            setTreatmentsList(treatments);

            // Simulate AI analysis delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            calculateDiagnosis(diseases);
            setLoading(false);
        };
        analyze();
    }, []);

    const calculateDiagnosis = (diseases: Disease[]) => {
        // Simple matching logic for demo
        // Count matching symptoms for each disease
        const allUserSymptoms = [
            ...state.selectedSymptoms.map(s => s.id),
            ...state.relatedSymptoms
        ];

        let bestMatch = null;
        let maxMatches = 0;

        diseases.forEach(disease => {
            // disease.symptoms is now an array of IDs (strings)
            const matches = disease.symptoms.filter((sId: string) => allUserSymptoms.includes(sId)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = disease;
            }
        });

        const emergencyStatus = state.selectedSymptoms.some(s => s.severity === 'severe') ||
            state.selectedSymptoms.some(s => ['chest_pain', 'shortness_of_breath'].includes(s.id));

        setIsEmergency(emergencyStatus);

        if (bestMatch && maxMatches > 0) {
            setResult(bestMatch);
            // Save to real statistics
            StatisticsManager.saveDiagnosis(state, bestMatch, emergencyStatus);
        } else {
            setResult(null);
            // Save failed diagnosis attempt too if needed, or just successful ones. 
            // For now let's save even if null to track usage, but maybe with 'Undiagnosed' name
            StatisticsManager.saveDiagnosis(state, null, emergencyStatus);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <ActivityIcon className="absolute inset-0 m-auto text-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">جاري تحليل الأعراض...</h2>
                <p className="text-slate-500">يقوم الذكاء الاصطناعي بمقارنة بياناتك مع السجلات الطبية.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {result ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
                >
                    <div className={`${isEmergency ? 'bg-red-600' : 'bg-emerald-500'} p-8 text-white text-center transition-colors`}>
                        <div className={`w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ${isEmergency ? 'animate-pulse' : ''}`}>
                            {isEmergency ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{isEmergency ? 'تنبيه صحي عاجل' : 'اكتمل التحليل'}</h2>
                        <p className="opacity-90">
                            {isEmergency
                                ? 'بناءً على الأعراض الخطرة التي ذكرتها، نوصي باتخاذ إجراء فوري.'
                                : 'بناءً على الأعراض التي قدمتها، التشخيص المحتمل هو:'}
                        </p>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-10">
                            <h3 className="text-4xl font-bold text-slate-900 mb-4">{result.name}</h3>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                {result.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Pill className="text-primary" />
                                    العلاجات المقترحة
                                </h4>
                                <ul className="space-y-3">
                                    {result.treatments.map((tId: string) => {
                                        const treatment = treatmentsList.find(t => t.id === tId);
                                        return treatment ? (
                                            <li key={tId} className="flex items-start gap-3 text-slate-700">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                                <span>
                                                    <span className="font-medium block">{treatment.name}</span>
                                                    <span className="text-sm text-slate-500">{treatment.dosage}</span>
                                                </span>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>

                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-amber-600" />
                                    توصيات هامة
                                </h4>
                                <ul className="space-y-3 text-amber-900/80">
                                    <li className="flex gap-2">
                                        <span className="font-bold">•</span>
                                        استرح جيداً واشرب الكثير من السوائل.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">•</span>
                                        راقب درجة حرارتك بانتظام.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold">•</span>
                                        إذا ساءت الأعراض، قم بزيارة الطبيب فوراً.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {isEmergency && (
                            <div className="mb-10 bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-pulse">
                                <h3 className="text-xl font-bold text-red-700 mb-4">نوصي بالاتصال بالطوارئ فوراً</h3>
                                <a href="tel:911" className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                                    <Phone size={24} />
                                    اتصل بالطوارئ (911)
                                </a>
                                <p className="text-red-600/80 mt-4 text-sm">
                                    الأعراض التي تعاني منها قد تشير إلى حالة طبية طارئة. لا تتجاهل هذه الرسالة.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            <button onClick={() => window.location.reload()} className="px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
                                <RefreshCw size={20} />
                                تشخيص جديد
                            </button>
                            <Link to="/contact" className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                                حجز موعد مع طبيب <ArrowRight size={20} className="rotate-180" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <AlertTriangle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">لم يتم العثور على تطابق محدد</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        أعراضك لا تتطابق بوضوح مع أي من الحالات في قاعدتنا الحالية. يرجى استشارة طبيب للتقييم الدقيق.
                    </p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all">
                        حاول مرة أخرى
                    </button>
                </div>
            )}

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4 items-start">
                <AlertTriangle className="text-blue-500 shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">إخلاء مسؤولية طبي</h4>
                    <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">
                        هذا النظام يقدم اقتراحات أولية فقط ولا يعتبر بديلاً عن الاستشارة الطبية المهنية.
                        لا تعتمد على هذه النتائج في الحالات الطارئة.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default DiagnosisResult;
