import { motion } from 'framer-motion';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MedicalDirectory = () => {
    return (
        <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg mx-auto"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20 rotate-12">
                    <Timer size={48} className="text-white -rotate-12" />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">قريباً</h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    نعمل حالياً على تجهيز الدليل الطبي الشامل ليكون مرجعكم الأول في الوصول للخدمات الطبية. انتظرونا!
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 border border-slate-200 transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg hover:-translate-y-1"
                >
                    العودة للرئيسية
                    <ArrowRight size={18} />
                </Link>
            </motion.div>
        </div>
    );
};

export default MedicalDirectory;
