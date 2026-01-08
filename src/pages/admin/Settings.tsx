import { useState } from 'react';
import { KeyManager } from '../../components/Security/KeyManager';
import { Save, Key, Trash2, RotateCcw, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, AlertCircle, CheckCircle, Shield, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

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
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'general' | 'account' | 'system' | 'security'>('general');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    // General Settings
    const [settings, setSettings] = useState<SiteSettings>(() => {
        const stored = localStorage.getItem('phy_site_settings');
        return stored ? JSON.parse(stored) : {
            siteName: 'صيدلية SmartTashkhees',
            siteDescription: 'منصة رعاية صحية ذكية مدعومة بالذكاء الاصطناعي',
            email: 'contact@phy.ai',
            phone: '+964 770 000 0000',
            address: 'بغداد، العراق',
            facebook: 'https://facebook.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com'
        };
    });

    // Account Settings - Vault Password
    const [vaultCurrentPassword, setVaultCurrentPassword] = useState('');
    const [vaultNewPassword, setVaultNewPassword] = useState('');
    const [vaultConfirmPassword, setVaultConfirmPassword] = useState('');
    const [savingVault, setSavingVault] = useState(false);

    const handleSaveSettings = () => {
        localStorage.setItem('phy_site_settings', JSON.stringify(settings));
        setStatus({ type: 'success', message: 'تم حفظ الإعدادات بنجاح!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    };

    // تغيير باسورد الخزنة (Vault Password)
    const handleChangeVaultPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingVault(true);

        // جلب الباسورد الحالي من Supabase
        const { data: configData } = await supabase
            .from('app_config')
            .select('value')
            .eq('key', 'admin_vault_password')
            .single();

        const currentStoredHash = configData?.value || 'YWRtaW4xMjM0NTY3OA=='; // default: admin12345678
        const inputHash = btoa(vaultCurrentPassword);

        if (inputHash !== currentStoredHash) {
            toast.error('كلمة المرور الحالية غير صحيحة');
            setSavingVault(false);
            return;
        }

        if (vaultNewPassword.length < 8) {
            toast.error('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل');
            setSavingVault(false);
            return;
        }

        if (vaultNewPassword !== vaultConfirmPassword) {
            toast.error('كلمات المرور غير متطابقة');
            setSavingVault(false);
            return;
        }

        // حفظ الباسورد الجديد في Supabase
        const newHash = btoa(vaultNewPassword);
        const { error } = await supabase
            .from('app_config')
            .upsert({ key: 'admin_vault_password', value: newHash }, { onConflict: 'key' });

        if (error) {
            toast.error('حدث خطأ أثناء حفظ كلمة المرور');
            console.error(error);
        } else {
            toast.success('تم تغيير باسورد الخزنة بنجاح!');
            setVaultCurrentPassword('');
            setVaultNewPassword('');
            setVaultConfirmPassword('');
        }
        setSavingVault(false);
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
        { id: 'security', label: 'الأمان والتشفير', icon: Shield },
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
                <div className="space-y-6">
                    {/* Vault Password Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 rounded-xl">
                                <Lock size={20} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">باسورد الخزنة (Vault Password)</h3>
                                <p className="text-sm text-slate-500">الواجهة الثانية للحماية - يُستخدم للدخول للوحة الإدارة</p>
                            </div>
                        </div>
                        <form onSubmit={handleChangeVaultPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الحالية</label>
                                <input
                                    type="password"
                                    value={vaultCurrentPassword}
                                    onChange={(e) => setVaultCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    placeholder="الباسورد الافتراضي: admin12345678"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    value={vaultNewPassword}
                                    onChange={(e) => setVaultNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-slate-500 mt-1">يجب أن تكون 8 أحرف على الأقل</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    value={vaultConfirmPassword}
                                    onChange={(e) => setVaultConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={savingVault}
                                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Lock size={20} />
                                {savingVault ? 'جاري الحفظ...' : 'تغيير باسورد الخزنة'}
                            </button>
                        </form>
                    </div>

                    {/* Info Box */}
                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-amber-800">
                                <p className="font-bold mb-1">ملاحظة مهمة:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>باسورد الخزنة:</strong> يُستخدم للدخول للوحة الإدارة (الواجهة الثانية)</li>
                                    <li>الباسورد محفوظ بأمان في Supabase</li>
                                    <li>الباسورد الافتراضي: <code className="bg-amber-100 px-1 rounded">admin12345678</code></li>
                                </ul>
                            </div>
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

            {/* Security Settings */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <KeyManager />
                </div>
            )}
        </div>
    );
};

export default Settings;
