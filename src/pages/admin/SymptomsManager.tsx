import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';
import type { Symptom } from '@/types/medical';
import { symptomCategories } from '@/types/medical';
import DbManager from '@/services/dbManager';

const SymptomsManager = () => {
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({
        id: '',
        name_ar: '',
        name_en: '',
        category: 'General',
        severities: ['mild', 'moderate', 'severe'],
        is_critical: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSymptoms();
    }, []);

    const loadSymptoms = async () => {
        setLoading(true);
        const data = await DbManager.getSymptoms();
        setSymptomsList(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentSymptom.name_ar || !currentSymptom.name_en || !currentSymptom.category) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const symptomToSave: Symptom = {
            id: currentSymptom.id || crypto.randomUUID(),
            name: currentSymptom.name_ar, // For backward compatibility
            name_ar: currentSymptom.name_ar,
            name_en: currentSymptom.name_en,
            category: currentSymptom.category,
            severities: currentSymptom.severities || ['mild', 'moderate', 'severe'],
            is_critical: currentSymptom.is_critical || false
        };

        const success = await DbManager.saveSymptom(symptomToSave);
        if (success) {
            await loadSymptoms();
            setIsEditing(false);
            resetForm();
        } else {
            alert('حدث خطأ أثناء حفظ العرض');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
            const success = await DbManager.deleteSymptom(id);
            if (success) {
                await loadSymptoms();
            } else {
                alert('حدث خطأ أثناء حذف العرض');
            }
        }
    };

    const startEdit = (symptom: Symptom) => {
        setCurrentSymptom({
            ...symptom,
            name_ar: symptom.name_ar || symptom.name, // Fallback to name if name_ar is missing
            name_en: symptom.name_en || ''
        });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentSymptom({
            id: '',
            name_ar: '',
            name_en: '',
            category: 'General',
            severities: ['mild', 'moderate', 'severe'],
            is_critical: false
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة الأعراض</h1>
                    <p className="text-slate-500">إضافة وتعديل الأعراض الطبية (عربي / إنجليزي)</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsEditing(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    عرض جديد
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            {currentSymptom.id ? 'تعديل عرض' : 'إضافة عرض جديد'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">اسم العرض (بالعربي)</label>
                            <input
                                type="text"
                                value={currentSymptom.name_ar}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, name_ar: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-right"
                                placeholder="مثال: صداع نصفي"
                                dir="rtl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Symptom Name (English)</label>
                            <input
                                type="text"
                                value={currentSymptom.name_en}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, name_en: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-left"
                                placeholder="Ex: Migraine"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">التصنيف</label>
                            <select
                                value={currentSymptom.category}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, category: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                            >
                                {symptomCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} / {cat.name_en}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Critical Symptom Toggle */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl cursor-pointer hover:bg-red-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={currentSymptom.is_critical || false}
                                    onChange={(e) => setCurrentSymptom({ ...currentSymptom, is_critical: e.target.checked })}
                                    className="w-5 h-5 accent-red-500"
                                />
                                <AlertTriangle className="text-red-500" size={20} />
                                <div>
                                    <span className="font-bold text-red-800">عرض حرج (طوارئ)</span>
                                    <p className="text-xs text-red-600">إذا اختار المريض هذا العرض بشدة "شديدة"، سيظهر تنبيه الطوارئ</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">الاسم (عربي)</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">Name (English)</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">التصنيف</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">جاري التحميل...</td>
                                </tr>
                            ) : symptomsList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">لا توجد أعراض مسجلة</td>
                                </tr>
                            ) : (
                                symptomsList.map((symptom) => (
                                    <tr key={symptom.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{symptom.name_ar || symptom.name}</td>
                                        <td className="p-4 font-medium text-slate-700 text-left" dir="ltr">{symptom.name_en || '-'}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                    {symptomCategories.find(c => c.id === symptom.category)?.name || symptom.category}
                                                </span>
                                                {symptom.is_critical && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs flex items-center gap-1">
                                                        <AlertTriangle size={12} />
                                                        حرج
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => startEdit(symptom)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(symptom.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SymptomsManager;
