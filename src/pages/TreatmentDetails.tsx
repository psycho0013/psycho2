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
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">العلاج غير موجود</h2>
                <button onClick={() => navigate('/awareness')} className="text-primary hover:underline">
                    العودة إلى التوعية الطبية
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white pt-32 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <Link
                        to={fromDisease ? `/awareness/disease/${fromDisease.id}` : "/awareness"}
                        state={fromDisease ? {} : { activeTab: 'treatments' }}
                        className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                        <ArrowRight size={20} className="ml-2" />
                        {fromDisease ? `العودة لـ ${fromDisease.name}` : 'العودة للقائمة'}
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Pill size={32} />
                            </div>
                            <span className="text-cyan-100 font-medium tracking-wide uppercase">دليل الأدوية والعلاجات</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{treatment.name}</h1>
                                <span className="inline-block px-4 py-1.5 bg-white/20 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/10">
                                    {treatment.type}
                                </span>
                            </div>
                            {treatment.dosage && (
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 min-w-[200px]">
                                    <span className="text-cyan-200 text-sm block mb-1">الجرعة الموصى بها</span>
                                    <span className="text-xl font-bold">{treatment.dosage}</span>
                                </div>
                            )}
                            {treatment.price && (
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 min-w-[200px]">
                                    <span className="text-cyan-200 text-sm block mb-1">السعر التقريبي</span>
                                    <span className="text-xl font-bold">{treatment.price.toLocaleString()} د.ع</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
                {/* Description Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                    <p className="text-xl text-slate-600 leading-relaxed">
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
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="text-cyan-500" />
                                تعليمات الاستخدام
                            </h3>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-700 leading-loose bg-slate-50 p-6 rounded-2xl border border-slate-100">
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
                                className="bg-rose-50 p-6 rounded-3xl border border-rose-100"
                            >
                                <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-rose-500" />
                                    الآثار الجانبية المحتملة
                                </h3>
                                <ul className="space-y-3">
                                    {treatment.side_effects?.map((effect, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-rose-800">
                                            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
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
                                className="bg-amber-50 p-6 rounded-3xl border border-amber-100"
                            >
                                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-amber-500" />
                                    تحذيرات واحتياطات
                                </h3>
                                <ul className="space-y-3">
                                    {treatment.precautions?.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-amber-800 text-sm">
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
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock className="text-cyan-500" />
                                مدة العلاج
                            </h3>
                            <div className="text-3xl font-bold text-slate-800 mb-2">
                                {treatment.duration || 'حسب الحالة'}
                            </div>
                            <p className="text-sm text-slate-500">
                                استمر في العلاج للمدة المحددة حتى لو شعرت بتحسن، ما لم يوصِ الطبيب بخلاف ذلك.
                            </p>
                        </motion.div>

                        {/* Safety Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg shadow-cyan-500/20"
                        >
                            <CheckCircle className="w-10 h-10 mb-4 opacity-80" />
                            <h3 className="text-xl font-bold mb-2">معتمد طبياً</h3>
                            <p className="text-cyan-100 text-sm leading-relaxed">
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
