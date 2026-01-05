/**
 * Dentists Manager - Admin Page
 * صفحة إدارة أطباء الأسنان
 */

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, AlertTriangle, Stethoscope, MapPin, Phone } from 'lucide-react';
import type { Dentist, IraqCity, DentalSpecialization } from '@/types/dentist';
import DentistDbManager from '@/services/dentistDbManager';

const DentistsManager = () => {
    const [dentistsList, setDentistsList] = useState<Dentist[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDentist, setCurrentDentist] = useState<Partial<Dentist>>({
        id: '',
        name: '',
        specialization: 'general',
        city: 'baghdad',
        clinic_name: '',
        address: '',
        phone: '',
        whatsapp: '',
        map_url: '',
        image_url: '',
        rating: 5,
        experience_years: 0,
        working_hours: '9:00 ص - 9:00 م',
        is_active: true
    });
    const [loading, setLoading] = useState(true);

    const cities = DentistDbManager.getCities();
    const specializations = DentistDbManager.getSpecializations();

    useEffect(() => {
        loadDentists();
    }, []);

    const loadDentists = async () => {
        setLoading(true);
        const { data, error } = await (await import('@/lib/supabase')).supabase
            .from('dentists')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setDentistsList(data);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentDentist.name || !currentDentist.clinic_name || !currentDentist.phone) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const dentistToSave: Dentist = {
            id: currentDentist.id || `dentist_${Date.now()}`,
            name: currentDentist.name!,
            specialization: currentDentist.specialization as DentalSpecialization,
            city: currentDentist.city as IraqCity,
            clinic_name: currentDentist.clinic_name!,
            address: currentDentist.address || '',
            phone: currentDentist.phone!,
            whatsapp: currentDentist.whatsapp,
            map_url: currentDentist.map_url,
            image_url: currentDentist.image_url,
            rating: currentDentist.rating || 5,
            experience_years: currentDentist.experience_years || 0,
            working_hours: currentDentist.working_hours || '9:00 ص - 9:00 م',
            is_active: currentDentist.is_active ?? true
        };

        // Optimistic update
        if (currentDentist.id) {
            setDentistsList(prev => prev.map(d => d.id === dentistToSave.id ? dentistToSave : d));
        } else {
            setDentistsList(prev => [dentistToSave, ...prev]);
        }

        setIsEditing(false);
        resetForm();

        const success = await DentistDbManager.saveDentist(dentistToSave);
        if (!success) {
            alert('حدث خطأ أثناء حفظ الطبيب');
            loadDentists();
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
            setDentistsList(prev => prev.filter(d => d.id !== id));

            const success = await DentistDbManager.deleteDentist(id);
            if (!success) {
                alert('حدث خطأ أثناء حذف الطبيب');
                loadDentists();
            }
        }
    };

    const startEdit = (dentist: Dentist) => {
        setCurrentDentist({ ...dentist });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentDentist({
            id: '',
            name: '',
            specialization: 'general',
            city: 'baghdad',
            clinic_name: '',
            address: '',
            phone: '',
            whatsapp: '',
            map_url: '',
            image_url: '',
            rating: 5,
            experience_years: 0,
            working_hours: '9:00 ص - 9:00 م',
            is_active: true
        });
    };

    const getCityName = (id: string) => cities.find(c => c.id === id)?.name || id;
    const getSpecName = (id: string) => specializations.find(s => s.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إدارة أطباء الأسنان</h1>
                        <p className="text-slate-500">إضافة وتعديل الأطباء حسب المدن</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    طبيب جديد
                </button>
            </div>

            {/* Form */}
            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">
                            {currentDentist.id ? 'تعديل طبيب' : 'إضافة طبيب جديد'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">اسم الطبيب *</label>
                            <input
                                type="text"
                                value={currentDentist.name}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="د. أحمد ..."
                                dir="rtl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">المدينة *</label>
                            <select
                                value={currentDentist.city}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, city: e.target.value as IraqCity })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                            >
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">التخصص</label>
                            <select
                                value={currentDentist.specialization}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, specialization: e.target.value as DentalSpecialization })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                            >
                                {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">اسم العيادة *</label>
                            <input
                                type="text"
                                value={currentDentist.clinic_name}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, clinic_name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="عيادة الابتسامة"
                                dir="rtl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">العنوان</label>
                            <input
                                type="text"
                                value={currentDentist.address}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, address: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="الكرادة - شارع 52"
                                dir="rtl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">رقم الهاتف *</label>
                            <input
                                type="tel"
                                value={currentDentist.phone}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, phone: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="07801234567"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">رقم واتساب</label>
                            <input
                                type="tel"
                                value={currentDentist.whatsapp}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, whatsapp: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="9647801234567"
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">سنوات الخبرة</label>
                            <input
                                type="number"
                                value={currentDentist.experience_years}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, experience_years: parseInt(e.target.value) })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">التقييم (1-5)</label>
                            <input
                                type="number"
                                value={currentDentist.rating}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, rating: parseFloat(e.target.value) })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                min="1"
                                max="5"
                                step="0.1"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">ساعات العمل</label>
                            <input
                                type="text"
                                value={currentDentist.working_hours}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, working_hours: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="9:00 ص - 9:00 م"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-slate-700">رابط الموقع (Google Maps)</label>
                            <input
                                type="url"
                                value={currentDentist.map_url || ''}
                                onChange={(e) => setCurrentDentist({ ...currentDentist, map_url: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="https://maps.google.com/..."
                                dir="ltr"
                            />
                            <p className="text-xs text-slate-400">افتح Google Maps → اضغط على العيادة → انسخ الرابط من المتصفح</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-xl">إلغاء</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center gap-2">
                            <Save size={18} />
                            حفظ
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
                                <th className="p-4 text-sm font-semibold text-slate-600">الطبيب</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">المدينة</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">التخصص</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الهاتف</th>
                                <th className="p-4 text-sm font-semibold text-slate-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">جاري التحميل...</td></tr>
                            ) : dentistsList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <AlertTriangle className="mx-auto text-amber-400 mb-2" size={32} />
                                        <span>لا يوجد أطباء مسجلين</span>
                                    </td>
                                </tr>
                            ) : (
                                dentistsList.map((dentist) => (
                                    <tr key={dentist.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div>
                                                <span className="font-bold text-slate-900">{dentist.name}</span>
                                                <span className="text-sm text-slate-500 block">{dentist.clinic_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs flex items-center gap-1 w-fit">
                                                <MapPin size={12} />
                                                {getCityName(dentist.city)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{getSpecName(dentist.specialization)}</td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-sm text-slate-600">
                                                <Phone size={14} />
                                                {dentist.phone}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => startEdit(dentist)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(dentist.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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

export default DentistsManager;
