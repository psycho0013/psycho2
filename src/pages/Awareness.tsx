import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Pill, ChevronLeft } from 'lucide-react';
import type { Disease, Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';
import { cn } from '@/lib/utils';

const Awareness = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'diseases' | 'treatments'>(
        location.state?.activeTab || 'diseases'
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [treatments, setTreatments] = useState<Treatment[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const [fetchedDiseases, fetchedTreatments] = await Promise.all([
                DbManager.getDiseases(),
                DbManager.getTreatments()
            ]);
            setDiseases(fetchedDiseases);
            setTreatments(fetchedTreatments);
        };
        loadData();
    }, []);

    const filteredDiseases = diseases.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTreatments = treatments.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 lg:p-12 relative overflow-hidden">
            <div className="liquid-bg"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-4">
                        توعية طبية
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                        استكشف مكتبتنا الشاملة للأمراض والعلاجات لتبقى على اطلاع بصحتك.
                    </p>
                </div>

                {/* Search and Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex bg-white/30 p-1 rounded-2xl backdrop-blur-md border border-white/40 shadow-sm">
                        <button
                            onClick={() => setActiveTab('diseases')}
                            className={cn(
                                "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                activeTab === 'diseases'
                                    ? "bg-primary/90 text-white shadow-lg shadow-primary/30"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                            )}
                        >
                            الأمراض
                        </button>
                        <button
                            onClick={() => setActiveTab('treatments')}
                            className={cn(
                                "px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                activeTab === 'treatments'
                                    ? "bg-primary/90 text-white shadow-lg shadow-primary/30"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                            )}
                        >
                            العلاجات
                        </button>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن مرض أو علاج..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass-input pr-12 pl-4"
                        />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'diseases' ? (
                        filteredDiseases.map((disease, index) => (
                            <Link
                                to={`/awareness/disease/${disease.id}`}
                                key={disease.id}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass-card p-6 h-full flex flex-col group"
                                >
                                    <div className="w-14 h-14 bg-rose-50/50 text-rose-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-rose-500/30">
                                        <BookOpen size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">{disease.name}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                                        {disease.description}
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-bold mt-auto group-hover:translate-x-[-5px] transition-transform">
                                        اقرأ المزيد <ChevronLeft size={16} className="mr-1" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        filteredTreatments.map((treatment, index) => (
                            <Link
                                to={`/awareness/treatment/${treatment.id}`}
                                key={treatment.id}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass-card p-6 h-full flex flex-col group"
                                >
                                    <div className="w-14 h-14 bg-blue-50/50 text-blue-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/30">
                                        <Pill size={28} />
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{treatment.name}</h3>
                                        <span className="text-xs px-2.5 py-1 bg-white/50 text-slate-600 rounded-lg uppercase font-bold border border-white/60">
                                            {treatment.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                                        {treatment.description}
                                    </p>
                                    <div className="text-sm text-slate-500 p-3 bg-white/30 rounded-xl border border-white/40">
                                        <span className="text-slate-400 block text-xs mb-1">الجرعة</span>
                                        <span className="text-slate-800 font-bold">{treatment.dosage}</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Awareness;
