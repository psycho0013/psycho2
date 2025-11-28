import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Building2, Stethoscope, Pill, Wrench, Activity, ArrowRight } from 'lucide-react';
import { directoryItems } from '@/data/directory';

const categories = [
    { id: 'all', label: 'الكل', icon: Building2 },
    { id: 'hospital', label: 'مستشفيات', icon: Activity },
    { id: 'clinic', label: 'عيادات', icon: Stethoscope },
    { id: 'pharmacy', label: 'صيدليات', icon: Pill },
    { id: 'device', label: 'أجهزة طبية', icon: Activity },
    { id: 'maintenance', label: 'صيانة', icon: Wrench },
];

const MedicalDirectory = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = directoryItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white pt-12 pb-24 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        الدليل الطبي الشامل
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10"
                    >
                        اكتشف أفضل المستشفيات، العيادات، الصيدليات، ومراكز الخدمات الطبية في منطقتك.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto relative"
                    >
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="ابحث عن اسم، تخصص، أو منطقة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-12 pl-4 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 shadow-lg focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-sm ${activeCategory === cat.id
                                ? 'bg-white text-indigo-600 shadow-md scale-105'
                                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900'
                                }`}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Directory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, index) => (
                        <Link to={`/directory/${item.id}`} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 h-full flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
                                        {categories.find(c => c.id === item.category)?.label}
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-amber-400 text-sm font-bold">
                                        <Star size={14} fill="currentColor" />
                                        {item.rating}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
                                        <MapPin size={16} className="mt-0.5 shrink-0" />
                                        <span className="line-clamp-1">{item.address}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                            <Phone size={16} />
                                            <span dir="ltr">{item.phone}</span>
                                        </div>
                                        <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد نتائج</h3>
                        <p className="text-slate-500">جرب البحث بكلمات مختلفة أو تغيير التصنيف.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalDirectory;
