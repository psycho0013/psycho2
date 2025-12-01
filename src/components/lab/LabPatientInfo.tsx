import { Calendar, Weight, Ruler, FileText, Clock, Pill } from 'lucide-react';

interface PatientData {
    age: string;
    gender: 'male' | 'female';
    weight: string;
    height: string;
    chronicDiseases: string[];
    medications: string;
    reason: string;
    isFasting: boolean;
    fastingHours: string;
    testDate: string;
}

interface Props {
    data: PatientData;
    update: (data: Partial<PatientData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const CHRONIC_DISEASES = [
    'سكري', 'ضغط', 'مشاكل غدة', 'مشاكل كبد', 'مشاكل كلى', 'ربو', 'أمراض قلب', 'أمراض مناعية', 'لا يوجد'
];

const LabPatientInfo = ({ data, update, onNext, onBack }: Props) => {
    const toggleDisease = (disease: string) => {
        if (disease === 'لا يوجد') {
            update({ chronicDiseases: ['لا يوجد'] });
            return;
        }

        let newDiseases = [...data.chronicDiseases];
        if (newDiseases.includes('لا يوجد')) {
            newDiseases = newDiseases.filter(d => d !== 'لا يوجد');
        }

        if (newDiseases.includes(disease)) {
            newDiseases = newDiseases.filter(d => d !== disease);
        } else {
            newDiseases.push(disease);
        }
        update({ chronicDiseases: newDiseases });
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">بيانات المريض</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age & Gender */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">العمر</label>
                        <div className="relative">
                            <Calendar className="absolute right-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                value={data.age}
                                onChange={(e) => update({ age: e.target.value })}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="العمر بالسنوات"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">الجنس</label>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                                onClick={() => update({ gender: 'male' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${data.gender === 'male' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                            >
                                ذكر
                            </button>
                            <button
                                onClick={() => update({ gender: 'female' })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${data.gender === 'female' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                            >
                                أنثى
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weight & Height */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">الوزن (كجم)</label>
                        <div className="relative">
                            <Weight className="absolute right-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                value={data.weight}
                                onChange={(e) => update({ weight: e.target.value })}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="70"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">الطول (سم)</label>
                        <div className="relative">
                            <Ruler className="absolute right-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                value={data.height}
                                onChange={(e) => update({ height: e.target.value })}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="170"
                            />
                        </div>
                    </div>
                </div>

                {/* Chronic Diseases */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-3 block">الأمراض المزمنة</label>
                    <div className="flex flex-wrap gap-2">
                        {CHRONIC_DISEASES.map(disease => (
                            <button
                                key={disease}
                                onClick={() => toggleDisease(disease)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${data.chronicDiseases.includes(disease)
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                {disease}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Medications */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1 block">الأدوية الحالية</label>
                    <div className="relative">
                        <Pill className="absolute right-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={data.medications}
                            onChange={(e) => update({ medications: e.target.value })}
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="اكتب أسماء الأدوية إن وجدت"
                        />
                    </div>
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1 block">سبب إجراء التحليل</label>
                    <div className="relative">
                        <FileText className="absolute right-3 top-3 text-slate-400" size={20} />
                        <textarea
                            value={data.reason}
                            onChange={(e) => update({ reason: e.target.value })}
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[100px]"
                            placeholder="مثال: فحص دوري، شعور بالتعب..."
                        />
                    </div>
                </div>

                {/* Fasting & Date */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.isFasting}
                                onChange={(e) => update({ isFasting: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="text-slate-700">هل كنت صائم؟</span>
                        </label>
                        {data.isFasting && (
                            <input
                                type="number"
                                value={data.fastingHours}
                                onChange={(e) => update({ fastingHours: e.target.value })}
                                className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                placeholder="ساعات"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">تاريخ ووقت التحليل</label>
                    <div className="relative">
                        <Clock className="absolute right-3 top-3 text-slate-400" size={20} />
                        <input
                            type="datetime-local"
                            value={data.testDate}
                            onChange={(e) => update({ testDate: e.target.value })}
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                    تحليل النتائج
                </button>
            </div>
        </div>
    );
};

export default LabPatientInfo;
