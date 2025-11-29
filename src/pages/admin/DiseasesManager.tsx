import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, Search } from 'lucide-react';
import type { Disease, Treatment, Symptom } from '@/types/medical';
import DbManager from '@/services/dbManager';

const DiseasesManager = () => {
    const [diseasesList, setDiseasesList] = useState<Disease[]>([]);
    const [availableTreatments, setAvailableTreatments] = useState<Treatment[]>([]);
    const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [symptomSearch, setSymptomSearch] = useState('');
    const [treatmentSearch, setTreatmentSearch] = useState('');
    const [formData, setFormData] = useState<Partial<Disease>>({
        name: '',
        description: '',
        symptoms: [],
        treatments: [],
        prevention: [''],
        causes: [''],
        complications: [''],
        diagnosis_method: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [diseases, treatments, symptoms] = await Promise.all([
            DbManager.getDiseases(),
            DbManager.getTreatments(),
            DbManager.getSymptoms()
        ]);
        setDiseasesList(diseases);
        setAvailableTreatments(treatments);
        setAvailableSymptoms(symptoms);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const diseaseToSave: Disease = {
            ...formData as Disease,
            id: editingId || `disease_${Date.now()}`
        };

        const success = await DbManager.saveDisease(diseaseToSave);
        if (success) {
            await loadData();
            resetForm();
        } else {
            alert('حدث خطأ أثناء حفظ البيانات');
        }
    };

    const handleEdit = (disease: Disease) => {
        setFormData(disease);
        setEditingId(disease.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المرض؟')) {
            const success = await DbManager.deleteDisease(id);
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
            symptoms: [],
            treatments: [],
            prevention: [''],
            causes: [''],
            complications: [''],
            diagnosis_method: ''
        });
        setIsEditing(false);
        setEditingId(null);
        setSymptomSearch('');
        setTreatmentSearch('');
    };

    const updateArrayField = (field: keyof Disease, index: number, value: string) => {
        const arr = formData[field] as string[];
        const updated = [...arr];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayItem = (field: keyof Disease) => {
        const arr = (formData[field] as string[]) || [];
        setFormData({ ...formData, [field]: [...arr, ''] });
    };

    const removeArrayItem = (field: keyof Disease, index: number) => {
        const arr = formData[field] as string[];
        setFormData({ ...formData, [field]: arr.filter((_, i) => i !== index) });
    };

    const filteredSymptoms = availableSymptoms.filter(s =>
        s.name.toLowerCase().includes(symptomSearch.toLowerCase()) ||
        s.category.toLowerCase().includes(symptomSearch.toLowerCase())
    );

    const filteredTreatments = availableTreatments.filter(t =>
        t.name.toLowerCase().includes(treatmentSearch.toLowerCase()) ||
        t.type.toLowerCase().includes(treatmentSearch.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة الأمراض</h2>
                    <p className="text-slate-500">إضافة، تعديل، وحذف الأمراض</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                    >
                        <Plus size={20} />
                        إضافة مرض جديد
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            {editingId ? 'تعديل المرض' : 'إضافة مرض جديد'}
                        </h3>
                        <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المرض</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                            />
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

                        {/* Symptoms Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">الأعراض الشائعة</label>
                            <div className="relative mb-2">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="بحث عن عرض..."
                                    value={symptomSearch}
                                    onChange={(e) => setSymptomSearch(e.target.value)}
                                    className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                />
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-60 overflow-y-auto space-y-2">
                                {filteredSymptoms.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-4">
                                        {availableSymptoms.length === 0 ? 'لا توجد أعراض مسجلة' : 'لا توجد نتائج للبحث'}
                                    </p>
                                ) : (
                                    filteredSymptoms.map((symptom) => (
                                        <label key={symptom.id} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                                            <input
                                                type="checkbox"
                                                checked={formData.symptoms?.includes(symptom.id)}
                                                onChange={(e) => {
                                                    const currentSymptoms = formData.symptoms || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, symptoms: [...currentSymptoms, symptom.id] });
                                                    } else {
                                                        setFormData({ ...formData, symptoms: currentSymptoms.filter(id => id !== symptom.id) });
                                                    }
                                                }}
                                                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium text-slate-700">{symptom.name}</span>
                                                <span className="text-xs text-slate-400 mr-2">({symptom.category})</span>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">طرق الوقاية</label>
                            {formData.prevention?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField('prevention', idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('prevention', idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('prevention')}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة طريقة وقاية
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الأسباب</label>
                            {formData.causes?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField('causes', idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('causes', idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('causes')}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة سبب
                            </button>
                        </div>

                        {/* Complications */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">المضاعفات المحتملة</label>
                            {formData.complications?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField('complications', idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('complications', idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('complications')}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة مضاعفات
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">طريقة التشخيص</label>
                            <textarea
                                value={formData.diagnosis_method}
                                onChange={(e) => setFormData({ ...formData, diagnosis_method: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">العلاجات المرتبطة</label>
                            <div className="relative mb-2">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="بحث عن علاج..."
                                    value={treatmentSearch}
                                    onChange={(e) => setTreatmentSearch(e.target.value)}
                                    className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                />
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-60 overflow-y-auto space-y-2">
                                {filteredTreatments.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-4">
                                        {availableTreatments.length === 0 ? 'لا توجد علاجات مسجلة' : 'لا توجد نتائج للبحث'}
                                    </p>
                                ) : (
                                    filteredTreatments.map((treatment) => (
                                        <label key={treatment.id} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-100">
                                            <input
                                                type="checkbox"
                                                checked={formData.treatments?.includes(treatment.id)}
                                                onChange={(e) => {
                                                    const currentTreatments = formData.treatments || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, treatments: [...currentTreatments, treatment.id] });
                                                    } else {
                                                        setFormData({ ...formData, treatments: currentTreatments.filter(id => id !== treatment.id) });
                                                    }
                                                }}
                                                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary/20"
                                            />
                                            <div className="flex-1">
                                                <span className="font-medium text-slate-700">{treatment.name}</span>
                                                <span className="text-xs text-slate-400 mr-2">({treatment.type})</span>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
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
                {diseasesList.map((disease) => (
                    <div key={disease.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{disease.name}</h3>
                                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{disease.description}</p>
                                <div className="flex gap-2 text-xs text-slate-400">
                                    <span>{disease.symptoms.length} أعراض</span>
                                    <span>•</span>
                                    <span>{disease.treatments.length} علاجات</span>
                                    <span>•</span>
                                    <span>{disease.complications.length} مضاعفات</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(disease)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(disease.id)}
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

export default DiseasesManager;
