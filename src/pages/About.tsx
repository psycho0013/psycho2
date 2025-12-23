import { motion } from 'framer-motion';
import {
    Cpu, Shield, Zap, Database, ArrowRight, Brain,
    Stethoscope, Activity, Sparkles, CheckCircle2,
    Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden" dir="rtl">

            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            {/* 🎨 الخلفية المتحركة (Dynamic Background - Light) */}
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse-slow delay-2000" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* 🏠 زر الرجوع (Navigation) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all group">
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        <span>العودة للرئيسية</span>
                    </Link>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* 🚀 الهيرو (Hero Section) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <div className="text-center max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-sm font-bold mb-6">
                            <Sparkles size={14} />
                            <span>الإصدار 2.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900">
                            مستقبل التشخيص الطبي
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">بين يديك</span>
                        </h1>
                        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                            منصة SmartTashkhees تجمع بين دقة الطب البشري وسرعة الذكاء الاصطناعي لتقديم تجربة تشخيص لا مثيل لها.
                        </p>
                    </motion.div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* 💡 دليل الاستخدام (User Guide) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <div className="mb-32">
                    <SectionTitle title="كيف تبدأ رحلتك؟" subtitle="خطوات بسيطة للحصول على أفضل نتيجة" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StepCard
                            number="01"
                            title="سجّل الأعراض بدقة"
                            desc="اختر الأعراض التي تشعر بها من القائمة. كلما كنت أدق، كانت النتيجة أفضل."
                            icon={<Activity className="text-emerald-500" />}
                            delay={0.1}
                        />
                        <StepCard
                            number="02"
                            title="ذكاء اصطناعي يحلل"
                            desc="النظام يقارن أعراضك مع آلاف الحالات الطبية في ثوانٍ باستخدام خوارزميات متقدمة."
                            icon={<Brain className="text-primary" />}
                            delay={0.2}
                        />
                        <StepCard
                            number="03"
                            title="النتيجة والتوصيات"
                            desc="احصل على تشخيص فوري مع نسبة دقة وتوصيات علاجية أولية ومراجعة الطبيب."
                            icon={<Stethoscope className="text-blue-500" />}
                            delay={0.3}
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* ⚠️ حدود الاستخدام (Usage Limits) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-[3rem] p-1 bg-gradient-to-r from-primary via-purple-400 to-blue-400 shadow-2xl shadow-primary/20"
                    >
                        <div className="bg-white rounded-[2.8rem] p-10 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold mb-6">
                                    الاستخدام العادل
                                </span>
                                <h3 className="text-4xl font-bold mb-4 text-slate-900">10 تشخيصات يومياً</h3>
                                <p className="text-slate-500 max-w-2xl mx-auto mb-8">
                                    لضمان أفضل أداء للجميع، نمنح كل مستخدم 10 محاولات تشخيص دقيقة يومياً.
                                    يتم تجديد الرصيد تلقائياً كل 24 ساعة.
                                </p>

                                <div className="flex justify-center gap-2">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-2 h-8 rounded-full bg-gradient-to-t from-primary to-blue-300" style={{ opacity: i < 7 ? 1 : 0.2 }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* 🧬 التقنيات (Tech Specs) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <div className="mb-32">
                    <SectionTitle title="ماذا يحدث في الخلفية؟" subtitle="تقنيات متطورة تعمل لأجلك" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <TechCard
                            title="XGBoost AI"
                            desc="خوارزميات تعلم آلي فائقة السرعة لتصنيف الأمراض."
                            icon={<Cpu />}
                            color="from-orange-100 to-red-100"
                            iconColor="text-orange-600"
                        />
                        <TechCard
                            title="قاعدة بيانات حية"
                            desc="آلاف السجلات الطبية المحدثة باستمرار."
                            icon={<Database />}
                            color="from-blue-100 to-cyan-100"
                            iconColor="text-blue-600"
                        />
                        <TechCard
                            title="حماية وتشفير"
                            desc="بياناتك مشفرة ولا يتم مشاركتها مع أي طرف ثالث."
                            icon={<Shield />}
                            color="from-emerald-100 to-green-100"
                            iconColor="text-emerald-600"
                        />
                        <TechCard
                            title="تحليل فوري"
                            desc="معالجة البيانات في أقل من 500 مللي ثانية."
                            icon={<Zap />}
                            color="from-yellow-100 to-amber-100"
                            iconColor="text-amber-600"
                        />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                {/* 💎 الباقات (Pricing) */}
                {/* ═══════════════════════════════════════════════════════════════════════════ */}
                <div className="mb-20">
                    <SectionTitle title="خطط الاشتراك" subtitle="اختر الخطة المناسبة لاحتياجاتك" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <PricingCard
                            title="البداية"
                            price="مجاناً"
                            features={['10 تشخيصات يومياً', 'سجل طبي أساسي', 'دعم فني عبر البريد']}
                            delay={0.1}
                        />
                        <PricingCard
                            title="المحترف"
                            price="$9.99"
                            period="/ شهرياً"
                            features={['تشخيصات غير محدودة', 'تحليل صور الأشعة (قريباً)', 'أولوية في الدعم', 'تقارير PDF مفصلة']}
                            isPopular
                            delay={0.2}
                        />
                        <PricingCard
                            title="المؤسسات"
                            price="$49.99"
                            period="/ شهرياً"
                            features={['API خاص', 'لوحة تحكم للأطباء', 'تخصيص كامل للنظام', 'دعم فني 24/7']}
                            delay={0.3}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🧩 المكونات الفرعية (Sub-components)
// ═══════════════════════════════════════════════════════════════════════════

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full mb-6" />
        <p className="text-slate-500 text-lg">{subtitle}</p>
    </div>
);

const StepCard = ({ number, title, desc, icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="group relative p-8 rounded-3xl bg-white/60 border border-white/50 shadow-xl shadow-slate-200/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-1"
    >
        <div className="absolute top-4 left-6 text-6xl font-black text-slate-900/10 select-none group-hover:text-primary/10 transition-colors">
            {number}
        </div>
        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const TechCard = ({ title, desc, icon, color, iconColor }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden relative group"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center ${iconColor} mb-4 shadow-sm relative z-10`}>
            {icon}
        </div>
        <h4 className="text-lg font-bold mb-2 text-slate-800 relative z-10">{title}</h4>
        <p className="text-slate-500 text-sm relative z-10">{desc}</p>
    </motion.div>
);

const PricingCard = ({ title, price, period, features, isPopular, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className={`relative p-8 rounded-[2.5rem] border ${isPopular ? 'bg-white shadow-2xl shadow-primary/20 scale-105 z-10 border-primary/20' : 'bg-white/60 border-white/50 shadow-xl shadow-slate-200/50'}`}
    >
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-primary text-white text-sm font-bold shadow-lg flex items-center gap-1">
                <Sparkles size={14} /> الأكثر طلباً
            </div>
        )}

        <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-slate-500 mb-2">{title}</h3>
            <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold text-slate-900">{price}</span>
                {period && <span className="text-slate-400 text-sm">{period}</span>}
            </div>
        </div>

        <ul className="space-y-4 mb-8">
            {features.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    {feat}
                </li>
            ))}
        </ul>

        <button className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isPopular
            ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
            {price === 'مجاناً' ? 'ابدأ الآن' : (
                <>
                    <Lock size={16} /> الاشتراك (قريباً)
                </>
            )}
        </button>
    </motion.div>
);

export default About;
