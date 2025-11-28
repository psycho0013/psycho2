import { useState, useEffect } from 'react';
import { User, Activity, Baby, School, Briefcase, Heart } from 'lucide-react';
import StatisticsManager from '@/services/statisticsManager';

interface AgeGroupStat {
    id: string;
    label: string;
    range: string;
    icon: string;
    color: string;
    topDisease: {
        name: string;
        percentage: number;
    };
    totalCases: number;
}

const AgeStats = () => {
    const [stats, setStats] = useState<AgeGroupStat[]>([]);

    useEffect(() => {
        loadStats();
        window.addEventListener('stats-updated', loadStats);
        return () => window.removeEventListener('stats-updated', loadStats);
    }, []);

    const loadStats = async () => {
        const data = await StatisticsManager.getAgeStats();
        setStats(data);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Baby': return Baby;
            case 'School': return School;
            case 'User': return User;
            case 'Briefcase': return Briefcase;
            case 'Activity': return Activity;
            case 'Heart': return Heart;
            default: return User;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">توزيع الأمراض حسب العمر</h2>
                    <p className="text-slate-500 text-sm">أكثر الأمراض شيوعاً في كل فئة عمرية</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = getIcon(stat.icon);
                    return (
                        <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{stat.label}</h3>
                                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                                            {stat.range}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-slate-800">{stat.totalCases}</span>
                                    <span className="text-xs text-slate-400">حالة مسجلة</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">الأكثر انتشاراً:</span>
                                    <span className="text-rose-600 font-bold">{stat.topDisease.name}</span>
                                </div>

                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-rose-600">
                                                {stat.topDisease.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-100">
                                        <div style={{ width: `${stat.topDisease.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgeStats;
