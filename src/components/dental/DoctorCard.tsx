/**
 * Doctor Card Component
 * كارت عرض بيانات الطبيب
 */

import { motion } from 'framer-motion';
import {
    Phone,
    MessageCircle,
    MapPin,
    Star,
    Clock,
    Award,
    ExternalLink
} from 'lucide-react';
import type { Dentist } from '@/types/dentist';
import DentistDbManager from '@/services/dentistDbManager';

interface DoctorCardProps {
    dentist: Dentist;
    onViewMap?: () => void;
}

const specializationColors: Record<string, string> = {
    general: 'from-blue-500 to-cyan-500',
    cosmetic: 'from-pink-500 to-rose-500',
    orthodontics: 'from-purple-500 to-indigo-500',
    pediatric: 'from-green-500 to-emerald-500',
    endodontics: 'from-orange-500 to-amber-500',
    periodontics: 'from-red-500 to-pink-500',
    oral_surgery: 'from-slate-600 to-slate-800',
    prosthodontics: 'from-teal-500 to-cyan-500'
};

export default function DoctorCard({ dentist }: DoctorCardProps) {
    const specializations = DentistDbManager.getSpecializations();
    const specName = specializations.find(s => s.id === dentist.specialization)?.name || dentist.specialization;
    const gradientClass = specializationColors[dentist.specialization] || 'from-blue-500 to-cyan-500';

    const handleCall = () => {
        window.open(`tel:${dentist.phone}`, '_self');
    };

    const handleWhatsApp = () => {
        const message = `مرحباً دكتور، أريد حجز موعد للفحص`;
        window.open(DentistDbManager.getWhatsAppUrl(dentist.whatsapp || dentist.phone, message), '_blank');
    };

    const handleOpenMap = () => {
        if (dentist.map_url) {
            window.open(dentist.map_url, '_blank');
        }
    };

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                size={14}
                className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100"
        >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${gradientClass} p-5 text-white relative overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
                            {dentist.image_url ? (
                                <img src={dentist.image_url} alt={dentist.name} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                dentist.name.charAt(0)
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{dentist.name}</h3>
                            <p className="text-white/80 text-sm">{specName}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {renderStars(dentist.rating)}
                                <span className="text-xs text-white/70 mr-1">({dentist.rating})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Clinic & Experience */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Award size={16} className="text-primary" />
                        <span>{dentist.experience_years} سنة خبرة</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Clock size={16} className="text-emerald-500" />
                        <span>{dentist.working_hours}</span>
                    </div>
                </div>

                {/* Clinic Name */}
                <div className="bg-slate-50 rounded-xl p-3">
                    <p className="font-bold text-slate-800">{dentist.clinic_name}</p>
                    <p className="text-sm text-slate-500">{dentist.address}</p>
                </div>

                {/* Map Button - يظهر فقط إذا كان هناك رابط */}
                {dentist.map_url && (
                    <button
                        onClick={handleOpenMap}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl text-slate-700 font-medium hover:from-slate-200 hover:to-slate-100 transition-all"
                    >
                        <MapPin size={18} className="text-red-500" />
                        <span>عرض موقع العيادة</span>
                        <ExternalLink size={14} className="text-slate-400" />
                    </button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCall}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <Phone size={18} />
                        <span>اتصال</span>
                    </motion.button>

                    {(dentist.whatsapp || dentist.phone) && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleWhatsApp}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                        >
                            <MessageCircle size={18} />
                            <span>واتساب</span>
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
