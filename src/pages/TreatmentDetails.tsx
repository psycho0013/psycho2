import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Pill, Clock, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import type { Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';


const TreatmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromDisease = location.state?.fromDisease;
    const [treatment, setTreatment] = useState<Treatment | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            const data = await DbManager.getTreatment(id);
            setTreatment(data);
        };
        loadData();
    }, [id]);

    if (!treatment) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
                <div className="liquid-bg"></div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 z-10">العلاج غير موجود</h2>
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
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white pt-32 pb-24 px-6 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/10 to-transparent"></div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <Link
                        to={fromDisease ? `/awareness/disease/${fromDisease.id}` : "/awareness"}
                        state={fromDisease ? {} : { activeTab: 'treatments' }}
                        className="inline-flex items-center text-cyan-100 hover:text-white mb-8 transition-colors bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-2xl backdrop-blur-md border border-white/10"
                    >
                        <ArrowRight size={20} className="ml-2" />
                        {fromDisease ? `العودة لـ ${fromDisease.name}` : 'العودة للقائمة'}
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/20">
                                <Pill size={32} className="text-white" />
                            </div>
                            <span className="text-cyan-100 font-bold tracking-wider uppercase text-sm border border-cyan-100/30 px-3 py-1 rounded-lg">دليل الأدوية والعلاجات</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{treatment.name}</h1>
                                <span className="inline-block px-5 py-2 bg-white/20 rounded-xl text-sm font-bold backdrop-blur-md border border-white/20 shadow-lg">
                                    {treatment.type}
                                </span>
                            </div>
                            {treatment.dosage && (
                                <div className="glass-panel p-5 bg-white/10 !border-white/20 !shadow-none !rounded-2xl backdrop-blur-md min-w-[200px]">
                                    <span className="text-cyan-100 text-sm block mb-1">الجرعة الموصى بها</span>
                                    <span className="text-2xl font-bold text-white">{treatment.dosage}</span>
                                </div>
                            )}
                            {treatment.price && (
                                <div className="glass-panel p-5 bg-white/10 !border-white/20 !shadow-none !rounded-2xl backdrop-blur-md min-w-[200px]">
                                    <span className="text-cyan-100 text-sm block mb-1">السعر التقريبي</span>
                                    <span className="text-2xl font-bold text-white">{treatment.price.toLocaleString()} د.ع</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-8">
                {/* Description Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 bg-white/90"
                >
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        {treatment.description}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Instructions */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Instructions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-xl flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                تعليمات الاستخدام
                            </h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-700 leading-loose bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100/50">
                                    {treatment.instructions || 'يرجى اتباع تعليمات الطبيب أو الصيدلي بدقة.'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Side Effects & Precautions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Side Effects */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-panel p-6 bg-rose-50/40 border-rose-100/60"
                            >
                                <h3 className="text-lg font-bold text-rose-900 mb-6 flex items-center gap-2">
                                    <AlertCircle className="text-rose-500" />
                                    الآثار الجانبية المحتملة
                                </h3>
                                <ul className="space-y-4">
                                    {treatment.side_effects?.map((effect, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-rose-800 font-medium">
                                            <span className="w-2 h-2 bg-rose-400 rounded-full shadow-sm shadow-rose-300"></span>
                                            {effect}
                                        </li>
                                    )) || <li className="text-rose-800/60 italic">لا توجد آثار جانبية شائعة مسجلة.</li>}
                                </ul>
                            </motion.div>

                            {/* Precautions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-panel p-6 bg-amber-50/40 border-amber-100/60"
                            >
                                <h3 className="text-lg font-bold text-amber-900 mb-6 flex items-center gap-2">
                                    <AlertCircle className="text-amber-500" />
                                    تحذيرات واحتياطات
                                </h3>
                                <ul className="space-y-4">
                                    {treatment.precautions?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-amber-800 text-sm font-medium">
                                            <span className="text-amber-500 mt-1">•</span>
                                            {item}
                                        </li>
                                    )) || <li className="text-amber-800/60 italic">لا توجد تحذيرات خاصة.</li>}
                                </ul>
                            </motion.div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Duration */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock className="text-cyan-500" />
                                مدة العلاج
                            </h3>
                            <div className="text-3xl font-bold text-slate-800 mb-3 ml-2">
                                {treatment.duration || 'حسب الحالة'}
                            </div>
                            <p className="text-sm text-slate-500 font-medium p-3 bg-slate-50 rounded-xl border border-slate-100">
                                استمر في العلاج للمدة المحددة حتى لو شعرت بتحسن، ما لم يوصِ الطبيب بخلاف ذلك.
                            </p>
                        </motion.div>

                        {/* Safety Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-cyan-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-cyan-500/30 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <CheckCircle className="w-12 h-12 mb-4 text-cyan-200" strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold mb-3">معتمد طبياً</h3>
                            <p className="text-cyan-50 text-sm leading-relaxed font-medium opacity-90">
                                جميع المعلومات الواردة هنا مراجعة من قبل مختصين، ولكنها لا تغني عن استشارة الطبيب المباشرة.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreatmentDetails;
