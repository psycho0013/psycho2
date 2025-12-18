import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import StatisticsManager from '@/services/statisticsManager';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * رسم بياني: توزيع الجنس
 * دائرتين متداخلتين مع انميشن
 * ═══════════════════════════════════════════════════════════════════════════
 */

const GenderDistributionChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const records = await StatisticsManager.getRecords();

            let male = 0;
            let female = 0;

            records.forEach(record => {
                if (record.gender === 'male') male++;
                else if (record.gender === 'female') female++;
            });

            setData([
                { name: 'ذكور', value: male, color: '#3b82f6' },
                { name: 'إناث', value: female, color: '#ec4899' }
            ]);
            setTotal(male + female);
        } catch (error) {
            console.error('Error loading gender stats:', error);
        }
        setLoading(false);
    };

    const malePercentage = total > 0 ? Math.round((data[0]?.value / total) * 100) : 0;
    const femalePercentage = total > 0 ? Math.round((data[1]?.value / total) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                    <Users className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">توزيع الجنس</h3>
                    <p className="text-sm text-slate-500">ذكور vs إناث</p>
                </div>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : total === 0 ? (
                <div className="h-40 flex items-center justify-center text-slate-400">
                    لا توجد بيانات بعد
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative w-32 h-32"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={4}
                                    dataKey="value"
                                    animationDuration={1200}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={3} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-slate-700">{total}</span>
                        </div>
                    </motion.div>

                    <div className="flex-1 space-y-4">
                        {/* Male */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-slate-700">👨 ذكور</span>
                                <span className="text-sm font-bold text-blue-600">{malePercentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${malePercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{data[0]?.value || 0} مريض</p>
                        </motion.div>

                        {/* Female */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-slate-700">👩 إناث</span>
                                <span className="text-sm font-bold text-pink-600">{femalePercentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${femalePercentage}%` }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{data[1]?.value || 0} مريضة</p>
                        </motion.div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default GenderDistributionChart;
