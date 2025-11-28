import { useState, useEffect } from 'react';
import StatisticsManager from '@/services/statisticsManager';

interface DiseaseStat {
    name: string;
    count: number;
}

interface GovernorateStat {
    id: string;
    name: string;
    totalDiagnoses: number;
    topDiseases: DiseaseStat[];
}

const GovernorateStats = () => {
    const [stats, setStats] = useState<GovernorateStat[]>([]);

    useEffect(() => {
        loadStats();
        window.addEventListener('stats-updated', loadStats);
        return () => window.removeEventListener('stats-updated', loadStats);
    }, []);

    const loadStats = async () => {
        const data = await StatisticsManager.getGovernorateStats();
        setStats(data);
    };

    if (stats.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-800">إحصائيات المحافظات</h2>
                <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center">
                    <p className="text-slate-500">لا توجد بيانات كافية لعرض الإحصائيات حتى الآن.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">إحصائيات المحافظات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-slate-800">{stat.name}</h3>
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">
                                {stat.totalDiagnoses} تشخيص
                            </span>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs text-slate-400 font-medium">أكثر الأمراض انتشاراً:</p>
                            {stat.topDiseases.length > 0 ? (
                                <ul className="space-y-2">
                                    {stat.topDiseases.map((disease, idx) => (
                                        <li key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">{disease.name}</span>
                                            <span className="font-bold text-slate-800">{disease.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-400 italic">لا توجد أمراض مسجلة</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GovernorateStats;
