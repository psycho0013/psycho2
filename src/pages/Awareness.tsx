import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Pill, ChevronLeft } from 'lucide-react';
import type { Disease, Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';

const Awareness = () => {
    const [activeTab, setActiveTab] = useState<'diseases' | 'treatments'>('diseases');
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
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">توعية طبية</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        استكشف مكتبتنا الشاملة للأمراض والعلاجات لتبقى على اطلاع بصحتك.
                    </p>
                </div>

                {/* Search and Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab('diseases')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'diseases'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            الأمراض
                        </button>
                        <button
                            onClick={() => setActiveTab('treatments')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'treatments'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            العلاجات
                        </button>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن مرض أو علاج..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer h-full"
                                >
                                    <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{disease.name}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                        {disease.description}
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-medium">
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
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all group cursor-pointer h-full"
                                >
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Pill size={24} />
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">{treatment.name}</h3>
                                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase font-bold">
                                            {treatment.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                                        {treatment.description}
                                    </p>
                                    <div className="text-sm text-slate-400">
                                        الجرعة: <span className="text-slate-700 font-medium">{treatment.dosage}</span>
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
