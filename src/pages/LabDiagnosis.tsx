import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { analyzeLabResults, type TestType, type AnalysisResult } from '@/services/labAnalysisService';
import LabSelection from '@/components/lab/LabSelection';
import LabTestForm from '@/components/lab/LabTestForm';
import LabPatientInfo from '@/components/lab/LabPatientInfo';
import LabResult from '@/components/lab/LabResult';

const LabDiagnosis = () => {
    const [step, setStep] = useState(1);
    const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
    const [testData, setTestData] = useState<Record<string, any>>({});
    const [patientData, setPatientData] = useState({
        age: '',
        gender: 'male' as 'male' | 'female',
        weight: '',
        height: '',
        chronicDiseases: [] as string[],
        medications: '',
        reason: '',
        isFasting: false,
        fastingHours: '',
        testDate: new Date().toISOString().slice(0, 16),
    });
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const handleTestSelect = (testId: TestType) => {
        setSelectedTest(testId);
        setTestData({}); // Reset test data on new selection
        setStep(2);
    };

    const handleTestUpdate = (fieldId: string, value: any) => {
        setTestData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handlePatientUpdate = (data: Partial<typeof patientData>) => {
        setPatientData(prev => ({ ...prev, ...data }));
    };

    const handleAnalyze = () => {
        if (selectedTest) {
            const analysis = analyzeLabResults(selectedTest, testData, patientData);
            setResults(analysis);
            setStep(4);
        }
    };

    const handleReset = () => {
        setStep(1);
        setSelectedTest(null);
        setTestData({});
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12" ref={containerRef}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center lg:text-right">
                    <h1 className="text-3xl font-bold text-slate-900">المختبر الذكي</h1>
                    <p className="text-slate-500 mt-2">تحليل وتفسير نتائج التحاليل الطبية بدقة عالية</p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-slate-100"
                    >
                        {step === 1 && (
                            <LabSelection onSelect={handleTestSelect} />
                        )}

                        {step === 2 && selectedTest && (
                            <LabTestForm
                                testType={selectedTest}
                                data={testData}
                                update={handleTestUpdate}
                                onNext={() => setStep(3)}
                                onBack={() => setStep(1)}
                            />
                        )}

                        {step === 3 && (
                            <LabPatientInfo
                                data={patientData}
                                update={handlePatientUpdate}
                                onNext={handleAnalyze}
                                onBack={() => setStep(2)}
                            />
                        )}

                        {step === 4 && (
                            <LabResult
                                results={results}
                                onReset={handleReset}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LabDiagnosis;
