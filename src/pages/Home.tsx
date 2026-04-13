import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, ShieldCheck, HeartPulse, Search, Sparkles, Stethoscope, Microchip, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DataManager, { type SiteContent } from '@/services/dataManager';

const Home = () => {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadContent = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        loadContent();

        const handleUpdate = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };

        window.addEventListener('content-updated', handleUpdate);
        return () => window.removeEventListener('content-updated', handleUpdate);
    }, []);

    const handleQuickSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/diagnosis', { state: { initialQuery: searchQuery } });
        }
    };

    if (!content) return null;

    const { hero, howItWorks } = content.home;

    // Additional hardcoded stats for the UI improvement
    const stats = [
        { label: "دقة التشخيص الآلي", value: "95%", icon: <ShieldCheck className="text-emerald-500" /> },
        { label: "مدعوم بالذكاء الاصطناعي", value: "24/7", icon: <Microchip className="text-blue-500" /> },
        { label: "حالات طبية", value: "+500", icon: <Activity className="text-purple-500" /> },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden text-slate-800">
            {/* Dynamic Glassmorphic Background */}
            <div className="liquid-bg"></div>
            
            {/* Floating Orbs for extra premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply animate-float pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-accent/20 blur-[120px] mix-blend-multiply animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* --- Hero Section --- */}
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 px-4 lg:px-12 flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Text Column */}
                    <div className="z-10 flex flex-col items-start" dir="rtl">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border-primary/20 text-primary font-medium text-sm mb-8 shadow-sm backdrop-blur-md"
                        >
                            <Sparkles size={16} className="text-primary animate-pulse" />
                            <span>{hero.badge}</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.2] lg:leading-[1.1] mb-4 lg:mb-6 glow-text tracking-tight"
                        >
                            {hero.title}
                            {hero.titleHighlight && (
                                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent">
                                    {hero.titleHighlight}
                                </span>
                            )}
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base lg:text-xl text-slate-600 mb-8 lg:mb-10 max-w-xl leading-relaxed font-medium"
                        >
                            {hero.description}
                        </motion.p>

                        {/* Quick Interactive Search Tool */}
                        <motion.form 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            onSubmit={handleQuickSearch}
                            className="w-full max-w-md relative mb-10 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                            <div className="relative flex items-center glass-panel p-2 rounded-2xl border-white/60 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                                <Search className="text-slate-400 ml-3 mr-2" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="بماذا تشعر اليوم؟ (مثال: حمى)"
                                    className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 py-2 lg:py-3 pr-2 text-base lg:text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="bg-gradient-to-l from-primary to-blue-600 text-white p-2 lg:p-3 rounded-xl hover:shadow-lg hover:shadow-primary/40 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center">
                                    <ArrowLeft size={24} />
                                </button>
                            </div>
                        </motion.form>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/learn-more" className="px-6 py-3 glass-button flex items-center gap-2 text-slate-600 hover:text-primary">
                                {hero.secondaryButton}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Interactive Glassmorphism Dashboard Hero */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
                        className="relative hidden lg:block z-20"
                    >
                        {/* Main Dashboard Panel */}
                        <div className="glass-panel p-6 rounded-[2.5rem] relative z-10 border-white/50 shadow-2xl shadow-slate-300/50 backdrop-blur-3xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                            {/* Window UI Header */}
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <div className="mx-auto text-xs font-semibold text-slate-400 tracking-wider">AI DIAGNOSIS ENGINE</div>
                            </div>
                            
                            {/* Image with overlay */}
                            <div className="relative rounded-3xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent mix-blend-multiply z-10 group-hover:opacity-70 transition-opacity"></div>
                                <img
                                    src={hero.image}
                                    alt="Medical Technology Dashboard"
                                    className="object-cover w-full h-[400px] transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                
                                {/* Overlay scan line animation */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 z-20 shadow-[0_0_15px_rgba(14,165,233,1)] opacity-50" 
                                     style={{ animation: 'scan 4s linear infinite alternate' }}></div>
                                <style>{`
                                    @keyframes scan {
                                        0% { top: 0%; }
                                        100% { top: 100%; }
                                    }
                                `}</style>

                                {/* Diagnostics Overlay Info */}
                                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                                    <div className="glass-panel px-4 py-2 bg-white/20 border-white/20 !rounded-xl backdrop-blur-md">
                                        <div className="text-white/80 text-xs mb-1">Status</div>
                                        <div className="text-white font-bold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Active Scan
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements around dashboard */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 glass-panel p-4 z-30 rounded-2xl shadow-xl flex items-center gap-4 bg-white/90 border-white/80"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">بيانات آمنة</div>
                                <div className="text-xs text-slate-500">تشفير كامل</div>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -left-6 glass-panel p-4 z-30 rounded-2xl shadow-xl flex items-center gap-4 bg-white/90 border-white/80"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <HeartPulse size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">دقة فائقة</div>
                                <div className="text-xs text-slate-500">ذكاء اصطناعي</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* --- Stats Banner --- */}
            <div className="relative z-20 mt-8 max-w-5xl mx-auto px-4 lg:px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="glass-panel py-6 px-4 lg:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x-reverse sm:divide-x divide-slate-200/60 border-white/60 shadow-xl bg-white/70"
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center text-center gap-3 pt-4 sm:pt-0 first:pt-0 w-full">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl lg:text-3xl font-extrabold text-slate-800">{stat.value}</div>
                                <div className="p-3 bg-white/50 rounded-2xl shadow-sm border border-white/60">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* --- Quick AI Tools Entry --- */}
            <section className="py-12 lg:py-24 px-4 lg:px-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10 lg:mb-16">
                        <h2 className="text-2xl lg:text-4xl font-extrabold text-slate-900 mb-3 lg:mb-4 inline-block relative">
                            أدوات الذكاء الاصطناعي
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm lg:text-lg">
                            شخص حالتك بكل دقة وسرعة عبر أدواتنا المتخصصة المدعومة بأحدث النماذج الطبية.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tool 1 */}
                        <Link to="/diagnosis" className="glass-card glow-border p-6 lg:p-8 group">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 lg:mb-6 text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                <Stethoscope size={28} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2 lg:mb-3 group-hover:text-primary transition-colors">التشخيص العام</h3>
                            <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-4 lg:mb-6">حلل الأعراض العامة والمشاكل الصحية للحصول على تقييم مبدئي دقيق وتوجيهات طبية.</p>
                            <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:translate-x-[-8px] transition-transform">
                                ابدأ الآن <ChevronLeft size={18} />
                            </div>
                        </Link>

                        {/* Tool 2 */}
                        <Link to="/dental-diagnosis" className="glass-card glow-border p-6 lg:p-8 group">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-4 lg:mb-6 text-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                <Sparkles size={28} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2 lg:mb-3 group-hover:text-emerald-500 transition-colors">تشخيص الأسنان</h3>
                            <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-4 lg:mb-6">أداة متخصصة لتقييم آلام الأسنان ومشاكل اللثة وتقديم النصائح الأولية للحفاظ على صحة فمك.</p>
                            <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:translate-x-[-8px] transition-transform">
                                ابدأ الآن <ChevronLeft size={18} />
                            </div>
                        </Link>

                        {/* Tool 3 */}
                        <Link to="/scanners" className="glass-card glow-border p-6 lg:p-8 group">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-4 lg:mb-6 text-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2 lg:mb-3 group-hover:text-purple-500 transition-colors">التحاليل والفحوصات</h3>
                            <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-4 lg:mb-6">ارفع نتائج تحليلاتك المختبرية ليقوم الذكاء الاصطناعي بقراءتها وتفسيرها بلغة مبسطة ومفهومة.</p>
                            <div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:translate-x-[-8px] transition-transform">
                                ابدأ الآن <ChevronLeft size={18} />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- How it Works Section --- */}
            <section className="py-12 lg:py-24 px-4 lg:px-12 relative z-10 w-full overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 lg:mb-20">
                        <h2 className="text-2xl lg:text-4xl font-extrabold text-slate-900 mb-3 lg:mb-4 inline-block relative">
                            {howItWorks.title}
                            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-sm lg:text-lg">
                            {howItWorks.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line for larger screens */}
                        <div className="hidden md:block absolute top-[60px] left-20 right-20 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 -z-10"></div>

                        {howItWorks.steps.map((step, index) => {
                            const IconComponent = step.icon === 'Activity' ? Activity :
                                step.icon === 'ShieldCheck' ? ShieldCheck :
                                    step.icon === 'HeartPulse' ? HeartPulse : Activity;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: index * 0.2, duration: 0.6 }}
                                    className="glass-panel bg-white/60 p-6 pt-10 lg:p-8 lg:pt-12 relative group hover:-translate-y-2 transition-transform duration-500"
                                >
                                    {/* Icon Top Center overlapping */}
                                    <div className={`absolute -top-8 lg:-top-10 left-1/2 -translate-x-1/2 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl glass-panel shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] ${step.color.replace('bg-', 'bg-white/80 text-').split(' ')[1]}`}>
                                        <div className={`absolute inset-0 rounded-2xl opacity-20 ${step.color.split(' ')[0]}`}></div>
                                        <IconComponent size={28} className="relative z-10" />
                                    </div>

                                    <div className="text-center mt-4 lg:mt-6">
                                        <div className="text-xs lg:text-sm font-bold text-slate-400 mb-1 lg:mb-2 uppercase tracking-widest">الخطوة 0{index + 1}</div>
                                        <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2 lg:mb-4">{step.title}</h3>
                                        <p className="text-slate-500 text-sm lg:text-base leading-relaxed">{step.description}</p>
                                    </div>
                                    
                                    {/* Subtle step number background */}
                                    <div className="absolute -bottom-6 -right-4 text-9xl font-black text-slate-100/50 -z-10 rotate-[-10deg] group-hover:text-primary/5 transition-colors">
                                        {index + 1}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
