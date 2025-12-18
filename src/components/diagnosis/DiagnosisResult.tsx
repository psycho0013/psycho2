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

// ═══════════════════════════════════════════════════════════════════════════
// ⏱️ إعدادات وقت التحميل - يمكنك تعديل هذه القيمة لاحقاً
// ═══════════════════════════════════════════════════════════════════════════
const MINIMUM_LOADING_TIME_MS = 5000; // 5 ثوانٍ كحد أدنى للتحميل
// ═══════════════════════════════════════════════════════════════════════════

const DiagnosisResult = ({ state }: Props) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [isEmergency, setIsEmergency] = useState(false);
    const [confidenceScore, setConfidenceScore] = useState<number>(0);
    const [treatmentsList, setTreatmentsList] = useState<Treatment[]>([]);
    const hasAnalyzed = useRef(false);

    useEffect(() => {
        const analyze = async () => {
            if (hasAnalyzed.current) return;
            hasAnalyzed.current = true;

            const startTime = Date.now();

            // Fetch data
            const [diseases, treatments] = await Promise.all([
                DbManager.getDiseases(),
                DbManager.getTreatments()
            ]);
            setTreatmentsList(treatments);

            // Run diagnosis and wait for it to complete
            await calculateDiagnosis(diseases);

            // Ensure minimum loading time for UX
            const elapsed = Date.now() - startTime;
            if (elapsed < MINIMUM_LOADING_TIME_MS) {
                await new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME_MS - elapsed));
            }

            setLoading(false);
        };
        analyze();
    }, []);

    const calculateDiagnosis = async (diseases: Disease[]) => {
        try {
            // Fetch all symptoms to resolve names
            const allSymptoms = await DbManager.getSymptoms();

            // Map selected symptom IDs to names
            const symptomNames = state.selectedSymptoms.map(s => {
                const symptom = allSymptoms.find(sym => sym.id === s.id);
                return symptom ? (symptom.name_ar || symptom.name) : s.id;
            });

            // Also include related symptoms (which are just IDs in state.relatedSymptoms)
            const relatedSymptomNames = state.relatedSymptoms.map(id => {
                const symptom = allSymptoms.find(sym => sym.id === id);
                return symptom ? (symptom.name_ar || symptom.name) : id;
            });

            const allSymptomNames = [...symptomNames, ...relatedSymptomNames];

            console.log('🤖 HYBRID Diagnosis: Sending request...', {
                symptoms: allSymptomNames,
                symptomDetails: state.selectedSymptoms,
                relatedSymptoms: state.relatedSymptoms,
                age: state.personalInfo.age,
                gender: state.personalInfo.gender
            });

            const response = await fetch('/api/diagnose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: allSymptomNames,
                    symptomDetails: state.selectedSymptoms, // { id, severity }[]
                    relatedSymptoms: state.relatedSymptoms, // string[] of IDs
                    age: state.personalInfo.age,
                    gender: state.personalInfo.gender === 'male' ? 'Male' : 'Female',
                    // إرسال البيانات المنظمة بدلاً من notes string
                    weight: state.personalInfo.weight,
                    height: state.personalInfo.height,
                    chronicDiseases: state.vitals.chronicDiseases,
                    isPregnant: state.personalInfo.isPregnant,
                    isBreastfeeding: state.personalInfo.isBreastfeeding,
                    governorate: state.personalInfo.governorate
                }),
            });

            if (!response.ok) {
                throw new Error(`Diagnosis failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ AI Connection: Received response!', data);

            // The API returns { diagnosis: [...], disclaimer: ... }
            // We need to map the first diagnosis to our result format
            // Ideally, we should match the disease name back to our database ID if we want to link treatments correctly.
            // For now, let's try to find the disease in our local list by name.

            if (data.diagnosis && data.diagnosis.length > 0) {
                const topDiagnosis = data.diagnosis[0];
                console.log('🔍 AI Top Diagnosis:', topDiagnosis.disease_name);

                // Normalizing names for better matching (trim and lowercase)
                const matchedDisease = diseases.find(d =>
                    d.name.toLowerCase().trim() === topDiagnosis.disease_name.toLowerCase().trim()
                );

                if (matchedDisease) {
                    console.log('🎯 Database Match Found:', matchedDisease.name);
                    setResult(matchedDisease);

                    // حفظ نسبة الثقة من الذكاء الاصطناعي
                    const aiConfidence = topDiagnosis.confidence || 0;
                    setConfidenceScore(aiConfidence);

                    // Emergency detection: استخدام نتيجة الذكاء الاصطناعي المحسّن
                    // الـ API الجديد يُرجع emergency_alert بناءً على تحليل شامل
                    let emergencyStatus = data.emergency_alert || false;

                    // إضافة فحص محلي كـ fallback
                    if (!emergencyStatus) {
                        const hasCriticalSymptom = state.selectedSymptoms.some(s => {
                            const symptom = allSymptoms.find(sym => sym.id === s.id);
                            return symptom?.is_critical === true;
                        });
                        const hasSevereSeverity = state.selectedSymptoms.some(s => s.severity === 'severe');
                        emergencyStatus = hasCriticalSymptom && hasSevereSeverity;
                    }

                    console.log('🚨 Emergency Check:', {
                        aiEmergencyAlert: data.emergency_alert,
                        aiEmergencyReason: data.emergency_reason,
                        finalStatus: emergencyStatus,
                        topDiagnosisSeverity: topDiagnosis.severity_assessment
                    });

                    setIsEmergency(emergencyStatus);
                    StatisticsManager.saveDiagnosis(state, matchedDisease, emergencyStatus);
                } else {
                    console.warn('⚠️ AI found a disease but it is NOT in the local database:', topDiagnosis.disease_name);
                    console.log('Available Diseases in DB:', diseases.map(d => d.name));
                    // AI found a disease but we don't have it in our DB exactly? 
                    // Or maybe the name is slightly different.
                    // For this MVP, let's fallback to "No match" if we can't link it to our DB, 
                    // OR we could display the AI result directly even if not in DB (but then no treatments links).
                    // Let's stick to DB matching for safety as requested "based ONLY on provided database".
                    setResult(null);
                    StatisticsManager.saveDiagnosis(state, null, false);
                }
            } else {
                console.log('ℹ️ AI returned no diagnosis.');
                setResult(null);
                StatisticsManager.saveDiagnosis(state, null, false);
            }

        } catch (error) {
            console.error('Error calling diagnosis API:', error);
            setResult(null);
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

                            {/* ═══════════ نسبة الدقة مع انميشن ═══════════ */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="inline-flex flex-col items-center my-6"
                            >
                                <div className="relative w-32 h-32">
                                    {/* Background circle */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke="#e2e8f0"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        {/* Progress circle */}
                                        <motion.circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke={confidenceScore >= 80 ? '#10b981' : confidenceScore >= 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 56}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - confidenceScore / 100) }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                        />
                                    </svg>
                                    {/* Percentage text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            className="text-3xl font-bold"
                                            style={{ color: confidenceScore >= 80 ? '#10b981' : confidenceScore >= 60 ? '#f59e0b' : '#ef4444' }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                        >
                                            {confidenceScore}%
                                        </motion.span>
                                        <span className="text-xs text-slate-500">نسبة الدقة</span>
                                    </div>
                                </div>
                                <motion.p
                                    className="mt-3 text-sm font-medium px-4 py-1 rounded-full"
                                    style={{
                                        backgroundColor: confidenceScore >= 80 ? '#d1fae5' : confidenceScore >= 60 ? '#fef3c7' : '#fee2e2',
                                        color: confidenceScore >= 80 ? '#065f46' : confidenceScore >= 60 ? '#92400e' : '#991b1b'
                                    }}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    {confidenceScore >= 80 ? 'دقة عالية ✓' : confidenceScore >= 60 ? 'دقة متوسطة' : 'دقة منخفضة - راجع طبيب'}
                                </motion.p>
                            </motion.div>
                            {/* ═══════════════════════════════════════════ */}

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
                                        if (!treatment) return null;

                                        // ═══════════════════════════════════════════════════════════
                                        // فلترة العلاجات الخطرة
                                        // ═══════════════════════════════════════════════════════════
                                        const contraindications: string[] = [];

                                        // فحص الحمل
                                        if (treatment.contraindicated_pregnancy && state.personalInfo.isPregnant) {
                                            contraindications.push('🤰 ممنوع للحوامل');
                                        }

                                        // فحص الرضاعة
                                        if (treatment.contraindicated_breastfeeding && state.personalInfo.isBreastfeeding) {
                                            contraindications.push('🤱 ممنوع للمرضعات');
                                        }

                                        // فحص العمر
                                        const patientAge = parseInt(state.personalInfo.age);
                                        if (treatment.age_restriction_min && patientAge < treatment.age_restriction_min) {
                                            contraindications.push(`👶 الحد الأدنى للعمر: ${treatment.age_restriction_min} سنة`);
                                        }
                                        if (treatment.age_restriction_max && patientAge > treatment.age_restriction_max) {
                                            contraindications.push(`👴 الحد الأقصى للعمر: ${treatment.age_restriction_max} سنة`);
                                        }

                                        // فحص الأمراض المزمنة
                                        if (treatment.contraindicated_chronic_diseases && state.vitals?.chronicDiseases) {
                                            const patientChronic = state.vitals.chronicDiseases;
                                            const conflicts = treatment.contraindicated_chronic_diseases.filter(
                                                (d: string) => patientChronic.some((pc: string) =>
                                                    pc.includes(d) || d.includes(pc)
                                                )
                                            );
                                            if (conflicts.length > 0) {
                                                contraindications.push(`⚠️ يتعارض مع: ${conflicts.join('، ')}`);
                                            }
                                        }

                                        const isContraindicated = contraindications.length > 0;
                                        // ═══════════════════════════════════════════════════════════

                                        return (
                                            <li
                                                key={tId}
                                                className={`flex items-start gap-3 p-3 rounded-lg ${isContraindicated
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'text-slate-700'
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${isContraindicated ? 'bg-red-500' : 'bg-primary'
                                                    }`} />
                                                <div className="flex-1">
                                                    <span className={`font-medium block ${isContraindicated ? 'text-red-700 line-through' : ''}`}>
                                                        {treatment.name}
                                                        {isContraindicated && ' ❌'}
                                                    </span>
                                                    {!isContraindicated && (
                                                        <span className="text-sm text-slate-500">{treatment.dosage}</span>
                                                    )}
                                                    {isContraindicated && (
                                                        <div className="mt-1 text-xs text-red-600 space-y-0.5">
                                                            {contraindications.map((c, i) => (
                                                                <div key={i}>{c}</div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        );
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
