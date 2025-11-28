import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X } from 'lucide-react';
import { directoryItems, type DirectoryItem } from '@/data/directory';

const DirectoryManager = () => {
    const [itemsList, setItemsList] = useState<DirectoryItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<DirectoryItem>>({
        title: '',
        category: 'hospital',
        image: '',
        description: '',
        phone: '',
        location: '',
        address: '',
        rating: 5,
        features: [''],
        workHours: ''
    });

    useEffect(() => {
        const stored = localStorage.getItem('phy_directory');
        if (stored) {
            setItemsList(JSON.parse(stored));
        } else {
            setItemsList(directoryItems);
        }
    }, []);

    const saveData = (data: DirectoryItem[]) => {
        localStorage.setItem('phy_directory', JSON.stringify(data));
        setItemsList(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            const updated = itemsList.map(item =>
                item.id === editingId ? { ...formData as DirectoryItem } : item
            );
            saveData(updated);
        } else {
            const newItem: DirectoryItem = {
                ...formData as DirectoryItem,
                id: `dir_${Date.now()}`
            };
            saveData([...itemsList, newItem]);
        }

        resetForm();
    };

    const handleEdit = (item: DirectoryItem) => {
        setFormData(item);
        setEditingId(item.id);
        setIsEditing(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            saveData(itemsList.filter(item => item.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'hospital',
            image: '',
            description: '',
            phone: '',
            location: '',
            address: '',
            rating: 5,
            features: [''],
            workHours: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const updateArrayField = (index: number, value: string) => {
        const arr = formData.features as string[];
        const updated = [...arr];
        updated[index] = value;
        setFormData({ ...formData, features: updated });
    };

    const addArrayItem = () => {
        const arr = (formData.features as string[]) || [];
        setFormData({ ...formData, features: [...arr, ''] });
    };

    const removeArrayItem = (index: number) => {
        const arr = formData.features as string[];
        setFormData({ ...formData, features: arr.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة الدليل الطبي</h2>
                    <p className="text-slate-500">إضافة، تعديل، وحذف المستشفيات والعيادات</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                    >
                        <Plus size={20} />
                        إضافة عنصر جديد
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            {editingId ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
                        </h3>
                        <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as DirectoryItem['category'] })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                            >
                                <option value="hospital">مستشفى</option>
                                <option value="clinic">عيادة</option>
                                <option value="pharmacy">صيدلية</option>
                                <option value="device">أجهزة طبية</option>
                                <option value="maintenance">صيانة</option>
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">الهاتف</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ساعات العمل</label>
                                <input
                                    type="text"
                                    value={formData.workHours}
                                    onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">رابط الصورة</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">المميزات</label>
                            {formData.features?.map((item, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateArrayField(idx, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(idx)}
                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem()}
                                className="text-sm text-primary hover:underline"
                            >
                                + إضافة ميزة
                            </button>
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
                {itemsList.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-2 line-clamp-2">{item.description}</p>
                                <div className="flex gap-3 text-xs text-slate-400">
                                    <span>{item.phone}</span>
                                    <span>•</span>
                                    <span>{item.address}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
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

export default DirectoryManager;
