import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminLoginModal = ({ isOpen, onClose }: AdminLoginModalProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication
        if (username === 'admin' && password === 'admin123') {
            setError('');
            onClose();
            navigate('/admin');
        } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            {/* Decorative Header Background */}
                            <div className="h-32 bg-gradient-to-br from-red-500 to-rose-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/30"
                                >
                                    <Lock className="text-white w-10 h-10" />
                                </motion.div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 text-center space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-800">منطقة الإدارة</h2>
                                    <p className="text-slate-500">يرجى تسجيل الدخول للمتابعة</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4 text-right">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="••••••"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )}

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/30 text-white font-semibold rounded-xl transition-all transform hover:-translate-y-0.5"
                                        >
                                            تسجيل الدخول
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AdminLoginModal;
