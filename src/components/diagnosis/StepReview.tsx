import { useState, useEffect } from 'react';
import { User, Activity, Thermometer, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState } from '../../pages/Diagnosis';
import type { Symptom } from '@/types/medical';
import DbManager from '@/services/dbManager';

interface Props {
    state: DiagnosisState;
    onNext: () => void;
    onPrev: () => void;
}

const StepReview = ({ state, onNext, onPrev }: Props) => {
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await DbManager.getSymptoms();
            setSymptomsList(data);
        };
        loadData();
    }, []);

    const getSymptomName = (id: string) => symptomsList.find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    مراجعة البيانات
                </h2>
                <p className="text-slate-500">يرجى مراجعة معلوماتك بدقة قبل الحصول على التشخيص النهائي.</p>
            </div>

            <div className="space-y-6">
                {/* Personal Info */}
                <div className="glass-panel p-6">
                    <h3 className="flex items-center gap-3 font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200/50">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                            <User size={20} />
                        </div>
                        المعلومات الشخصية
                    </h3>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500">الاسم</span>
                            <span className="font-semibold text-slate-900 text-lg">{state.personalInfo.name}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500">تفاصيل الديموغرافيا</span>
                            <span className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                                {state.personalInfo.age} سنة <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {state.personalInfo.gender === 'male' ? 'ذكر' : 'أنثى'}
                            </span>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-4 bg-white/40 p-4 rounded-xl border border-white/50">
                            <div>
                                <span className="text-slate-500 block mb-1">الوزن</span>
                                <span className="font-bold text-slate-900">{state.personalInfo.weight} كجم</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-1">الطول</span>
                                <span className="font-bold text-slate-900">{state.personalInfo.height} سم</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Symptoms */}
                <div className="glass-panel p-6">
                    <h3 className="flex items-center gap-3 font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200/50">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                            <AlertCircle size={20} />
                        </div>
                        الأعراض المسجلة
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {state.selectedSymptoms.map((s) => (
                            <div key={s.id} className="px-4 py-2 bg-white/60 border border-slate-200/60 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                                <span className="font-bold text-slate-700">{getSymptomName(s.id)}</span>
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-md capitalize font-medium",
                                    s.severity === 'severe' ? "bg-rose-100 text-rose-600" :
                                        s.severity === 'moderate' ? "bg-amber-100 text-amber-600" :
                                            "bg-emerald-100 text-emerald-600"
                                )}>
                                    {s.severity === 'mild' ? 'خفيف' : s.severity === 'moderate' ? 'متوسط' : 'شديد'}
                                </span>
                            </div>
                        ))}
                        {state.relatedSymptoms.map((id) => (
                            <div key={id} className="px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-xl text-sm flex items-center gap-2 text-blue-700 shadow-sm">
                                <span className="font-medium">{getSymptomName(id)}</span>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">ذات صلة</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vitals */}
                <div className="glass-panel p-6">
                    <h3 className="flex items-center gap-3 font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200/50">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <Activity size={20} />
                        </div>
                        العلامات الحيوية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-500">
                                <Thermometer size={24} />
                            </div>
                            <div>
                                <span className="text-slate-500 text-sm block">درجة الحرارة</span>
                                <span className="font-bold text-slate-900 text-xl">{state.vitals.temperature || 37}°C</span>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                            <span className="text-slate-500 text-sm block mb-2">الأمراض المزمنة</span>
                            {state.vitals.chronicDiseases.length > 0 && !state.vitals.chronicDiseases.includes('none') ? (
                                <div className="flex flex-wrap gap-2">
                                    {state.vitals.chronicDiseases.map((d: string) => (
                                        <span key={d} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                                            {d === 'diabetes' ? 'السكري' : d === 'hypertension' ? 'ضغط الدم' : d === 'asthma' ? 'الربو' : d === 'heart_disease' ? 'القلب' : d}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-slate-400 font-medium italic">لا توجد أمراض مزمنة مسجلة</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 flex justify-between border-t border-slate-200/50">
                <button
                    onClick={onPrev}
                    className="glass-button px-8 py-3 hover:bg-white/60"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="glass-button glass-button-primary px-12 py-3 shadow-xl shadow-primary/20"
                >
                    الحصول على التشخيص
                </button>
            </div>
        </div>
    );
};

export default StepReview;
