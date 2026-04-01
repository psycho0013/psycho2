import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, FlaskConical, Smile, ScanFace, Pill, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

const ServicesHub = () => {
    const services = [
        {
            id: 'general',
            title: 'التشخيص الذكي',
            description: 'تشخيص الأعراض العامة باستخدام الذكاء الاصطناعي مع مراعاة العمر والأمراض المزمنة.',
            icon: Activity,
            path: '/diagnosis',
            color: 'from-blue-500 to-indigo-500',
            bgGlow: 'bg-blue-400/20'
        },
        {
            id: 'dental',
            title: 'تشخيص الأسنان',
            description: 'تحليل أعراض الفم والأسنان لتقديم التوجيهات المبدئية للعناية بصحة فمك.',
            icon: Smile,
            path: '/dental-diagnosis',
            color: 'from-emerald-400 to-teal-500',
            bgGlow: 'bg-emerald-400/20'
        },
        {
            id: 'lab',
            title: 'المختبر الذكي',
            description: 'قراءة وفهم نتائج التحاليل المختبرية بطريقة سهلة ومبسطة للمريض.',
            icon: FlaskConical,
            path: '/lab-diagnosis',
            color: 'from-amber-400 to-orange-500',
            bgGlow: 'bg-amber-400/20'
        },
        {
            id: 'medicines',
            title: 'ماسح الأدوية',
            description: 'صوّر الدواء أو ارفع صورته ليتعرف عليه الذكاء الاصطناعي ويعطيك تفاصيله والجرعات الآمنة.',
            icon: Pill,
            path: '/scanners',
            color: 'from-rose-400 to-red-500',
            bgGlow: 'bg-rose-400/20'
        },
        {
            id: 'scanners',
            title: 'محلل صور الأشعة',
            description: 'تحليل ذكي لصور الأشعة السينية والمقطعية والرنين المغناطيسي بالذكاء الاصطناعي.',
            icon: ScanFace,
            path: '/scanners',
            color: 'from-purple-500 to-pink-500',
            bgGlow: 'bg-purple-400/20'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden" dir="rtl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-cyan-50 to-slate-50 pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-cyan-600 border border-slate-200 text-sm font-bold mb-6 shadow-sm">
                            <Sparkles size={16} />
                            <span>بوابتك الشاملة للصحة</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 leading-tight">
                            أدوات <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">التشخيص الذكي</span>
                        </h1>
                        <p className="text-lg text-slate-500">
                            اختر الأداة المناسبة لحالتك للحصول على مساعدة طبية استرشادية وسريعة بأحدث تقنيات الذكاء الاصطناعي.
                        </p>
                    </motion.div>
                </div>

                {/* Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
                >
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <motion.div key={service.id} variants={cardVariants}>
                                <Link 
                                    to={service.path}
                                    className="block group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden"
                                >
                                    {/* Highlight Glow Hover */}
                                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-full ${service.bgGlow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={32} />
                                        </div>
                                        <div className={`w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors`}>
                                            <ArrowLeft size={20} />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h2>
                                    <p className="text-slate-500 leading-relaxed">
                                        {service.description}
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Disclaimer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-2xl mx-auto mt-16 bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-baseline gap-3 justify-center text-center"
                >
                    <ShieldCheck size={20} className="text-amber-500 shrink-0 translate-y-1" />
                    <p className="text-sm text-amber-700 font-medium">
                        جميع نتائج أدوات التشخيص هي لأغراض تثقيفية واسترشادية فقط ولا تعتبر بديلاً عن الاستشارة الطبية المتخصصة.
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default ServicesHub;
