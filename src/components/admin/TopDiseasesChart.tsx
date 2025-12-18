import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import StatisticsManager from '@/services/statisticsManager';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * رسم بياني: أكثر الأمراض تشخيصاً
 * دائري متحرك مع ألوان متدرجة
 * ═══════════════════════════════════════════════════════════════════════════
 */

const COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
];

const TopDiseasesChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const records = await StatisticsManager.getRecords();

            // Count diseases
            const diseaseCount: Record<string, number> = {};
            records.forEach(record => {
                if (record.disease_name) {
                    diseaseCount[record.disease_name] = (diseaseCount[record.disease_name] || 0) + 1;
                }
            });

            // Sort and take top 6
            const sorted = Object.entries(diseaseCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([name, value]) => ({ name, value }));

            setData(sorted);
            setTotal(sorted.reduce((acc, item) => acc + item.value, 0));
        } catch (error) {
            console.error('Error loading disease stats:', error);
        }
        setLoading(false);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-slate-100"
                >
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-2xl font-bold" style={{ color: payload[0].payload.fill }}>
                        {item.value} <span className="text-sm font-normal text-slate-400">({percentage}%)</span>
                    </p>
                </motion.div>
            );
        }
        return null;
    };

    const onPieEnter = (_: any, index: number) => setActiveIndex(index);
    const onPieLeave = () => setActiveIndex(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Stethoscope className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">أكثر الأمراض تشخيصاً</h3>
                    <p className="text-sm text-slate-500">الأمراض الأكثر شيوعاً</p>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    لا توجد بيانات بعد
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="w-48 h-48"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    onMouseLeave={onPieLeave}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="white"
                                            strokeWidth={2}
                                            style={{
                                                filter: activeIndex === index ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <div className="flex-1 space-y-2">
                        {data.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${activeIndex === index ? 'bg-slate-50' : ''
                                    }`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm text-slate-700 truncate flex-1">{item.name}</span>
                                <span className="text-sm font-bold text-slate-800">{item.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TopDiseasesChart;
