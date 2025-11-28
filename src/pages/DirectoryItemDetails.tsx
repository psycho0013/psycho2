import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Star, Clock, CheckCircle, Navigation } from 'lucide-react';
import { directoryItems } from '@/data/directory';

const DirectoryItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const item = directoryItems.find(i => i.id === id);

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">العنصر غير موجود</h2>
                <button onClick={() => navigate('/directory')} className="text-indigo-600 hover:underline">
                    العودة للدليل الطبي
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Image */}
            <div className="h-[40vh] relative">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <Link
                    to="/directory"
                    className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                    <ArrowRight size={24} />
                </Link>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{item.title}</h1>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={18} className="text-indigo-500" />
                                        <span>{item.address}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg font-bold">
                                    <Star size={18} fill="currentColor" />
                                    <span>{item.rating}</span>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed text-lg">
                                {item.description}
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6">المميزات والخدمات</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-6"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-6">معلومات التواصل</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm text-slate-500 mb-1">ساعات العمل</span>
                                        <span className="font-medium text-slate-900">{item.workHours}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="block text-sm text-slate-500 mb-1">رقم الهاتف</span>
                                        <span className="font-medium text-slate-900" dir="ltr">{item.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <a
                                    href={`tel:${item.phone}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    <Phone size={20} />
                                    اتصل الآن
                                </a>
                                <a
                                    href={item.location}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                                >
                                    <Navigation size={20} />
                                    الموقع على الخريطة
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectoryItemDetails;
