/**
 * Urgency Badge Component - Premium Version
 * شارة مستوى الإلحاح - النسخة المحسنة
 */

import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import type { UrgencyLevel } from '@/types/dental';
import { URGENCY_MESSAGES } from '@/types/dental';

interface UrgencyBadgeProps {
    level: UrgencyLevel;
    size?: 'sm' | 'md' | 'lg';
    showMessage?: boolean;
    animate?: boolean;
}

const sizeConfig = {
    sm: { padding: 'px-3 py-1.5', text: 'text-xs', icon: 14, gap: 'gap-1.5' },
    md: { padding: 'px-4 py-2', text: 'text-sm', icon: 18, gap: 'gap-2' },
    lg: { padding: 'px-6 py-3', text: 'text-base', icon: 22, gap: 'gap-3' },
};

const levelConfig: Record<UrgencyLevel, {
    gradient: string;
    shadow: string;
    icon: React.ReactNode;
    bgLight: string;
    textColor: string;
}> = {
    emergency: {
        gradient: 'from-red-500 via-rose-500 to-red-600',
        shadow: 'shadow-red-500/40',
        icon: <AlertTriangle />,
        bgLight: 'bg-red-50',
        textColor: 'text-red-600'
    },
    urgent: {
        gradient: 'from-orange-500 to-amber-500',
        shadow: 'shadow-orange-500/40',
        icon: <AlertCircle />,
        bgLight: 'bg-orange-50',
        textColor: 'text-orange-600'
    },
    important: {
        gradient: 'from-yellow-400 to-amber-500',
        shadow: 'shadow-yellow-500/40',
        icon: <Clock />,
        bgLight: 'bg-yellow-50',
        textColor: 'text-yellow-700'
    },
    routine: {
        gradient: 'from-emerald-500 to-green-500',
        shadow: 'shadow-emerald-500/40',
        icon: <CheckCircle />,
        bgLight: 'bg-emerald-50',
        textColor: 'text-emerald-600'
    },
};

export default function UrgencyBadge({
    level,
    size = 'md',
    showMessage = false,
    animate = true
}: UrgencyBadgeProps) {
    const urgencyInfo = URGENCY_MESSAGES[level];
    const config = levelConfig[level];
    const sizeStyles = sizeConfig[size];

    const IconComponent = ({ className }: { className?: string }) => (
        <div className={className} style={{ width: sizeStyles.icon, height: sizeStyles.icon }}>
            {level === 'emergency' && <AlertTriangle size={sizeStyles.icon} />}
            {level === 'urgent' && <AlertCircle size={sizeStyles.icon} />}
            {level === 'important' && <Clock size={sizeStyles.icon} />}
            {level === 'routine' && <CheckCircle size={sizeStyles.icon} />}
        </div>
    );

    const badgeContent = (
        <div
            className={`
                inline-flex items-center ${sizeStyles.gap} rounded-full font-semibold
                ${sizeStyles.padding} ${sizeStyles.text}
                bg-gradient-to-r ${config.gradient} text-white
                shadow-lg ${config.shadow}
            `}
        >
            <IconComponent />
            <span>{urgencyInfo.title.replace(/[🚨⚠️📋✅]/g, '').trim()}</span>
        </div>
    );

    if (animate && level === 'emergency') {
        return (
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{
                        scale: [1, 1.03, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    {/* توهج خلفي */}
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-full bg-red-500 blur-xl"
                    />
                    <div className="relative">
                        {badgeContent}
                    </div>
                </motion.div>
                {showMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 font-bold text-center text-lg"
                    >
                        {urgencyInfo.message}
                    </motion.p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {animate ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    {badgeContent}
                </motion.div>
            ) : (
                badgeContent
            )}
            {showMessage && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-center font-semibold ${config.textColor}`}
                >
                    {urgencyInfo.message}
                </motion.p>
            )}
        </div>
    );
}
