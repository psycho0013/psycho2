import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, TrendingUp, FileText, Sparkles } from 'lucide-react';
import StatisticsManager from '@/services/statisticsManager';
import GovernorateStats from '@/components/admin/GovernorateStats';
import AgeStats from '@/components/admin/AgeStats';
import EmergencyStats from '@/components/admin/EmergencyStats';
import DiagnosisTimelineChart from '@/components/admin/DiagnosisTimelineChart';
import TopDiseasesChart from '@/components/admin/TopDiseasesChart';
import TopSymptomsChart from '@/components/admin/TopSymptomsChart';
import GenderDistributionChart from '@/components/admin/GenderDistributionChart';
import ConfidenceGauge from '@/components/admin/ConfidenceGauge';

const Dashboard = () => {
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        loadStats();
        window.addEventListener('stats-updated', loadStats);
        return () => window.removeEventListener('stats-updated', loadStats);
    }, []);

    const loadStats = async () => {
        const data = await StatisticsManager.getDashboardStats();
        setStats(data || []);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return Users;
            case 'Activity': return Activity;
            case 'TrendingUp': return TrendingUp;
            case 'FileText': return FileText;
            default: return Activity;
        }
    };

    const iconColors = [
        'from-blue-500 to-blue-400',
        'from-emerald-500 to-emerald-400',
        'from-violet-500 to-purple-400',
        'from-amber-500 to-orange-400'
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100/50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
                    </div>
                    <p className="text-slate-500">نظرة عامة على إحصائيات وأداء النظام</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
                                await StatisticsManager.clearData();
                            }
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        حذف البيانات
                    </button>
                    <button
                        onClick={async () => await StatisticsManager.exportReport()}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
                    >
                        تصدير التقرير
                    </button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = getIcon(stat.icon);
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${iconColors[index % iconColors.length]} shadow-lg`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${stat.change.startsWith('+')
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-red-50 text-red-600'
                                        }`}
                                >
                                    {stat.change}
                                </motion.span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="text-3xl font-bold text-slate-800"
                            >
                                {stat.value}
                            </motion.p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Timeline Chart - Full Width */}
            <DiagnosisTimelineChart />

            {/* Charts Row 1: Diseases & Symptoms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopDiseasesChart />
                <TopSymptomsChart />
            </div>

            {/* Charts Row 2: Gender & Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenderDistributionChart />
                <ConfidenceGauge />
            </div>

            {/* Charts Row 3: Age & Emergency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AgeStats />
                </div>
                <div>
                    <EmergencyStats />
                </div>
            </div>

            {/* Governorate Stats */}
            <GovernorateStats />
        </div>
    );
};

export default Dashboard;

