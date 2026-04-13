import { motion } from 'framer-motion';
import { Lock, Shield, EyeOff, Server, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden" dir="rtl">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-6">سياسة الخصوصية وأمان البيانات</h1>
                    <p className="text-slate-500 text-lg">آخر تحديث: {new Date().toLocaleDateString('ar-IQ')}</p>
                </motion.div>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    
                    {/* Intro */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <p className="text-lg">
                            نقدر في <strong>SmartTashkhees</strong> مخاوفكم واهتمامكم بشأن خصوصية بياناتكم الطبية. تمت صياغة هذه السياسة لمساعدتكم في فهم طبيعة البيانات التي نقوم بتجميعها عند زيارتكم لموقعنا أو استخدامكم لخدمات التشخيص وكيفية تعاملنا مع هذه البيانات.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <div className="glass-panel p-8 bg-white/60 hover:-translate-y-1 transition-transform">
                            <Shield size={28} className="text-emerald-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-3">لا نبيع بياناتك مطلقاً</h3>
                            <p className="text-slate-600 text-sm">
                                بياناتك الصحية تخصك وحدك، نحن لا نبيع التفاصيل والحالات الطبية لطرف ثالث بأي شكلٍ من الأشكال من أجل ربح مادي أو إعلاني.
                            </p>
                        </div>
                        <div className="glass-panel p-8 bg-white/60 hover:-translate-y-1 transition-transform">
                            <EyeOff size={28} className="text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-3">حفظ الهوية السرية</h3>
                            <p className="text-slate-600 text-sm">
                                الذكاء الاصطناعي يعالج الأعراض المدخلة دون الحاجة لربطها المباشر بطاقتك الشخصية. المحادثات والفحوصات تبقى محفوظة للتجربة المستقبلية بآمان.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Server size={28} className="text-primary" />
                            <h2 className="text-2xl font-bold text-slate-800">جمع البيانات واستخدامها</h2>
                        </div>
                        <p className="mb-4">
                            عند استخدام تطبيقنا، قد نجمع أنواعاً معينة من المعلومات لتحسين أداء التشخيص:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                                <span><strong>البيانات المدخلة طوعاً:</strong> تشمل الأعراض، الأوصاف، والتقارير الطبية التي تقوم برفعها أو كتابتها بنفسك.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                                <span><strong>بيانات الأداء المجهولة:</strong> تشمل تحليلات الخطأ والصواب للاستعلامات الطبية من أجل تحسين ذكاء النظام.</span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">التشفير والحماية</h2>
                        <p className="text-slate-600">
                            يتم تنفيذ كافة عمليات الاتصال بين متصفحك وسيرفراتنا عبر اتصال مشفر (HTTPS/SSL). كما نقوم بإخفاء إشارات التتبع (Tracking IDs) للحد من استخدام البيانات خارج نطاق الخدمة المرجوة التي يطلبها المريض.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
                        <p className="text-slate-600">
                            نحن نستخدم الكوكيز فقط للحفاظ على استقرار جلستك (Session) ولحفظ المعلومات التفضيلية المؤقتة التي تدخلها بهدف عدم سؤالك عنها بشكل متكرر. يمكنك تعطيل الكوكيز عبر متصفحك ولكن قد تتأثر تجربة الاستخدام.
                        </p>
                    </motion.div>

                </div>

                <div className="mt-16 text-center text-sm text-slate-500">
                    لمزيد من الاستفسارات بشأن الخصوصية، يرجى مراجعة <Link to="/contact" className="text-primary hover:underline">صفحة التواصل</Link>.
                    <br /><br />
                    <Link to="/" className="text-primary hover:underline hover:text-blue-700 font-bold transition-colors">العودة إلى الصفحة الرئيسية</Link>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
