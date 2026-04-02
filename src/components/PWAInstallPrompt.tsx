import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, Plus, Bell, Smartphone, CheckCircle2 } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * واجهة تنصيب التطبيق — PWA Install Prompt
 * تظهر للمستخدم عند فتح الموقع من الموبايل لتعليمه كيف ينصّب التطبيق
 * في وضع التطبيق (standalone): تطلع نافذة تفعيل الإشعارات كل مرة
 * لحد ما المستخدم يوافق
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [step, setStep] = useState<'main' | 'ios_guide' | 'notif_prompt' | 'notif_done'>('main');

    useEffect(() => {
        const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent);
        setIsIOS(isIOSDevice);

        const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent);
        if (!isMobile) return;

        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);

        // ══════════════════════════════════════════════════════
        // وضع التطبيق المثبت (Standalone) — دائماً نعرض طلب الإشعارات
        // لحد ما المستخدم يوافق، بدون أي cooldown
        // ══════════════════════════════════════════════════════
        if (standalone) {
            // إذا الإشعارات مفعلة مسبقاً = ما نعرض شيء
            if ('Notification' in window && Notification.permission === 'granted') {
                return; // ✅ مفعلة — ما نعرض النافذة
            }
            // غير مفعلة = نعرض نافذة الإشعارات كل مرة
            setStep('notif_prompt');
            setTimeout(() => setShowPrompt(true), 1500);
            return;
        }

        // ══════════════════════════════════════════════════════
        // وضع المتصفح العادي — نعرض نافذة التنصيب مع cooldown 3 أيام
        // ══════════════════════════════════════════════════════
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        const isDismissedRecently = dismissed && (Date.now() - parseInt(dismissed) < 3 * 24 * 60 * 60 * 1000);
        if (isDismissedRecently) return;

        // Android: Listen for beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setShowPrompt(true), 2000);
        };
        window.addEventListener('beforeinstallprompt', handler);

        // iOS: Show guide after delay
        if (isIOSDevice) {
            setTimeout(() => setShowPrompt(true), 2000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                // بعد التنصيب — نطلب الإشعارات
                if ('Notification' in window && Notification.permission !== 'granted') {
                    setStep('notif_prompt');
                } else {
                    setShowPrompt(false);
                }
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // الـ cooldown بس لنافذة التنصيب بالمتصفح، مو للإشعارات
        if (!isStandalone) {
            localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        }
        // في وضع Standalone ما نخزن شي — حتى تطلع المرة الجاية
    };

    const handleEnableNotifications = async () => {
        try {
            const OneSignal = (await import('react-onesignal')).default;

            // ═══════════════════════════════════════════
            // الحل النهائي: نستخدم OneSignal.Notifications.requestPermission()
            // لكل الأجهزة (iOS + Android) — هذي الطريقة الوحيدة اللي
            // تطلب الصلاحية وتسجّل الجهاز بخوادم OneSignal بنفس الوقت
            // ═══════════════════════════════════════════
            
            // طلب الصلاحية عن طريق OneSignal (يشتغل على iOS و Android)
            const granted = await OneSignal.Notifications.requestPermission();

            if (granted) {
                // تسجيل الجهاز بالإشعارات
                try {
                    await OneSignal.User.PushSubscription.optIn();
                } catch (e) {
                    console.log('OneSignal optIn:', e);
                }
                setStep('notif_done');
                setTimeout(() => setShowPrompt(false), 2500);
            } else {
                // رفض — نسكّر النافذة بس ترجع المرة الجاية
                setShowPrompt(false);
            }
        } catch (err) {
            console.error('Notification permission error:', err);
            // Fallback: نجرب الطريقة المباشرة إذا OneSignal فشل كلياً
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setStep('notif_done');
                    setTimeout(() => setShowPrompt(false), 2500);
                } else {
                    setShowPrompt(false);
                }
            } catch {
                setShowPrompt(false);
            }
        }
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        onClick={handleDismiss}
                    />

                    {/* Prompt */}
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[110] pb-safe overflow-hidden shadow-2xl"
                        dir="rtl"
                    >
                        {/* Handle */}
                        <div className="w-full flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-slate-200 rounded-full" />
                        </div>

                        <div className="p-6">
                            {/* Close button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full text-slate-400"
                            >
                                <X size={18} />
                            </button>

                            {/* === MAIN STEP (Install Prompt) === */}
                            {step === 'main' && (
                                <div className="space-y-5">
                                    {/* App Icon & Name */}
                                    <div className="flex items-center gap-4 mb-2">
                                        <img src="/po.png" alt="SmartTashkhees" className="w-16 h-16 rounded-2xl shadow-lg" />
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">SmartTashkhees</h3>
                                            <p className="text-sm text-slate-500">تشخيص طبي ذكي</p>
                                        </div>
                                    </div>

                                    {/* Benefits */}
                                    <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 p-4 rounded-2xl border border-cyan-100">
                                        <p className="text-sm font-bold text-cyan-700 mb-3">📲 نصّب التطبيق واستمتع بـ:</p>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-center gap-2">
                                                <Smartphone size={16} className="text-cyan-500 shrink-0" />
                                                وصول سريع من الشاشة الرئيسية
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Bell size={16} className="text-cyan-500 shrink-0" />
                                                إشعارات صحية مهمة
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Download size={16} className="text-cyan-500 shrink-0" />
                                                يعمل بدون إنترنت (وضع أوفلاين)
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    {isIOS ? (
                                        <button
                                            onClick={() => setStep('ios_guide')}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                                        >
                                            <Download size={20} />
                                            كيف أنصّب التطبيق؟
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleInstall}
                                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                                        >
                                            <Download size={20} />
                                            تنصيب التطبيق الآن
                                        </button>
                                    )}

                                    <button
                                        onClick={handleDismiss}
                                        className="w-full py-2 text-slate-400 text-sm font-medium"
                                    >
                                        لاحقاً
                                    </button>
                                </div>
                            )}

                            {/* === iOS GUIDE === */}
                            {step === 'ios_guide' && (
                                <div className="space-y-5">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">كيفية التنصيب على iPhone</h3>
                                    <p className="text-sm text-slate-500 mb-4">اتبع هذه الخطوات البسيطة:</p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
                                            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold shrink-0">1</div>
                                            <div>
                                                <p className="font-bold text-slate-700 mb-1">اضغط على زر المشاركة</p>
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <span>اضغط على أيقونة</span>
                                                    <Share size={16} className="text-blue-500" />
                                                    <span>أسفل المتصفح</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
                                            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold shrink-0">2</div>
                                            <div>
                                                <p className="font-bold text-slate-700 mb-1">اختر "إضافة إلى الشاشة الرئيسية"</p>
                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                    <span>مرّر للأسفل واضغط</span>
                                                    <Plus size={16} className="text-slate-600" />
                                                    <span>Add to Home Screen</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl">
                                            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold shrink-0">3</div>
                                            <div>
                                                <p className="font-bold text-slate-700 mb-1">اضغط "إضافة" (Add)</p>
                                                <p className="text-sm text-slate-500">التطبيق راح يظهر على شاشتك الرئيسية!</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep('main')}
                                        className="w-full py-3 bg-slate-100 text-slate-600 font-medium rounded-2xl"
                                    >
                                        رجوع
                                    </button>
                                </div>
                            )}

                            {/* === NOTIFICATION PROMPT === */}
                            {step === 'notif_prompt' && (
                                <div className="text-center py-4 space-y-5">
                                    <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Bell size={40} className="text-cyan-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">فعّل الإشعارات 🔔</h3>
                                    <p className="text-sm text-slate-500 mb-4 text-center">
                                        فعّل الإشعارات حتى تصلك تنبيهات الأدوية والأخبار الصحية المهمة مباشرة على جهازك.
                                    </p>
                                    
                                    <button
                                        onClick={handleEnableNotifications}
                                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform"
                                    >
                                        تفعيل الإشعارات
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="w-full py-2 text-slate-400 text-sm font-medium"
                                    >
                                        لاحقاً
                                    </button>
                                </div>
                            )}

                            {/* === NOTIFICATION DONE === */}
                            {step === 'notif_done' && (
                                <div className="text-center py-6 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={32} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">تم تفعيل الإشعارات! ✅</h3>
                                    <p className="text-slate-500 text-sm">ستصلك إشعارات صحية مهمة وتحديثات</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallPrompt;
