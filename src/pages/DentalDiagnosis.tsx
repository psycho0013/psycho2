/**
 * Dental Diagnosis Page
 * صفحة تشخيص الأسنان الرئيسية
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
    User,
    Activity,
    MapPin,
    FileText,
    Check
} from 'lucide-react';
import type { DentalDiagnosisState } from '@/types/dental';
import DentalStepInfo from '@/components/dental/DentalStepInfo';
import DentalStepSymptoms from '@/components/dental/DentalStepSymptoms';
import DentalFollowUp from '@/components/dental/DentalFollowUp';
import DentalResult from '@/components/dental/DentalResult';

// الحالة الابتدائية
const initialState: DentalDiagnosisState = {
    step: 1,
    patientInfo: {
        age: '',
        gender: 'male',
        lastDentalVisit: '6-12-months',
        isPregnant: false,
        isBreastfeeding: false,
        chronicDiseases: [],
        currentMedications: [],
    },
    problemArea: 'unknown',
    selectedTooth: undefined,
    selectedSymptoms: [],
    followUpAnswers: {},
    problemDuration: '1-3-days'
};

// خطوات التشخيص
const steps = [
    { id: 1, title: 'معلوماتك', icon: <User size={20} /> },
    { id: 2, title: 'الأعراض', icon: <Activity size={20} /> },
    { id: 3, title: 'تفاصيل', icon: <MapPin size={20} /> },
    { id: 4, title: 'النتيجة', icon: <FileText size={20} /> },
];

export default function DentalDiagnosis() {
    const [state, setState] = useState<DentalDiagnosisState>(initialState);
    const containerRef = useRef<HTMLDivElement>(null);

    // تأثير الدخول
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    // التمرير للأعلى عند تغيير الخطوة
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [state.step]);

    // التنقل بين الخطوات
    const nextStep = () => setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
    const prevStep = () => setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

    // تحديث معلومات المريض
    const updatePatientInfo = (data: Partial<DentalDiagnosisState['patientInfo']>) => {
        setState(prev => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, ...data }
        }));
    };

    // إعادة بدء التشخيص
    const handleRestart = () => {
        setState(initialState);
    };

    // عرض الخطوة الحالية
    const renderStep = () => {
        switch (state.step) {
            case 1:
                return (
                    <DentalStepInfo
                        data={state.patientInfo}
                        onUpdate={updatePatientInfo}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <DentalStepSymptoms
                        state={state}
                        setState={setState}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 3:
                return (
                    <DentalFollowUp
                        state={state}
                        setState={setState}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 4:
                return (
                    <DentalResult
                        state={state}
                        onRestart={handleRestart}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-slate-50 p-6 lg:p-12"
        >
            {/* Background Decor - Optional, keeping it subtle or removing if "like medical" implies simplicity */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">تشخيص الأسنان</h1>
                    <p className="text-slate-500 mb-6">الخطوة {state.step} من 4</p>

                    {/* Simple Progress Bar matching Medical Diagnosis Style */}
                    {state.step < 4 && (
                        <div className="w-full h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(state.step / 4) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                    )}

                    {/* Stepper Icons - Optional: Display horizontally below if desired, but User asked to "fix icons above". 
                        I will keep a sleek horizontal stepper below the progress bar to satisfy both "fix icons" and "margin like medical". 
                    */}
                    {state.step < 4 && (
                        <div className="flex justify-between mt-6 px-2">
                            {steps.map((step) => {
                                const isCompleted = state.step > step.id;
                                const isCurrent = state.step === step.id;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                            ${isCurrent
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                                : isCompleted
                                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                                    : 'border-slate-200 bg-white text-slate-300'
                                            }
                                        `}>
                                            {isCompleted ? <Check size={18} /> : step.icon}
                                        </div>
                                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {step.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
