import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import StepPersonalInfo from '@/components/diagnosis/StepPersonalInfo';
import StepSymptoms from '@/components/diagnosis/StepSymptoms';
import StepRelatedSymptoms from '@/components/diagnosis/StepRelatedSymptoms';
import StepVitals from '@/components/diagnosis/StepVitals';
import StepReview from '@/components/diagnosis/StepReview';
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult';

export type Gender = 'male' | 'female';

export interface DiagnosisState {
    step: number;
    personalInfo: {
        name: string;
        age: string;
        gender: Gender;
        weight: string;
        height: string;
        governorate: string;
        isPregnant: boolean;
        isBreastfeeding: boolean;
    };
    selectedSymptoms: Array<{ id: string; severity: string }>;
    relatedSymptoms: string[];
    vitals: {
        temperature: string;
        chronicDiseases: string[];
    };
}

const initialState: DiagnosisState = {
    step: 1,
    personalInfo: {
        name: '',
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        governorate: '',
        isPregnant: false,
        isBreastfeeding: false,
    },
    selectedSymptoms: [],
    relatedSymptoms: [],
    vitals: {
        temperature: '',
        chronicDiseases: [],
    },
};

const Diagnosis = () => {
    const [state, setState] = useState<DiagnosisState>(initialState);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [state.step]);

    const nextStep = () => setState((prev) => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState((prev) => ({ ...prev, step: prev.step - 1 }));

    const updatePersonalInfo = (data: Partial<DiagnosisState['personalInfo']>) => {
        setState((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
    };

    const renderStep = () => {
        switch (state.step) {
            case 1:
                return <StepPersonalInfo data={state.personalInfo} update={updatePersonalInfo} onNext={nextStep} />;
            case 2:
                return <StepSymptoms state={state} setState={setState} onNext={nextStep} onPrev={prevStep} />;
            case 3:
                return <StepRelatedSymptoms state={state} setState={setState} onNext={nextStep} onPrev={prevStep} />;
            case 4:
                return <StepVitals state={state} setState={setState} onNext={nextStep} onPrev={prevStep} />;
            case 5:
                return <StepReview state={state} onNext={nextStep} onPrev={prevStep} />;
            case 6:
                return <DiagnosisResult state={state} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12" ref={containerRef}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">مساعد التشخيص</h1>
                    <p className="text-slate-500">الخطوة {state.step} من 6</p>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(state.step / 6) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Diagnosis;
