import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import type { Treatment } from '@/types/medical';
import DbManager from '@/services/dbManager';

const TreatmentsManager = () => {
    const [treatmentsList, setTreatmentsList] = useState<Treatment[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Treatment>>({
        name: '',
        description: '',
        type: 'دواء',
        dosage: '',
        side_effects: [''],
        precautions: [''],
        instructions: '',
        duration: ''
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
        } else {
            alert('حدث خطأ أثناء حفظ البيانات');
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
            } else {
                alert('حدث خطأ أثناء حذف البيانات');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            type: 'دواء',
            dosage: '',
            side_effects: [''],
            precautions: [''],
            instructions: '',
            duration: ''
        });
        setIsEditing(false);
        setEditingId(null);
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم العلاج</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">التعليمات</label>
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                            />
                        </div>

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
