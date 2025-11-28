import { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, FileText } from 'lucide-react';
import StatisticsManager from '@/services/statisticsManager';
import GovernorateStats from '@/components/admin/GovernorateStats';
import AgeStats from '@/components/admin/AgeStats';
import EmergencyStats from '@/components/admin/EmergencyStats';

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

    return (
        <div className="p-6 lg:p-12 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">لوحة التحكم</h1>
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
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                        تصدير التقرير
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = getIcon(stat.icon);
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} bg-opacity-10 text-white`}>
                                    <Icon size={24} className={stat.color.replace('bg-', 'text-')} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AgeStats />
                </div>
                <div>
                    <EmergencyStats />
                </div>
            </div>

            <GovernorateStats />
        </div>
    );
};

export default Dashboard;
