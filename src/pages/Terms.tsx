import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden" dir="rtl">
            {/* Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FileText size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-6">شروط الاستخدام وإخلاء المسؤولية</h1>
                    <p className="text-slate-500 text-lg">آخر تحديث: {new Date().toLocaleDateString('ar-IQ')}</p>
                </motion.div>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    
                    {/* Medical Disclaimer */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-8 md:p-10 border-red-100 bg-red-50/50 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-red-400 to-red-600"></div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-3 bg-red-100 text-red-600 rounded-xl">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-red-900 mb-4">إخلاء مسؤولية طبي صارم</h2>
                                <p className="mb-4">
                                    تطبيق <strong>SmartTashkhees</strong> هو وسيلة <strong>استشارية فقط</strong> مبنية على نماذج الذكاء الاصطناعي. بجميع الأحوال:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-red-500" /> لا يشكل المنصة بديلاً عن الطبيب البشري أو الفحص السريري.</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-red-500" /> النتائج الظاهرة هي "إرشادية" وتتطلب مصادقة طبيب مختص قبل تناول أي دواء.</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-red-500" /> لا تستخدم التطبيق في الحالات <strong>الطارئة المهددة للحياة</strong>. اتصل بالإسعاف أو توجه لأقرب مستشفى فوراً.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Usage Terms */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Scale size={28} className="text-primary" />
                            <h2 className="text-2xl font-bold text-slate-800">1. قبول الشروط</h2>
                        </div>
                        <p className="mb-4">
                            بدخولك أو استخدامك لتطبيق SmartTashkhees ("التطبيق"، "المنصة")، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجب عليك استخدام هذا التطبيق.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck size={28} className="text-emerald-500" />
                            <h2 className="text-2xl font-bold text-slate-800">2. الاستخدام المقبول والمحظورات</h2>
                        </div>
                        <p className="mb-4">أنت توافق على استخدام الخدمات بحسن نية ولأغراض صحية ومعرفية، ويُحظر صراحة:</p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6 mr-4">
                            <li>مشاركة أدويتك المعطاة هنا مع أطراف أخرى.</li>
                            <li>الاعتماد بشكل تام على توصيات الذكاء الاصطناعي دون رقابة طبية.</li>
                            <li>التلاعب بنظام المنصة أو إغراقها باستعلامات كاذبة وغير منطقية.</li>
                        </ul>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">3. دقة التكنولوجيا</h2>
                        <p className="text-slate-600">
                            على الرغم من خضوع المودل الخاص بنا لتدريبات على بيانات واقعية وحديثة، فإن الذكاء الاصطناعي عرضة لما يسمى "بالهلوسات" أو الاستنتاجات الخاطئة أحياناً، نحن لا نضمن الدقة بنسبة 100% بأي شكل من الأشكال، ولذا نؤكد مجدداً على أن منصتنا مجرد طرف مُساعد.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-8 md:p-10 bg-white/60"
                    >
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">4. التعديل على الشروط</h2>
                        <p className="text-slate-600">
                            يحتفظ SmartTashkhees بالحق في تعديل هذه الشروط في أي وقت ودون إشعار مسبق. من مسؤوليتك مراجعة هذه الصفحة بشكل دوري لتكون على علم بأي تعديلات تطرأ عليها. استخدامك المستمر للمنصة يعني التزامك بالشروط المحدثة.
                        </p>
                    </motion.div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/" className="text-primary hover:underline hover:text-blue-700 font-bold transition-colors">العودة إلى الصفحة الرئيسية</Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
