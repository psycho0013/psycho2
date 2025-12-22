import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Calendar, Droplet, Ruler, Weight, Save, Clock, FileText, ChevronDown, AlertTriangle, Stethoscope } from 'lucide-react';
import { profileService, type Profile as UserProfile, type MedicalHistory } from '../services/profileService';
import { authService } from '../services/authService';
import { cn } from '@/lib/utils'; // Assuming you have this utility

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [history, setHistory] = useState<MedicalHistory[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        gender: '',
        date_of_birth: '',
        blood_type: '',
        height: '',
        weight: '',
        chronic_conditions: [] as string[] // Todo: Implement tag input
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const user = await authService.getCurrentUser();
            if (!user) return; // Should redirect to login

            const { data: profileData } = await profileService.getProfile(user.id);
            const { data: historyData } = await profileService.getMedicalHistory(user.id);

            if (profileData) {
                setProfile(profileData);
                setFormData({
                    full_name: profileData.full_name || '',
                    gender: profileData.gender || '',
                    date_of_birth: profileData.date_of_birth || '',
                    blood_type: profileData.blood_type || '',
                    height: profileData.height?.toString() || '',
                    weight: profileData.weight?.toString() || '',
                    chronic_conditions: profileData.chronic_conditions || []
                });
            }
            if (historyData) setHistory(historyData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            // Get user ID from auth service directly
            const user = await authService.getCurrentUser();
            if (!user) {
                console.error('❌ No user logged in!');
                setMessage({ type: 'error', text: 'يجب تسجيل الدخول أولاً' });
                return;
            }

            console.log('💾 Saving profile for user:', user.id);

            const updates: Partial<UserProfile> = {
                full_name: formData.full_name,
                gender: formData.gender as any,
                date_of_birth: formData.date_of_birth || null,
                blood_type: formData.blood_type as any || null,
                height: parseFloat(formData.height) || null,
                weight: parseFloat(formData.weight) || null,
            };

            console.log('📝 Updates:', updates);

            const { data, error } = await profileService.updateProfile(user.id, updates);

            if (error) {
                console.error('❌ Supabase error:', error);
                throw error;
            }

            console.log('✅ Profile saved successfully:', data);
            setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error('❌ Save failed:', err);
            setMessage({ type: 'error', text: `حدث خطأ: ${err?.message || 'غير معروف'}` });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8" dir="rtl">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-l from-primary/10 to-transparent"></div>
                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/20">
                            {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="text-center md:text-right flex-1">
                            <h1 className="text-2xl font-bold text-slate-800">{profile?.full_name || 'مستخدم جديد'}</h1>
                            <p className="text-slate-500 mt-1">عضو منذ {new Date(profile?.created_at || Date.now()).toLocaleDateString('ar-EG')}</p>

                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                    <Activity size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-slate-600">
                                        {profile?.gender === 'Male' ? 'ذكر' : profile?.gender === 'Female' ? 'أنثى' : 'غير محدد'}
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-slate-600">
                                        {profile?.date_of_birth ? new Date(profile.date_of_birth).getFullYear() : '----'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-right",
                                activeTab === 'details'
                                    ? "bg-white text-primary shadow-sm border border-primary/10"
                                    : "text-slate-500 hover:bg-white hover:text-slate-700"
                            )}
                        >
                            <User size={18} />
                            البيانات الشخصية
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-right",
                                activeTab === 'history'
                                    ? "bg-white text-primary shadow-sm border border-primary/10"
                                    : "text-slate-500 hover:bg-white hover:text-slate-700"
                            )}
                        >
                            <Clock size={18} />
                            السجل الطبي
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-9">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'details' ? (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Save size={20} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg text-slate-800">تحديث البيانات</h2>
                                            <p className="text-xs text-slate-500">هذه البيانات تساعدنا في تقديم تشخيص أدق</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">الاسم الكامل</label>
                                            <div className="relative">
                                                <User size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={formData.full_name}
                                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">تاريخ الميلاد</label>
                                            <div className="relative">
                                                <Calendar size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="date"
                                                    value={formData.date_of_birth}
                                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">الجنس</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: 'Male' })}
                                                    className={cn(
                                                        "py-3 px-4 rounded-xl border transition-all text-sm font-medium",
                                                        formData.gender === 'Male' ? "bg-primary/10 border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    )}
                                                >
                                                    ذكر
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: 'Female' })}
                                                    className={cn(
                                                        "py-3 px-4 rounded-xl border transition-all text-sm font-medium",
                                                        formData.gender === 'Female' ? "bg-primary/10 border-primary text-primary" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    )}
                                                >
                                                    أنثى
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">فصيلة الدم</label>
                                            <div className="relative">
                                                <Droplet size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                                                <select
                                                    value={formData.blood_type}
                                                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                                >
                                                    <option value="">غير محدد</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">الطول (سم)</label>
                                            <div className="relative">
                                                <Ruler size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    placeholder="170"
                                                    value={formData.height}
                                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">الوزن (كجم)</label>
                                            <div className="relative">
                                                <Weight size={18} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    placeholder="70"
                                                    value={formData.weight}
                                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                            {message && (
                                                <div className={cn("text-sm px-3 py-1 rounded-lg", message.type === 'success' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50")}>
                                                    {message.text}
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 mr-auto"
                                            >
                                                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                                {!saving && <Save size={18} />}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.length === 0 ? (
                                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-4">
                                                <FileText size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">لا يوجد سجل طبي</h3>
                                            <p className="text-slate-500 mt-2">لم تقم بإجراء أي تشخيص حتى الآن.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {history.map((record, index) => (
                                                <MedicalHistoryCard key={record.id} record={record} index={index} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function MedicalHistoryCard({ record, index }: { record: MedicalHistory; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Extract data securely
    const result = record.diagnosis_result || {};
    const diseaseName = result.diseaseName || 'تشخيص غير محدد';
    const confidence = result.confidence || 0;
    const isEmergency = result.isEmergency || false;
    const date = new Date(record.created_at);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                isExpanded ? "bg-white shadow-lg ring-1 ring-primary/5" : "bg-white hover:shadow-md border-slate-100"
            )}
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors",
                        isEmergency
                            ? "bg-red-50 text-red-500"
                            : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"
                    )}>
                        {isEmergency ? <AlertTriangle size={24} /> : <Stethoscope size={24} />}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-slate-800">{diseaseName}</h3>
                            {isEmergency && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full border border-red-200">
                                    حالة طارئة
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {date.toLocaleDateString('ar-EG')}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Confidence Score Badge */}
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-slate-400">الدقة</span>
                            <span className={cn(
                                "font-bold text-sm",
                                confidence > 80 ? "text-emerald-600" : "text-amber-600"
                            )}>
                                %{Math.round(confidence)}
                            </span>
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full", confidence > 80 ? "bg-emerald-500" : "bg-amber-500")}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>

                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        isExpanded ? "bg-slate-100 text-slate-600 rotate-180" : "text-slate-400 group-hover:bg-slate-50"
                    )}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50"
                    >
                        <div className="p-5 bg-slate-50/50 space-y-4">
                            {/* Symptoms */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الأعراض المسجلة</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(record.symptoms || []).map((s: any, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 shadow-sm">
                                            {/* Handle both object and string symptoms if needed */}
                                            {s.id || 'عرض'}
                                            {s.severity && <span className="mr-1 text-xs opacity-50">({s.severity})</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Logic Notes */}
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex gap-3">
                                <FileText className="text-blue-400 shrink-0" size={18} />
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm mb-1">ملاحظات النظام</h4>
                                    <p className="text-sm text-blue-700/80 leading-relaxed">
                                        {record.notes}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Profile;
