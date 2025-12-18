import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import StatisticsManager from '@/services/statisticsManager';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * عداد: متوسط نسبة الثقة في التشخيص
 * مع انميشن دائري متحرك
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ConfidenceGauge = () => {
    const [avgConfidence, setAvgConfidence] = useState(0);
    const [totalDiagnoses, setTotalDiagnoses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const records = await StatisticsManager.getRecords();

            // For now, we'll simulate confidence based on whether disease was found
            const withDiagnosis = records.filter(r => r.disease_name);
            const successRate = records.length > 0
                ? Math.round((withDiagnosis.length / records.length) * 100)
                : 0;

            setAvgConfidence(successRate);
            setTotalDiagnoses(records.length);

            // Simulate trend (in real app, compare with last week)
            setTrend(successRate >= 70 ? 'up' : successRate >= 50 ? 'neutral' : 'down');
        } catch (error) {
            console.error('Error loading confidence stats:', error);
        }
        setLoading(false);
    };

    const getColor = () => {
        if (avgConfidence >= 70) return { main: '#10b981', bg: '#d1fae5', text: '#065f46' };
        if (avgConfidence >= 50) return { main: '#f59e0b', bg: '#fef3c7', text: '#92400e' };
        return { main: '#ef4444', bg: '#fee2e2', text: '#991b1b' };
    };

    const color = getColor();
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference * (1 - avgConfidence / 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Target className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">معدل نجاح التشخيص</h3>
                    <p className="text-sm text-slate-500">نسبة التشخيصات الناجحة</p>
                </div>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex items-center justify-center gap-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring", stiffness: 60 }}
                        className="relative w-32 h-32"
                    >
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="64"
                                cy="64"
                                r="45"
                                stroke="#f1f5f9"
                                strokeWidth="10"
                                fill="none"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="45"
                                stroke={color.main}
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                className="text-3xl font-bold"
                                style={{ color: color.main }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {avgConfidence}%
                            </motion.span>
                        </div>
                    </motion.div>

                    <div className="space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-2"
                        >
                            {trend === 'up' ? (
                                <TrendingUp className="text-emerald-500" size={20} />
                            ) : trend === 'down' ? (
                                <TrendingDown className="text-red-500" size={20} />
                            ) : (
                                <Target className="text-amber-500" size={20} />
                            )}
                            <span className="text-sm font-medium" style={{ color: color.text }}>
                                {avgConfidence >= 70 ? 'أداء ممتاز!' : avgConfidence >= 50 ? 'أداء جيد' : 'يحتاج تحسين'}
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-sm text-slate-500"
                        >
                            إجمالي التشخيصات
                            <span className="block text-xl font-bold text-slate-800">{totalDiagnoses}</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: color.bg, color: color.text }}
                        >
                            {avgConfidence >= 70 ? '✓ أعلى من المتوسط' : avgConfidence >= 50 ? '~ ضمن المتوسط' : '↓ أقل من المتوسط'}
                        </motion.div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ConfidenceGauge;
