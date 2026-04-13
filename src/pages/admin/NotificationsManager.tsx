import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, Send, X, Megaphone, Sparkles, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import type { Notification } from '@/hooks/useNotifications';

const typeOptions = [
    { value: 'general', label: 'عام', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'update', label: 'تحديث', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'alert', label: 'تنبيه', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { value: 'promo', label: 'عرض', icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const NotificationsManager = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [type, setType] = useState('general');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching notifications:', error);
        } else {
            setNotifications(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        setSending(true);
        const { error } = await supabase.from('notifications').insert({
            title: title.trim(),
            body: body.trim(),
            type,
            is_active: true,
        });

        if (error) {
            alert('خطأ في الإرسال: ' + error.message);
        } else {
            setTitle('');
            setBody('');
            setType('general');
            setShowForm(false);
            fetchAll();
        }
        setSending(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل تريد حذف هذا الإشعار؟')) return;
        await supabase.from('notifications').delete().eq('id', id);
        fetchAll();
    };

    const handleToggle = async (id: string, currentActive: boolean) => {
        await supabase.from('notifications').update({ is_active: !currentActive }).eq('id', id);
        fetchAll();
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Bell className="text-primary" size={28} /> إدارة الإشعارات
                    </h1>
                    <p className="text-slate-500 mt-1">أرسل إشعارات فورية تظهر لجميع زوار الموقع عند الجرس 🔔</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAll} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600" title="تحديث">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
                    >
                        <Plus size={18} /> إشعار جديد
                    </button>
                </div>
            </div>

            {/* Send Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Send size={20} className="text-primary" /> إرسال إشعار جديد
                                </h2>
                                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSend} className="p-6 space-y-5">
                                {/* Type Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">نوع الإشعار</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {typeOptions.map(opt => {
                                            const Icon = opt.icon;
                                            return (
                                                <button
                                                    type="button"
                                                    key={opt.value}
                                                    onClick={() => setType(opt.value)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                                        type === opt.value
                                                            ? `${opt.bg} ${opt.color} border-current shadow-sm`
                                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <Icon size={16} /> {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">عنوان الإشعار</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="مثال: تحديث جديد متاح! 🎉"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Body */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-2">نص الإشعار</label>
                                    <textarea
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                        placeholder="اكتب رسالة الإشعار التي سيقرأها المستخدم..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        required
                                    />
                                </div>

                                {/* Preview */}
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 mb-2">معاينة الإشعار:</p>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeOptions.find(t => t.value === type)?.bg} ${typeOptions.find(t => t.value === type)?.color}`}>
                                            {(() => { const Icon = typeOptions.find(t => t.value === type)?.icon || Info; return <Icon size={20} />; })()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{title || 'عنوان الإشعار'}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{body || 'نص الإشعار...'}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending || !title.trim() || !body.trim()}
                                    className="w-full py-3 bg-gradient-to-l from-primary to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <RefreshCw size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} /> إرسال الإشعار
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Notifications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-400">
                        <RefreshCw size={24} className="animate-spin ml-3" /> جاري التحميل...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Bell size={48} className="mb-4 opacity-30" />
                        <p className="font-bold text-lg">لا توجد إشعارات بعد</p>
                        <p className="text-sm mt-1">اضغط "إشعار جديد" لإرسال أول إشعار لزوار الموقع</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((n) => {
                            const config = typeOptions.find(t => t.value === n.type) || typeOptions[0];
                            const Icon = config.icon;
                            return (
                                <div key={n.id} className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${!n.is_active ? 'opacity-50' : ''}`}>
                                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-800 truncate">{n.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{n.body}</p>
                                    </div>
                                    <div className="text-xs text-slate-400 shrink-0 hidden sm:block">
                                        {new Date(n.created_at).toLocaleDateString('ar-IQ')}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleToggle(n.id, n.is_active)}
                                            className={`text-xs px-3 py-1 rounded-full font-bold ${n.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}
                                        >
                                            {n.is_active ? 'مفعل' : 'معطل'}
                                        </button>
                                        <button onClick={() => handleDelete(n.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsManager;
