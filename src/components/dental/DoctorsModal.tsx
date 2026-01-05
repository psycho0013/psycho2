/**
 * Doctors Modal Component
 * واجهة عرض الأطباء حسب المدينة
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    MapPin,
    Search,
    Users,
    ChevronRight,
    Loader2
} from 'lucide-react';
import type { Dentist, IraqCity } from '@/types/dentist';
import DentistDbManager from '@/services/dentistDbManager';
import DoctorCard from './DoctorCard';

interface DoctorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DoctorsModal({ isOpen, onClose }: DoctorsModalProps) {
    const [selectedCity, setSelectedCity] = useState<IraqCity | null>(null);
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cities = DentistDbManager.getCities();

    useEffect(() => {
        if (selectedCity) {
            loadDentists(selectedCity);
        }
    }, [selectedCity]);

    const loadDentists = async (city: IraqCity) => {
        setLoading(true);
        const data = await DentistDbManager.getDentistsByCity(city);
        setDentists(data);
        setLoading(false);
    };

    const handleCitySelect = (city: IraqCity) => {
        setSelectedCity(city);
        setSearchQuery('');
    };

    const handleBack = () => {
        setSelectedCity(null);
        setDentists([]);
    };

    const filteredDentists = dentists.filter(d =>
        d.name.includes(searchQuery) ||
        d.clinic_name.includes(searchQuery)
    );

    const selectedCityName = cities.find(c => c.id === selectedCity)?.name || '';

    // منع scroll للـ body عند فتح الـ Modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden my-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {selectedCity && (
                                    <button
                                        onClick={handleBack}
                                        className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                    >
                                        <ChevronRight size={20} className="rotate-180" />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedCity ? `أطباء ${selectedCityName}` : 'اختر مدينتك'}
                                    </h2>
                                    <p className="text-white/80 text-sm mt-1">
                                        {selectedCity
                                            ? `${filteredDentists.length} طبيب متاح`
                                            : 'سنعرض لك أفضل أطباء الأسنان في مدينتك'
                                        }
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {!selectedCity ? (
                            /* City Selection */
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500 mb-4">
                                    <MapPin size={20} className="text-primary" />
                                    <span className="font-medium">اختر مدينتك لعرض الأطباء القريبين منك</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {cities.map((city, index) => (
                                        <motion.button
                                            key={city.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleCitySelect(city.id)}
                                            className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all text-center group"
                                        >
                                            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary/10 to-blue-100 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-blue-600 group-hover:text-white transition-all">
                                                <MapPin size={24} />
                                            </div>
                                            <span className="font-bold text-slate-800">{city.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ) : loading ? (
                            /* Loading State */
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">جاري تحميل الأطباء...</p>
                            </div>
                        ) : dentists.length === 0 ? (
                            /* No Dentists */
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                    <Users size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد أطباء حالياً</h3>
                                <p className="text-slate-500">لم نجد أطباء في {selectedCityName} بعد.<br />سيتم إضافة أطباء قريباً.</p>
                            </div>
                        ) : (
                            /* Dentists List */
                            <div className="space-y-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="ابحث عن طبيب أو عيادة..."
                                        className="w-full py-3 pr-12 pl-4 rounded-xl border border-slate-200 focus:border-primary outline-none text-right"
                                        dir="rtl"
                                    />
                                </div>

                                {/* Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredDentists.map((dentist, index) => (
                                        <motion.div
                                            key={dentist.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <DoctorCard dentist={dentist} />
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredDentists.length === 0 && searchQuery && (
                                    <div className="text-center py-8 text-slate-500">
                                        لا توجد نتائج لـ "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
