import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, RefreshCw, Pill, ArrowRight, Phone, Clock, FileText, AlertCircle, X, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DiagnosisState } from '../../pages/Diagnosis';
import type { Disease, Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';
import StatisticsManager from '@/services/statisticsManager';
import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import FeedbackWidget from './FeedbackWidget';

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
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null); // For Modal
    const hasAnalyzed = useRef(false);
    const hasSaved = useRef(false); // Prevent duplicate saves

    useEffect(() => {
        const analyze = async () => {
            if (hasAnalyzed.current) return;
            hasAnalyzed.current = true;

            const startTime = Date.now();

            try {
                // Fetch data
                const [diseases, treatments] = await Promise.all([
                    DbManager.getDiseases(),
                    DbManager.getTreatments()
                ]);
                setTreatmentsList(treatments);

                // Run diagnosis and wait for it to complete
                await calculateDiagnosis(diseases);
            } catch (error) {
                console.error("Initialization error:", error);
            }

            // Ensure minimum loading time for UX
            const elapsed = Date.now() - startTime;
            if (elapsed < MINIMUM_LOADING_TIME_MS) {
                await new Promise(resolve => setTimeout(resolve, MINIMUM_LOADING_TIME_MS - elapsed));
            }

            setLoading(false);
        };
        analyze();
    }, []);

    const saveDiagnosisToHistory = async (disease: Disease, confidence: number, isEmergency: boolean, allSymptoms: any[]) => {
        if (hasSaved.current) return;
        try {
            const user = await authService.getCurrentUser();
            if (!user) return; // User not logged in, can't save

            hasSaved.current = true;
            console.log('💾 Saving diagnosis to history...');

            // Map symptoms to Arabic names with severity
            const symptomsWithArabicNames = state.selectedSymptoms.map(s => {
                const symptom = allSymptoms.find(sym => sym.id === s.id);
                const severityArabic = s.severity === 'mild' ? 'خفيف' : s.severity === 'moderate' ? 'متوسط' : 'شديد';
                return {
                    name: symptom?.name_ar || symptom?.name || s.id,
                    severity: severityArabic
                };
            });

            // Create Arabic notes
            const confidenceText = confidence >= 80 ? 'عالية' : confidence >= 60 ? 'متوسطة' : 'منخفضة';
            const emergencyText = isEmergency ? 'نعم ⚠️' : 'لا';
            const arabicNotes = `نسبة الدقة: ${confidence}% (${confidenceText}). حالة طوارئ: ${emergencyText}.`;

            await profileService.addMedicalHistory(user.id, {
                symptoms: symptomsWithArabicNames,
                diagnosis_result: {
                    diseaseId: disease.id,
                    diseaseName: disease.name,
                    confidence: confidence,
                    isEmergency: isEmergency
                },
                notes: arabicNotes
            });
            console.log('✅ Diagnosis saved successfully');
        } catch (error) {
            console.error('❌ Failed to save diagnosis:', error);
            hasSaved.current = false;
        }
    };

    const calculateDiagnosis = async (diseases: Disease[]) => {
        try {
            // ... (existing symptom mapping code)
            const allSymptoms = await DbManager.getSymptoms();
            const symptomNames = state.selectedSymptoms.map(s => {
                const symptom = allSymptoms.find(sym => sym.id === s.id);
                return symptom ? (symptom.name_ar || symptom.name) : s.id;
            });
            const relatedSymptomNames = state.relatedSymptoms.map(id => {
                const symptom = allSymptoms.find(sym => sym.id === id);
                return symptom ? (symptom.name_ar || symptom.name) : id;
            });
            const allSymptomNames = [...symptomNames, ...relatedSymptomNames];


            console.log('🤖 HYBRID Diagnosis: Sending request...', { /* ... */ });

            const response = await fetch('/api/diagnose', {
                // ... (existing fetch options)
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms: allSymptomNames,
                    symptomDetails: state.selectedSymptoms,
                    relatedSymptoms: state.relatedSymptoms,
                    age: state.personalInfo.age,
                    gender: state.personalInfo.gender === 'male' ? 'Male' : 'Female',
                    weight: state.personalInfo.weight,
                    height: state.personalInfo.height,
                    chronicDiseases: state.vitals.chronicDiseases,
                    isPregnant: state.personalInfo.isPregnant,
                    isBreastfeeding: state.personalInfo.isBreastfeeding,
                    governorate: state.personalInfo.governorate
                }),
            });

            if (!response.ok) throw new Error(`Diagnosis failed with status: ${response.status}`);
            const data = await response.json();

            if (data.diagnosis && data.diagnosis.length > 0) {
                const topDiagnosis = data.diagnosis[0];
                const matchedDisease = diseases.find(d =>
                    d.name.toLowerCase().trim() === topDiagnosis.disease_name.toLowerCase().trim()
                );

                if (matchedDisease) {
                    setResult(matchedDisease);
                    const aiConfidence = topDiagnosis.confidence || 0;
                    setConfidenceScore(aiConfidence);

                    let emergencyStatus = data.emergency_alert || false;
                    if (!emergencyStatus) {
                        // Fallback emergency check
                        const hasCriticalSymptom = state.selectedSymptoms.some(s => {
                            const symptom = allSymptoms.find(sym => sym.id === s.id);
                            return symptom?.is_critical === true;
                        });
                        const hasSevereSeverity = state.selectedSymptoms.some(s => s.severity === 'severe');
                        emergencyStatus = hasCriticalSymptom && hasSevereSeverity;
                    }
                    setIsEmergency(emergencyStatus);
                    StatisticsManager.saveDiagnosis(state, matchedDisease, emergencyStatus);

                    // SAVE TO HISTORY
                    saveDiagnosisToHistory(matchedDisease, aiConfidence, emergencyStatus, allSymptoms);

                } else {
                    setResult(null);
                    StatisticsManager.saveDiagnosis(state, null, false);
                }
            } else {
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
                                                onClick={() => !isContraindicated && setSelectedTreatment(treatment)}
                                                className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                                                    isContraindicated
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'text-slate-700 bg-white border border-slate-100 hover:border-primary/30 hover:shadow-md hover:bg-slate-50 cursor-pointer'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 transition-transform ${isContraindicated ? 'bg-red-500' : 'bg-primary group-hover:scale-150'}`} />
                                                <div className="flex-1">
                                                    <span className={`font-bold block flex justify-between items-center ${isContraindicated ? 'text-red-700 line-through' : 'text-slate-800'}`}>
                                                        <span>{treatment.name} {isContraindicated && ' ❌'}</span>
                                                        {!isContraindicated && <ChevronLeft size={16} className="text-slate-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />}
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

            {/* نظام التقييم 🌟 */}
            {result && (
                <FeedbackWidget 
                    diseaseName={result.name}
                    confidenceScore={confidenceScore}
                />
            )}

            {/* إخلاء مسؤولية طبي */}
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

            {/* ════════════ نافذة تفاصيل العلاج (Modal) ════════════ */}
            <AnimatePresence>
                {selectedTreatment && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedTreatment(null)}
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-l from-teal-500 to-cyan-600 p-6 sm:p-8 text-white relative shrink-0">
                                <button 
                                    onClick={() => setSelectedTreatment(null)}
                                    className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <Pill className="text-cyan-100" />
                                    <span className="text-cyan-100 text-sm font-bold uppercase">{selectedTreatment.type}</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold">{selectedTreatment.name}</h2>
                                {selectedTreatment.dosage && (
                                    <div className="mt-4 inline-block px-4 py-1.5 bg-white/20 rounded-lg text-sm font-bold backdrop-blur-md">
                                        الجرعة: {selectedTreatment.dosage}
                                    </div>
                                )}
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                    {selectedTreatment.description}
                                </p>

                                {selectedTreatment.instructions && (
                                    <div className="bg-cyan-50/50 p-5 rounded-2xl border border-cyan-100">
                                        <h4 className="flex items-center gap-2 font-bold text-cyan-800 mb-2">
                                            <FileText size={18} /> تعليمات الاستخدام
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {selectedTreatment.instructions}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedTreatment.side_effects && selectedTreatment.side_effects.length > 0 && (
                                        <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                                            <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-3">
                                                <AlertCircle size={18} /> آثار جانبية
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedTreatment.side_effects.map((effect, idx) => (
                                                    <li key={idx} className="flex gap-2 text-sm text-rose-700/80">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                                                        {effect}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {selectedTreatment.precautions && selectedTreatment.precautions.length > 0 && (
                                        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                                            <h4 className="flex items-center gap-2 font-bold text-amber-800 mb-3">
                                                <AlertTriangle size={18} /> احتياطات
                                            </h4>
                                            <ul className="space-y-2">
                                                {selectedTreatment.precautions.map((prec, idx) => (
                                                    <li key={idx} className="flex gap-2 text-sm text-amber-700/80">
                                                        <span className="text-amber-500 mt-0.5">•</span>
                                                        {prec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                {selectedTreatment.duration && (
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <Clock className="text-slate-400" />
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold">مدة العلاج الموصى بها</div>
                                            <div className="text-slate-800 font-medium">{selectedTreatment.duration}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                                <button 
                                    onClick={() => setSelectedTreatment(null)}
                                    className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    رجوع للتشخيص
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export default DiagnosisResult;
