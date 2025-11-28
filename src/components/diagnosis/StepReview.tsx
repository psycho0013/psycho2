import { useState, useEffect } from 'react';
import { User, Activity, Thermometer, AlertCircle } from 'lucide-react';
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
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">مراجعة البيانات</h2>
                <p className="text-slate-500">يرجى مراجعة معلوماتك قبل الحصول على التشخيص.</p>
            </div>

            <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                        <User size={20} className="text-primary" />
                        المعلومات الشخصية
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500 block">الاسم</span>
                            <span className="font-medium text-slate-900">{state.personalInfo.name}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">العمر / الجنس</span>
                            <span className="font-medium text-slate-900">{state.personalInfo.age} سنة / {state.personalInfo.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">الوزن / الطول</span>
                            <span className="font-medium text-slate-900">{state.personalInfo.weight} كجم / {state.personalInfo.height} سم</span>
                        </div>
                    </div>
                </div>

                {/* Symptoms */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                        <AlertCircle size={20} className="text-rose-500" />
                        الأعراض المسجلة
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {state.selectedSymptoms.map((s) => (
                            <div key={s.id} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center gap-2">
                                <span className="font-medium text-slate-700">{getSymptomName(s.id)}</span>
                                <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 capitalize">{s.severity === 'mild' ? 'خفيف' : s.severity === 'moderate' ? 'متوسط' : 'شديد'}</span>
                            </div>
                        ))}
                        {state.relatedSymptoms.map((id) => (
                            <div key={id} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm flex items-center gap-2">
                                <span className="font-medium text-slate-700">{getSymptomName(id)}</span>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">ذات صلة</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vitals */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                        <Activity size={20} className="text-emerald-500" />
                        العلامات الحيوية
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Thermometer size={16} className="text-slate-400" />
                            <span className="text-slate-500">الحرارة:</span>
                            <span className="font-medium text-slate-900">{state.vitals.temperature || 37}°C</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block mb-1">الأمراض المزمنة:</span>
                            {state.vitals.chronicDiseases.length > 0 && !state.vitals.chronicDiseases.includes('none') ? (
                                <div className="flex flex-wrap gap-1">
                                    {state.vitals.chronicDiseases.map((d: string) => (
                                        <span key={d} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                            {d === 'diabetes' ? 'السكري' : d === 'hypertension' ? 'ضغط الدم' : d === 'asthma' ? 'الربو' : d === 'heart_disease' ? 'القلب' : d}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-slate-900">لا يوجد</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-between border-t border-slate-100">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-all"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                    الحصول على التشخيص
                </button>
            </div>
        </div>
    );
};

export default StepReview;
