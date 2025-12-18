import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatisticsManager from '@/services/statisticsManager';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * رسم بياني: التشخيصات عبر الوقت
 * خط بياني متحرك يُظهر عدد التشخيصات اليومية
 * ═══════════════════════════════════════════════════════════════════════════
 */

const DiagnosisTimelineChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [period, setPeriod] = useState<'week' | 'month'>('week');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const records = await StatisticsManager.getRecords();

            // Group by date
            const grouped: Record<string, number> = {};
            const now = new Date();
            const daysBack = period === 'week' ? 7 : 30;

            // Initialize all days with 0
            for (let i = daysBack - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const key = date.toLocaleDateString('ar-IQ', { weekday: 'short', day: 'numeric' });
                grouped[key] = 0;
            }

            // Count diagnoses per day
            records.forEach(record => {
                const recordDate = new Date(record.created_at);
                const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff < daysBack) {
                    const key = recordDate.toLocaleDateString('ar-IQ', { weekday: 'short', day: 'numeric' });
                    if (grouped[key] !== undefined) {
                        grouped[key]++;
                    }
                }
            });

            const chartData = Object.entries(grouped).map(([name, value]) => ({
                name,
                value,
            }));

            setData(chartData);
        } catch (error) {
            console.error('Error loading timeline data:', error);
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
                    <p className="text-slate-500 text-sm">{label}</p>
                    <p className="text-2xl font-bold text-primary">{payload[0].value}</p>
                    <p className="text-xs text-slate-400">تشخيص</p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">التشخيصات عبر الوقت</h3>
                        <p className="text-sm text-slate-500">نمط الاستخدام اليومي</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {(['week', 'month'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === p
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {p === 'week' ? 'أسبوع' : 'شهر'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="h-64"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fill="url(#colorValue)"
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </motion.div>
    );
};

export default DiagnosisTimelineChart;
