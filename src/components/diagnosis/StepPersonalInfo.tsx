import { motion } from 'framer-motion';
import { User, Calendar, Weight, Ruler, Baby, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState, Gender } from '../../pages/Diagnosis';

interface Props {
    data: DiagnosisState['personalInfo'];
    update: (data: Partial<DiagnosisState['personalInfo']>) => void;
    onNext: () => void;
}

const StepPersonalInfo = ({ data, update, onNext }: Props) => {
    const isValid = data.name && data.age && data.weight && data.height && data.governorate;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">المعلومات الشخصية</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">الاسم الكامل</label>
                    <div className="relative">
                        <User className="absolute right-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => update({ name: e.target.value })}
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="أدخل اسمك"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">المحافظة</label>
                    <div className="relative">
                        <MapPin className="absolute right-3 top-3 text-slate-400" size={20} />
                        <select
                            value={data.governorate}
                            onChange={(e) => update({ governorate: e.target.value })}
                            className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                        >
                            <option value="">اختر المحافظة</option>
                            <option value="Baghdad">بغداد</option>
                            <option value="Basra">البصرة</option>
                            <option value="Nineveh">نينوى</option>
                            <option value="Erbil">أربيل</option>
                            <option value="Kirkuk">كركوك</option>
                            <option value="Sulaymaniyah">السليمانية</option>
                            <option value="Anbar">الأنبار</option>
                            <option value="Babylon">بابل</option>
                            <option value="Dhi Qar">ذي قار</option>
                            <option value="Najaf">النجف</option>
                            <option value="Karbala">كربلاء</option>
                            <option value="Salah Al-Din">صلاح الدين</option>
                            <option value="Diyala">ديالى</option>
                            <option value="Wasit">واسط</option>
                            <option value="Maysan">ميسان</option>
                            <option value="Qadisiyah">الديوانية</option>
                            <option value="Muthanna">المثنى</option>
                            <option value="Dohuk">دهوك</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">العمر</label>
                        <div className="relative">
                            <Calendar className="absolute right-3 top-3 text-slate-400" size={20} />
                            <input
                                type="number"
                                value={data.age}
                                onChange={(e) => update({ age: e.target.value })}
                                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">الجنس</label>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                            {(['male', 'female'] as Gender[]).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => update({ gender: g })}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                        data.gender === g ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {g === 'male' ? 'ذكر' : 'أنثى'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                                placeholder="175"
                            />
                        </div>
                    </div>
                </div>

                {data.gender === 'female' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-2 overflow-hidden"
                    >
                        <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={data.isPregnant}
                                onChange={(e) => update({ isPregnant: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="flex items-center gap-2 text-slate-700 font-medium">
                                <Baby size={20} className="text-rose-400" />
                                هل أنتِ حامل؟
                            </span>
                        </label>

                        <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={data.isBreastfeeding}
                                onChange={(e) => update({ isBreastfeeding: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="flex items-center gap-2 text-slate-700 font-medium">
                                <Baby size={20} className="text-blue-400" />
                                هل ترضعين طبيعياً؟
                            </span>
                        </label>
                    </motion.div>
                )}
            </div>

            <div className="pt-6 flex justify-end border-t border-slate-100">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    الخطوة التالية
                </button>
            </div>
        </div>
    );
};

export default StepPersonalInfo;
