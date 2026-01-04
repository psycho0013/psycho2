/**
 * Dental Symptoms Manager - Admin Page
 * صفحة إدارة أعراض الأسنان
 */

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, AlertTriangle, Smile } from 'lucide-react';
import type { DentalSymptom, SymptomCategory, DentalSeverity } from '@/types/dental';
import DentalDbManager from '@/services/dentalDbManager';

const severityOptions: { id: DentalSeverity; name: string; color: string }[] = [
    { id: 'mild', name: 'خفيف', color: 'bg-green-100 text-green-700' },
    { id: 'moderate', name: 'متوسط', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'severe', name: 'شديد', color: 'bg-red-100 text-red-700' },
];

const DentalSymptomsManager = () => {
    const [symptomsList, setSymptomsList] = useState<DentalSymptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSymptom, setCurrentSymptom] = useState<Partial<DentalSymptom>>({
        id: '',
        name: '',
        name_en: '',
        category: 'pain',
        severities: ['mild', 'moderate', 'severe'],
        description: '',
        followUpQuestions: []
    });
    const [loading, setLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState('');

    const categories = DentalDbManager.getDentalCategories();

    useEffect(() => {
        loadSymptoms();
    }, []);

    const loadSymptoms = async () => {
        setLoading(true);
        const data = await DentalDbManager.getDentalSymptoms();
        setSymptomsList(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentSymptom.name || !currentSymptom.name_en || !currentSymptom.category) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const symptomToSave: DentalSymptom = {
            id: currentSymptom.id || `dental_${Date.now()}`,
            name: currentSymptom.name!,
            name_en: currentSymptom.name_en!,
            category: currentSymptom.category as SymptomCategory,
            severities: currentSymptom.severities || ['mild', 'moderate', 'severe'],
            description: currentSymptom.description,
            followUpQuestions: currentSymptom.followUpQuestions
        };

        const success = await DentalDbManager.saveDentalSymptom(symptomToSave);
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
            const success = await DentalDbManager.deleteDentalSymptom(id);
            if (success) {
                await loadSymptoms();
            } else {
                alert('حدث خطأ أثناء حذف العرض');
            }
        }
    };

    const startEdit = (symptom: DentalSymptom) => {
        setCurrentSymptom({ ...symptom });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentSymptom({
            id: '',
            name: '',
            name_en: '',
            category: 'pain',
            severities: ['mild', 'moderate', 'severe'],
            description: '',
            followUpQuestions: []
        });
        setNewQuestion('');
    };

    const toggleSeverity = (severity: DentalSeverity) => {
        const current = currentSymptom.severities || [];
        if (current.includes(severity)) {
            setCurrentSymptom({
                ...currentSymptom,
                severities: current.filter(s => s !== severity)
            });
        } else {
            setCurrentSymptom({
                ...currentSymptom,
                severities: [...current, severity]
            });
        }
    };

    const addQuestion = () => {
        if (!newQuestion.trim()) return;
        setCurrentSymptom({
            ...currentSymptom,
            followUpQuestions: [...(currentSymptom.followUpQuestions || []), newQuestion.trim()]
        });
        setNewQuestion('');
    };

    const removeQuestion = (index: number) => {
        setCurrentSymptom({
            ...currentSymptom,
            followUpQuestions: (currentSymptom.followUpQuestions || []).filter((_, i) => i !== index)
        });
    };

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || id;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                        <Smile size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إدارة أعراض الأسنان</h1>
                        <p className="text-slate-500">إضافة وتعديل الأعراض التي يختارها المريض</p>
                    </div>
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

            {/* Form */}
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
                        {/* Name AR */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">اسم العرض (بالعربي) *</label>
                            <input
                                type="text"
                                value={currentSymptom.name}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-right"
                                placeholder="مثال: ألم عند المضغ"
                                dir="rtl"
                            />
                        </div>

                        {/* Name EN */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Symptom Name (English) *</label>
                            <input
                                type="text"
                                value={currentSymptom.name_en}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, name_en: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-left"
                                placeholder="Ex: Pain when chewing"
                                dir="ltr"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">الفئة *</label>
                            <select
                                value={currentSymptom.category}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, category: e.target.value as SymptomCategory })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Severities */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">مستويات الشدة المتاحة</label>
                            <div className="flex gap-2">
                                {severityOptions.map(sev => (
                                    <button
                                        key={sev.id}
                                        type="button"
                                        onClick={() => toggleSeverity(sev.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentSymptom.severities?.includes(sev.id)
                                                ? sev.color + ' ring-2 ring-offset-1'
                                                : 'bg-slate-100 text-slate-400'
                                            }`}
                                    >
                                        {sev.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">الوصف</label>
                            <textarea
                                value={currentSymptom.description}
                                onChange={(e) => setCurrentSymptom({ ...currentSymptom, description: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-right resize-none"
                                placeholder="وصف مختصر للعرض يساعد المريض على فهمه"
                                rows={2}
                                dir="rtl"
                            />
                        </div>

                        {/* Follow-up Questions */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">أسئلة المتابعة (اختياري)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                                    className="flex-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none text-right"
                                    placeholder="أضف سؤال متابعة..."
                                    dir="rtl"
                                />
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    إضافة
                                </button>
                            </div>
                            {currentSymptom.followUpQuestions && currentSymptom.followUpQuestions.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {currentSymptom.followUpQuestions.map((q, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                                            <span className="flex-1 text-sm text-slate-700">{q}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(index)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-600">الاسم (عربي)</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">Name (English)</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الفئة</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الشدة</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">جاري التحميل...</td>
                                </tr>
                            ) : symptomsList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertTriangle className="text-amber-400" size={32} />
                                            <span>لا توجد أعراض مسجلة</span>
                                            <span className="text-xs text-slate-400">اضغط "عرض جديد" لإضافة الأعراض</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                symptomsList.map((symptom) => (
                                    <tr key={symptom.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{symptom.name}</td>
                                        <td className="p-4 font-medium text-slate-700 text-left" dir="ltr">{symptom.name_en}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                {getCategoryName(symptom.category)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1">
                                                {symptom.severities.map(s => (
                                                    <span
                                                        key={s}
                                                        className={`px-2 py-0.5 rounded text-xs ${severityOptions.find(o => o.id === s)?.color || ''
                                                            }`}
                                                    >
                                                        {severityOptions.find(o => o.id === s)?.name}
                                                    </span>
                                                ))}
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

export default DentalSymptomsManager;
