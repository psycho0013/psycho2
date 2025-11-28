import { useState, useEffect } from 'react';
import { AlertTriangle, User } from 'lucide-react';
import StatisticsManager from '@/services/statisticsManager';

const EmergencyStats = () => {
    const [stats, setStats] = useState({
        totalEmergencies: 0,
        male: { count: 0, percentage: 0 },
        female: { count: 0, percentage: 0 }
    });

    useEffect(() => {
        loadStats();
        window.addEventListener('stats-updated', loadStats);
        return () => window.removeEventListener('stats-updated', loadStats);
    }, []);

    const loadStats = async () => {
        const data = await StatisticsManager.getEmergencyStats();
        setStats(data);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">حالات الطوارئ</h2>
                    <p className="text-slate-500 text-xs">توزيع الحالات الحرجة حسب الجنس</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1 border-l border-slate-100">
                    <span className="block text-3xl font-bold text-slate-800">{stats.totalEmergencies}</span>
                    <span className="text-xs text-slate-500">مجموع الحالات</span>
                </div>
                <div className="flex-1 px-4 space-y-4">
                    {/* Male Stat */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1 text-slate-700">
                                <User size={14} className="text-blue-500" />
                                ذكور
                            </span>
                            <span className="font-bold text-slate-800">{stats.male.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${stats.male.percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block text-left">{stats.male.count} حالة</span>
                    </div>

                    {/* Female Stat */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1 text-slate-700">
                                <User size={14} className="text-rose-500" />
                                إناث
                            </span>
                            <span className="font-bold text-slate-800">{stats.female.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500 rounded-full"
                                style={{ width: `${stats.female.percentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-400 mt-1 block text-left">{stats.female.count} حالة</span>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs text-red-800 leading-relaxed">
                    <span className="font-bold block mb-1">ملاحظة:</span>
                    هذه الإحصائيات تمثل الحالات التي تلقت تحذيراً طبياً عاجلاً (توجيه للاتصال بالطوارئ) بعد إكمال التشخيص.
                </p>
            </div>
        </div>
    );
};

export default EmergencyStats;
