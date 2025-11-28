import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import type { Symptom } from '@/types/medical';
import { symptomCategories } from '@/types/medical';
import DbManager from '@/services/dbManager';

const SymptomsManager = () => {
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({
        id: '',
        name: '',
        category: 'General',
        severities: ['mild', 'moderate', 'severe']
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
        if (!currentSymptom.name || !currentSymptom.category) return;

        const symptomToSave: Symptom = {
            id: currentSymptom.id || crypto.randomUUID(),
            name: currentSymptom.name,
            category: currentSymptom.category,
            severities: currentSymptom.severities || ['mild', 'moderate', 'severe']
        };

        const success = await DbManager.saveSymptom(symptomToSave);
        if (success) {
            await loadSymptoms();
            setIsEditing(false);
            setCurrentSymptom({ id: '', name: '', category: 'General', severities: ['mild', 'moderate', 'severe'] });
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
        setCurrentSymptom(symptom);
        setIsEditing(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة الأعراض</h1>
                    <p className="text-slate-500">إضافة وتعديل الأعراض الطبية</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentSymptom({ id: '', name: '', category: 'General', severities: ['mild', 'moderate', 'severe'] });
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
                            <label className="text-sm font-medium text-slate-700">اسم العرض</label>
                            <input
                                type="text"
                                value={currentSymptom.name}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="مثال: صداع نصفي"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">التصنيف</label>
                            <select
                                value={currentSymptom.category}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, category: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                            >
                                {symptomCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
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
                                <th className="p-4 text-sm font-semibold text-slate-600">اسم العرض</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">التصنيف</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">جاري التحميل...</td>
                                </tr>
                            ) : symptomsList.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">لا توجد أعراض مسجلة</td>
                                </tr>
                            ) : (
                                symptomsList.map((symptom) => (
                                    <tr key={symptom.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{symptom.name}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                {symptomCategories.find(c => c.id === symptom.category)?.name || symptom.category}
                                            </span>
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
