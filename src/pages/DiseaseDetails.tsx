import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, AlertTriangle, Stethoscope, BookOpen, ChevronLeft } from 'lucide-react';
import type { Disease, Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';

const DiseaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disease, setDisease] = useState<Disease | null>(null);
    const [diseasesTreatments, setDiseasesTreatments] = useState<Treatment[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            const [fetchedDisease, allTreatments] = await Promise.all([
                DbManager.getDisease(id),
                DbManager.getTreatments()
            ]);
            setDisease(fetchedDisease);
            setDiseasesTreatments(allTreatments);
        };
        loadData();
    }, [id]);

    if (!disease) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">المرض غير موجود</h2>
                <button onClick={() => navigate('/awareness')} className="text-primary hover:underline">
                    العودة إلى التوعية الطبية
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white pt-32 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <Link to="/awareness" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                        <ArrowRight size={20} className="ml-2" />
                        العودة للقائمة
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Activity size={32} />
                            </div>
                            <span className="text-rose-100 font-medium tracking-wide uppercase">ملف مرضي شامل</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{disease.name}</h1>
                        <p className="text-xl text-rose-100 max-w-3xl leading-relaxed">
                            {disease.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Symptoms */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>
                            الأعراض الشائعة
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {disease.symptoms.map((symptom) => (
                                <span key={symptom} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-medium border border-rose-100">
                                    {symptom}
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
                        className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                <Stethoscope size={20} />
                            </div>
                            طريقة التشخيص
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
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
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <BookOpen className="text-rose-500" />
                                الأسباب وعوامل الخطر
                            </h3>
                            <ul className="space-y-4">
                                {disease.causes.map((cause, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                                        <span className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="leading-relaxed">{cause}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Complications */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-amber-500" />
                                المضاعفات المحتملة
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {disease.complications.map((comp, idx) => (
                                    <li key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                        {comp}
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
                            className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100"
                        >
                            <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                                <Shield className="text-emerald-600" />
                                الوقاية
                            </h3>
                            <ul className="space-y-3">
                                {disease.prevention.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-emerald-800 text-sm">
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
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4">العلاجات المقترحة</h3>
                            <div className="space-y-3">
                                {disease.treatments.map((tId) => {
                                    const treatment = diseasesTreatments.find(t => t.id === tId);
                                    if (!treatment) return null;
                                    return (
                                        <Link
                                            key={tId}
                                            to={`/awareness/treatment/${tId}`}
                                            state={{ fromDisease: { id: disease.id, name: disease.name } }}
                                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50 rounded-xl group transition-colors border border-slate-100 hover:border-rose-100"
                                        >
                                            <span className="font-medium text-slate-700 group-hover:text-rose-700 transition-colors">
                                                {treatment.name}
                                            </span>
                                            <ChevronLeft size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
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
