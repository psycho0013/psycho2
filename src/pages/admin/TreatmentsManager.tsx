import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import type { Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';
import { useToast } from '@/components/ui/Toast';

const TreatmentsManager = () => {
    const toast = useToast();
    const [treatmentsList, setTreatmentsList] = useState<Treatment[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Treatment>>({
        name: '',
        name_en: '',
        description: '',
        type: 'دواء',
        dosage: '',
        side_effects: [''],
        precautions: [''],
        instructions: '',
        duration: '',
        contraindicated_pregnancy: false,
        contraindicated_breastfeeding: false,
        contraindicated_chronic_diseases: [],
        age_restriction_min: undefined,
        age_restriction_max: undefined
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await DbManager.getTreatments();
        setTreatmentsList(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const treatmentToSave: Treatment = {
            ...formData as Treatment,
            id: editingId || `treatment_${Date.now()}`
        };

        const success = await DbManager.saveTreatment(treatmentToSave);
        if (success) {
            await loadData();
            resetForm();
            toast.success('تم حفظ العلاج بنجاح');
        } else {
            toast.error('حدث خطأ أثناء حفظ البيانات');
        }
    };

    const handleEdit = (treatment: Treatment) => {
        setFormData(treatment);
        setEditingId(treatment.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا العلاج؟')) {
            const success = await DbManager.deleteTreatment(id);
            if (success) {
                await loadData();
                toast.success('تم حذف العلاج بنجاح');
            } else {
                toast.error('حدث خطأ أثناء حذف البيانات');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            name_en: '',
            description: '',
            type: 'دواء',
            dosage: '',
            side_effects: [''],
            precautions: [''],
            instructions: '',
            duration: '',
            contraindicated_pregnancy: false,
            contraindicated_breastfeeding: false,
            contraindicated_chronic_diseases: [],
            age_restriction_min: undefined,
            age_restriction_max: undefined
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const updateArrayField = (field: keyof Treatment, index: number, value: string) => {
        const arr = formData[field] as string[];
        const updated = [...arr];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayItem = (field: keyof Treatment) => {
        const arr = (formData[field] as string[]) || [];
        setFormData({ ...formData, [field]: [...arr, ''] });
    };

    const removeArrayItem = (field: keyof Treatment, index: number) => {
        const arr = formData[field] as string[];
        setFormData({ ...formData, [field]: arr.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة العلاجات</h2>
                    <p className="text-slate-500">إضافة، تعديل، وحذف العلاجات</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                    >
                        <Plus size={20} />
                        إضافة علاج جديد
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            {editingId ? 'تعديل العلاج' : 'إضافة علاج جديد'}
                        </h3>
                        <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العلاج (بالعربي)</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                                placeholder="مثال: باراسيتامول"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العلاج (بالإنجليزي) - للماسح</label>
                            <input
                                type="text"
                                value={formData.name_en || ''}
                                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                placeholder="Example: Paracetamol"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">النوع</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Treatment['type'] })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                            >
                                <option value="دواء">دواء</option>
                                <option value="نمط حياة">نمط حياة</option>
                                <option value="إجراء طبي">إجراء طبي</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24 resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الجرعة</label>
                                <input
                                    type="text"
                                    value={formData.dosage}
                                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">المدة</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">السعر (د.ع)</label>
                            <input
                                type="number"
                                value={formData.price || ''}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                placeholder="مثال: 5000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التعليمات</label>
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                            />
                        </div>

                        {/* Side Effects */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الآثار الجانبية</label>
                            {formData.side_effects?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField('side_effects', idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('side_effects', idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('side_effects')}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة أثر جانبي
                            </button>
                        </div>

                        {/* Precautions */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التحذيرات والاحتياطات</label>
                            {formData.precautions?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField('precautions', idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('precautions', idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('precautions')}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة تحذير/احتياط
                            </button>
                        </div>

                        {/* ═══════════════════════════════════════════════════════════════════ */}
                        {/* موانع الاستخدام - قسم جديد */}
                        {/* ═══════════════════════════════════════════════════════════════════ */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl border border-red-100">
                            <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                ⚠️ موانع الاستخدام (Contraindications)
                            </h4>
                            <p className="text-xs text-red-600 mb-4">
                                حدد الحالات التي يُمنع فيها استخدام هذا العلاج - سيتم استبعاده تلقائياً من التوصيات
                            </p>

                            {/* Pregnancy & Breastfeeding */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 cursor-pointer hover:bg-red-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.contraindicated_pregnancy || false}
                                        onChange={(e) => setFormData({ ...formData, contraindicated_pregnancy: e.target.checked })}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-200"
                                    />
                                    <div>
                                        <span className="font-medium text-slate-700">🤰 ممنوع للحوامل</span>
                                        <p className="text-xs text-slate-500">يُستبعد تلقائياً إذا كانت المريضة حاملاً</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100 cursor-pointer hover:bg-red-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.contraindicated_breastfeeding || false}
                                        onChange={(e) => setFormData({ ...formData, contraindicated_breastfeeding: e.target.checked })}
                                        className="w-5 h-5 text-red-500 rounded focus:ring-2 focus:ring-red-200"
                                    />
                                    <div>
                                        <span className="font-medium text-slate-700">🤱 ممنوع للمرضعات</span>
                                        <p className="text-xs text-slate-500">يُستبعد تلقائياً إذا كانت المريضة مُرضعة</p>
                                    </div>
                                </label>
                            </div>

                            {/* Age Restrictions */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الحد الأدنى للعمر</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="120"
                                        value={formData.age_restriction_min || ''}
                                        onChange={(e) => setFormData({ ...formData, age_restriction_min: e.target.value ? parseInt(e.target.value) : undefined })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        placeholder="مثال: 18"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الحد الأقصى للعمر</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="120"
                                        value={formData.age_restriction_max || ''}
                                        onChange={(e) => setFormData({ ...formData, age_restriction_max: e.target.value ? parseInt(e.target.value) : undefined })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        placeholder="مثال: 65"
                                    />
                                </div>
                            </div>

                            {/* Chronic Diseases */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">ممنوع لمرضى (اختر الأمراض المزمنة)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['السكري', 'ارتفاع ضغط الدم', 'أمراض القلب', 'أمراض الكلى', 'أمراض الكبد', 'الربو', 'الصرع', 'الغدة الدرقية'].map((disease) => (
                                        <label key={disease} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-50">
                                            <input
                                                type="checkbox"
                                                checked={formData.contraindicated_chronic_diseases?.includes(disease) || false}
                                                onChange={(e) => {
                                                    const current = formData.contraindicated_chronic_diseases || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, contraindicated_chronic_diseases: [...current, disease] });
                                                    } else {
                                                        setFormData({ ...formData, contraindicated_chronic_diseases: current.filter(d => d !== disease) });
                                                    }
                                                }}
                                                className="w-4 h-4 text-red-500 rounded"
                                            />
                                            <span className="text-sm text-slate-700">{disease}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* ═══════════════════════════════════════════════════════════════════ */}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                حفظ
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {treatmentsList.map((treatment) => (
                    <div key={treatment.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-800">{treatment.name}</h3>
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                        {treatment.type}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-2 line-clamp-2">{treatment.description}</p>
                                <div className="text-xs text-slate-400">
                                    {treatment.dosage && <span>الجرعة: {treatment.dosage}</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(treatment)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(treatment.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TreatmentsManager;
