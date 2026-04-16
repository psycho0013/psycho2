import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, AlertTriangle, Stethoscope, BookOpen, ChevronLeft, HeartPulse, Brain, Wind, Eye, Ear, Bone, Smile, Thermometer, Droplets, Info } from 'lucide-react';
import type { Disease, Treatment, Symptom } from '@/types/medical';
import { symptomCategories } from '@/types/medical';
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
                        
                        {/* ════════════ 1. المؤشرات البصرية السريعة (Visual Badges) ════════════ */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            {/* Critical Badge */}
                            {disease.symptoms.some(sId => allSymptoms.find(s => s.id === sId)?.is_critical) ? (
                                <div className="flex items-center gap-2 bg-red-500/20 border border-red-300/30 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg shadow-red-900/20">
                                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                                    <span className="text-white font-bold text-sm tracking-wide">يحتوي أعراض حرجة</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-300/30 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg shadow-emerald-900/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                    <span className="text-white font-bold text-sm tracking-wide">لا توجد أعراض طارئة مسجلة</span>
                                </div>
                            )}

                            {/* Symptoms Count Badge */}
                            <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                                <Activity size={16} className="text-rose-200" />
                                <span className="text-white font-bold text-sm">{disease.symptoms.length} أعراض مرتبطة</span>
                            </div>

                            {/* Affected Systems Count Badge */}
                            <div className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                                <Shield size={16} className="text-rose-200" />
                                <span className="text-white font-bold text-sm">
                                    يؤثر على {new Set(disease.symptoms.map(sId => allSymptoms.find(s => s.id === sId)?.category).filter(Boolean)).size} أجهزة حيوية
                                </span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-8">
                
                {/* ════════════ 2. الأجهزة المتأثرة (Affected Systems - Body Map) ════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200 overflow-hidden relative"
                >
                    {/* Decorative Background */}
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shadow-inner border border-slate-200">
                            <Activity size={20} />
                        </div>
                        الأجهزة العضوية المتأثرة
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 relative z-10 font-medium">الأنظمة والأعضاء الحيوية التي يستهدفها هذا المرض بناءً على الأعراض المصاحبة.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative z-10">
                        {/* Calculate unique affected systems */}
                        {Array.from(new Set(disease.symptoms.map(sId => {
                            const sym = allSymptoms.find(s => s.id === sId);
                            return sym ? sym.category : null;
                        }).filter(Boolean))).map((categoryId, index) => {
                            const category = symptomCategories.find(c => c.id === categoryId);
                            if (!category) return null;

                            // Map category to aesthetic icons and colors
                            let Icon = Info;
                            let colorClass = 'text-slate-500 bg-slate-50 border-slate-200';
                            let glowClass = 'group-hover:shadow-slate-500/30';

                            switch(category.id) {
                                case 'Cardiovascular': Icon = HeartPulse; colorClass = 'text-rose-500 bg-rose-50 border-rose-200'; glowClass = 'group-hover:shadow-rose-500/30'; break;
                                case 'Neurological': Icon = Brain; colorClass = 'text-purple-500 bg-purple-50 border-purple-200'; glowClass = 'group-hover:shadow-purple-500/30'; break;
                                case 'Respiratory': Icon = Wind; colorClass = 'text-sky-500 bg-sky-50 border-sky-200'; glowClass = 'group-hover:shadow-sky-500/30'; break;
                                case 'Ophthalmological': Icon = Eye; colorClass = 'text-emerald-500 bg-emerald-50 border-emerald-200'; glowClass = 'group-hover:shadow-emerald-500/30'; break;
                                case 'ENT': Icon = Ear; colorClass = 'text-amber-500 bg-amber-50 border-amber-200'; glowClass = 'group-hover:shadow-amber-500/30'; break;
                                case 'Musculoskeletal': Icon = Bone; colorClass = 'text-orange-500 bg-orange-50 border-orange-200'; glowClass = 'group-hover:shadow-orange-500/30'; break;
                                case 'Psychological': Icon = Smile; colorClass = 'text-indigo-500 bg-indigo-50 border-indigo-200'; glowClass = 'group-hover:shadow-indigo-500/30'; break;
                                case 'General': Icon = Thermometer; colorClass = 'text-teal-500 bg-teal-50 border-teal-200'; glowClass = 'group-hover:shadow-teal-500/30'; break;
                                case 'Hematological': Icon = Droplets; colorClass = 'text-red-600 bg-red-50 border-red-200'; glowClass = 'group-hover:shadow-red-600/30'; break;
                                default: Icon = Activity; colorClass = 'text-blue-500 bg-blue-50 border-blue-200'; glowClass = 'group-hover:shadow-blue-500/30'; break;
                            }

                            return (
                                <motion.div 
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 bg-white hover:bg-slate-50 cursor-default shadow-sm ${glowClass}`}
                                >
                                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${colorClass}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
                                        {category.name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
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
