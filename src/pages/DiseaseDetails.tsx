import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, AlertTriangle, Stethoscope, BookOpen, ChevronLeft } from 'lucide-react';
import type { Disease, Treatment, Symptom } from '@/types/medical';
import DbManager from '@/services/dbManager';


const DiseaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disease, setDisease] = useState<Disease | null>(null);
    const [diseasesTreatments, setDiseasesTreatments] = useState<Treatment[]>([]);
    const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            const [fetchedDisease, allTreatments, symptoms] = await Promise.all([
                DbManager.getDisease(id),
                DbManager.getTreatments(),
                DbManager.getSymptoms()
            ]);
            setDisease(fetchedDisease);
            setDiseasesTreatments(allTreatments);
            setAllSymptoms(symptoms);
        };
        loadData();
    }, [id]);

    // Helper function to get symptom name in Arabic
    const getSymptomName = (symptomId: string): string => {
        const symptom = allSymptoms.find(s => s.id === symptomId);
        if (symptom) {
            // Prefer Arabic name, fallback to general name
            return symptom.name_ar || symptom.name || symptomId;
        }
        return symptomId;
    };

    if (!disease) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
                <div className="liquid-bg"></div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 z-10">المرض غير موجود</h2>
                <button onClick={() => navigate('/awareness')} className="glass-button z-10 px-6 py-2">
                    العودة إلى التوعية الطبية
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 relative">
            <div className="fixed inset-0 -z-20 bg-slate-50"></div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white pt-32 pb-24 px-6 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <Link
                        to="/awareness"
                        state={{ activeTab: 'diseases' }}
                        className="inline-flex items-center text-rose-100 hover:text-white mb-8 transition-colors bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10"
                    >
                        <ArrowRight size={20} className="ml-2" />
                        العودة للقائمة
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/20">
                                <Activity size={32} className="text-white" />
                            </div>
                            <span className="text-rose-100 font-bold tracking-wider uppercase text-sm border border-rose-100/30 px-3 py-1 rounded-lg">ملف مرضي شامل</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{disease.name}</h1>
                        <p className="text-xl text-rose-50 max-w-3xl leading-relaxed font-medium">
                            {disease.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-8">
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Symptoms */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-panel p-8 bg-white/80"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            الأعراض الشائعة
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {disease.symptoms.map((symptomId) => (
                                <span key={symptomId} className="px-4 py-2 bg-rose-50/80 hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-100 transition-colors cursor-default">
                                    {getSymptomName(symptomId)}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Diagnosis */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 bg-white/80"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <Stethoscope size={20} />
                            </div>
                            طريقة التشخيص
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg font-medium">
                            {disease.diagnosis_method}
                        </p>
                    </motion.div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Causes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                الأسباب وعوامل الخطر
                            </h3>
                            <ul className="space-y-4">
                                {disease.causes.map((cause, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-slate-600">
                                        <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-md shadow-rose-200">
                                            {idx + 1}
                                        </span>
                                        <span className="leading-relaxed font-medium">{cause}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Complications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 border-amber-100/50"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <AlertTriangle size={18} />
                                </div>
                                المضاعفات المحتملة
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {disease.complications.map((comp, idx) => (
                                    <li key={idx} className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-2xl text-slate-700 border border-amber-100/50 hover:bg-amber-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full shadow-sm shadow-amber-400/50"></div>
                                        <span className="font-medium">{comp}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="space-y-6">
                        {/* Prevention */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-6 bg-emerald-50/30 border-emerald-100/50"
                        >
                            <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Shield size={18} />
                                </div>
                                الوقاية
                            </h3>
                            <ul className="space-y-4">
                                {disease.prevention.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-emerald-800 text-sm font-medium">
                                        <span className="text-emerald-500 mt-1">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Treatments Links */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6">العلاجات المقترحة</h3>
                            <div className="space-y-3">
                                {disease.treatments.map((tId) => {
                                    const treatment = diseasesTreatments.find(t => t.id === tId);
                                    if (!treatment) return null;
                                    return (
                                        <Link
                                            key={tId}
                                            to={`/awareness/treatment/${tId}`}
                                            state={{ fromDisease: { id: disease.id, name: disease.name } }}
                                            className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-rose-50/50 rounded-2xl group transition-all duration-300 border border-slate-100 hover:border-rose-200"
                                        >
                                            <span className="font-bold text-slate-700 group-hover:text-rose-700 transition-colors">
                                                {treatment.name}
                                            </span>
                                            <ChevronLeft size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors group-hover:-translate-x-1" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetails;
