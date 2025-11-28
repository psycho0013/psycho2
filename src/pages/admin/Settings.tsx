import { useState } from 'react';
import { Save, Key, Trash2, RotateCcw, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, AlertCircle, CheckCircle } from 'lucide-react';

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    twitter: string;
    instagram: string;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'account' | 'system'>('general');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    // General Settings
    const [settings, setSettings] = useState<SiteSettings>(() => {
        const stored = localStorage.getItem('phy_site_settings');
        return stored ? JSON.parse(stored) : {
            siteName: 'صيدلية فاي',
            siteDescription: 'منصة رعاية صحية ذكية مدعومة بالذكاء الاصطناعي',
            email: 'contact@phy.ai',
            phone: '+964 770 000 0000',
            address: 'بغداد، العراق',
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com'
        };
    });

    // Account Settings
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSaveSettings = () => {
        localStorage.setItem('phy_site_settings', JSON.stringify(settings));
        setStatus({ type: 'success', message: 'تم حفظ الإعدادات بنجاح!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentPassword !== 'admin123') {
            setStatus({ type: 'error', message: 'كلمة المرور الحالية غير صحيحة' });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({ type: 'error', message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'كلمات المرور غير متطابقة' });
            return;
        }

        // In a real app, this would update the password in the backend
        localStorage.setItem('phy_admin_password', newPassword);
        setStatus({ type: 'success', message: 'تم تغيير كلمة المرور بنجاح!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    };

    const handleResetData = () => {
        if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات إلى القيم الافتراضية؟ هذا الإجراء لا يمكن التراجع عنه!')) {
            localStorage.removeItem('phy_site_content');
            localStorage.removeItem('phy_diseases');
            localStorage.removeItem('phy_treatments');
            localStorage.removeItem('phy_directory');
            localStorage.removeItem('phy_site_settings');
            window.dispatchEvent(new Event('content-updated'));
            setStatus({ type: 'success', message: 'تم إعادة تعيين البيانات. سيتم إعادة تحميل الصفحة...' });
            setTimeout(() => window.location.reload(), 2000);
        }
    };

    const handleClearCache = () => {
        if (confirm('هل تريد مسح ذاكرة التخزين المؤقت؟')) {
            localStorage.clear();
            setStatus({ type: 'success', message: 'تم مسح الذاكرة المؤقتة. سيتم إعادة تحميل الصفحة...' });
            setTimeout(() => window.location.reload(), 2000);
        }
    };

    const tabs = [
        { id: 'general', label: 'الإعدادات العامة', icon: Globe },
        { id: 'account', label: 'الحساب', icon: Key },
        { id: 'system', label: 'النظام', icon: RotateCcw },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">الإعدادات</h2>
                <p className="text-slate-500">إدارة إعدادات الموقع والحساب</p>
            </div>

            {status.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {status.message}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 font-medium text-sm transition-all relative flex items-center gap-2 ${activeTab === tab.id
                                ? 'text-primary'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">معلومات الموقع الأساسية</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">اسم الموقع</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">وصف الموقع</label>
                                <textarea
                                    value={settings.siteDescription}
                                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">معلومات الاتصال</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <Mail size={16} />
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <Phone size={16} />
                                    رقم الهاتف
                                </label>
                                <input
                                    type="tel"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <MapPin size={16} />
                                    العنوان
                                </label>
                                <input
                                    type="text"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">روابط وسائل التواصل</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <Facebook size={16} />
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={settings.facebook}
                                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <Twitter size={16} />
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    value={settings.twitter}
                                    onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <Instagram size={16} />
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={settings.instagram}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSaveSettings}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        حفظ الإعدادات
                    </button>
                </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">تغيير كلمة المرور</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الحالية</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-slate-500 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                        >
                            <Key size={20} />
                            تغيير كلمة المرور
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-2">معلومات الحساب</h4>
                        <div className="text-sm text-slate-600 space-y-1">
                            <p>اسم المستخدم: <span className="font-medium">admin</span></p>
                            <p>الدور: <span className="font-medium">مدير النظام</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
                <div className="space-y-6">
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h3 className="font-bold text-amber-900 mb-1">تحذير!</h3>
                                <p className="text-amber-800 text-sm">
                                    الإجراءات التالية خطيرة ولا يمكن التراجع عنها. تأكد من عمل نسخة احتياطية قبل المتابعة.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">إعادة تعيين البيانات</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            إعادة جميع البيانات إلى القيم الافتراضية. سيتم حذف جميع المحتوى والتعديلات.
                        </p>
                        <button
                            onClick={handleResetData}
                            className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} />
                            إعادة تعيين إلى الافتراضي
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">مسح ذاكرة التخزين</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            مسح جميع البيانات المخزنة محلياً. سيتم فقدان جميع التعديلات غير المصدرة.
                        </p>
                        <button
                            onClick={handleClearCache}
                            className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 size={20} />
                            مسح جميع البيانات
                        </button>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">معلومات النظام</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">الإصدار:</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">البيئة:</span>
                                <span className="font-medium">تطوير</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">التخزين المستخدم:</span>
                                <span className="font-medium">LocalStorage</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
