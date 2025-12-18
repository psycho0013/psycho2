import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatisticsManager from '@/services/statisticsManager';
import DbManager from '@/services/dbManager';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * رسم بياني: أكثر الأعراض شيوعاً
 * أعمدة متحركة بألوان متدرجة
 * ═══════════════════════════════════════════════════════════════════════════
 */

const GRADIENT_COLORS = [
    ['#3b82f6', '#60a5fa'], // Blue
    ['#8b5cf6', '#a78bfa'], // Violet
    ['#ec4899', '#f472b6'], // Pink
    ['#f59e0b', '#fbbf24'], // Amber
    ['#10b981', '#34d399'], // Emerald
    ['#06b6d4', '#22d3ee'], // Cyan
];

const TopSymptomsChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [records, symptoms] = await Promise.all([
                StatisticsManager.getRecords(),
                DbManager.getSymptoms()
            ]);

            // Count symptoms
            const symptomCount: Record<string, number> = {};
            records.forEach(record => {
                if (record.symptoms) {
                    record.symptoms.forEach((symId: string) => {
                        symptomCount[symId] = (symptomCount[symId] || 0) + 1;
                    });
                }
            });

            // Map to names and sort
            const sorted = Object.entries(symptomCount)
                .map(([id, count]) => {
                    const symptom = symptoms.find(s => s.id === id);
                    return {
                        name: symptom?.name_ar || symptom?.name || id,
                        value: count,
                        id
                    };
                })
                .sort((a, b) => b.value - a.value)
                .slice(0, 6);

            setData(sorted);
        } catch (error) {
            console.error('Error loading symptom stats:', error);
        }
        setLoading(false);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100"
                >
                    <p className="font-medium text-slate-700">{label}</p>
                    <p className="text-2xl font-bold text-violet-600">{payload[0].value}</p>
                    <p className="text-xs text-slate-400">مرة</p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Activity className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">أكثر الأعراض شيوعاً</h3>
                    <p className="text-sm text-slate-500">الأعراض المُبلغ عنها</p>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    لا توجد بيانات بعد
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="h-64"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                {GRADIENT_COLORS.map((colors, index) => (
                                    <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={colors[0]} />
                                        <stop offset="100%" stopColor={colors[1]} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                width={100}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                            <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#gradient-${index % GRADIENT_COLORS.length})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TopSymptomsChart;
