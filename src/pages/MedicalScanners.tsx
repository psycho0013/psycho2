import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanFace, Pill, ArrowRight, Sparkles } from 'lucide-react';
import MedicineScannerModal from '@/components/MedicineScannerModal';
import XRayScannerModal from '@/components/XRayScannerModal';

const MedicalScanners = () => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isXRayOpen, setIsXRayOpen] = useState(false);

    // Variants for animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden" dir="rtl">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16">
                
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 text-sm font-bold mb-6">
                            <Sparkles size={16} />
                            <span>تقنيات الذكاء الاصطناعي المجسّدة</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 leading-tight">
                            أدوات الفحص  
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500"> الذكي</span>
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            استخدم أحدث ما توصلت إليه تكنولوجيا الذكاء الاصطناعي لفحص الأدوية وتحليل صور الأشعة، للحصول على نتائج طبية سريعة ودقيقة.
                        </p>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto"
                >
                    {/* Medicine Scanner Card */}
                    <motion.div 
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group cursor-pointer relative"
                        onClick={() => setIsScannerOpen(true)}
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500" />
                        
                        <div className="relative h-full bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center overflow-hidden">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                <Pill size={40} className="text-emerald-500" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">ماسح الأدوية</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                قم بتصوير الدواء أو رفع صورته ليتعرف عليه الذكاء الاصطناعي ويعطيك تفاصيله والجرعات الآمنة بشكل فوري.
                            </p>
                            
                            <div className="mt-auto">
                                <span className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all">
                                    ابدأ الفحص الآن <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* X-Ray Analyzer Card — NOW ACTIVE! */}
                    <motion.div 
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group cursor-pointer relative"
                        onClick={() => setIsXRayOpen(true)}
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500" />

                        <div className="relative h-full bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center overflow-hidden">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                <ScanFace size={40} className="text-indigo-500" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">محلل صور الأشعة</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                ارفع صور الأشعة السينية أو المقطعية ليتم تحليلها بالذكاء الاصطناعي والتعرف على الملاحظات الطبية المحتملة.
                            </p>
                            
                            <div className="mt-auto">
                                <span className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
                                    ابدأ التحليل الآن <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

            </div>

            {/* Modal Components */}
            <MedicineScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
            <XRayScannerModal isOpen={isXRayOpen} onClose={() => setIsXRayOpen(false)} />
        </div>
    );
};

export default MedicalScanners;
