import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Megaphone, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { useNotifications, type Notification } from '@/hooks/useNotifications';

const typeConfig: Record<string, { icon: typeof Info; color: string; bg: string; label: string }> = {
    general: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', label: 'عام' },
    update: { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'تحديث' },
    alert: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'تنبيه' },
    promo: { icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50', label: 'عرض' },
};

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    return new Date(dateStr).toLocaleDateString('ar-IQ');
}

interface NotificationBellProps {
    className?: string;
    iconSize?: number;
}

const NotificationBell = ({ className = '', iconSize = 22 }: NotificationBellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className={`relative ${className}`} ref={panelRef}>
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-full transition-all duration-200 hover:bg-slate-100 active:scale-90"
                title="الإشعارات"
            >
                <Bell size={iconSize} className={unreadCount > 0 ? 'text-primary' : 'text-slate-400'} />
                
                {/* Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-red-500/40 px-1"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-[320px] sm:w-[360px] max-h-[420px] bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-100 overflow-hidden z-[100] flex flex-col"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Bell size={18} className="text-primary" /> الإشعارات
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Check size={14} /> قراءة الكل
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <Bell size={40} className="mb-3 opacity-30" />
                                    <p className="font-medium">لا توجد إشعارات بعد</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onRead={markOneRead}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
    const config = typeConfig[notification.type] || typeConfig.general;
    const Icon = config.icon;

    return (
        <button
            onClick={() => onRead(notification.id)}
            className="w-full text-right px-5 py-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors flex gap-3 items-start group"
        >
            <div className={`shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center mt-0.5`}>
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm text-slate-800 truncate">{notification.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} font-bold shrink-0`}>
                        {config.label}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notification.body}</p>
                <span className="text-[10px] text-slate-400 mt-1.5 block">{timeAgo(notification.created_at)}</span>
            </div>
        </button>
    );
}

export default NotificationBell;
