import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Clock, Trash2, Check, Eye, X, Search, RefreshCw } from 'lucide-react';
import ContactMessagesManager, { type ContactMessage } from '@/services/contactMessagesManager';

const MessagesManager = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMessages();

        const handleUpdate = () => loadMessages();
        window.addEventListener('messages-updated', handleUpdate);
        return () => window.removeEventListener('messages-updated', handleUpdate);
    }, []);

    const loadMessages = async () => {
        setLoading(true);
        const data = await ContactMessagesManager.getMessages();
        setMessages(data);
        setLoading(false);
    };

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        await ContactMessagesManager.markAsRead(id, isRead);
    };

    const handleDelete = async (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
            await ContactMessagesManager.deleteMessage(id);
            setSelectedMessage(null);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const unreadCount = messages.filter(m => !m.is_read).length;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ar-IQ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <MessageSquare className="text-primary" />
                        الرسائل الواردة
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">
                                {unreadCount} جديد
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 mt-1">إدارة رسائل التواصل من الزوار</p>
                </div>
                <button
                    onClick={loadMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    تحديث
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="البحث في الرسائل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="animate-spin text-primary" size={32} />
                </div>
            ) : filteredMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">لا توجد رسائل</h3>
                    <p className="text-slate-500">
                        {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لم تستلم أي رسائل بعد'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!msg.is_read ? 'bg-blue-50/50' : ''}`}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (!msg.is_read) handleMarkAsRead(msg.id, true);
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {!msg.is_read && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                            <h3 className="font-bold text-slate-800 truncate">{msg.name}</h3>
                                            <span className="text-slate-400 text-sm">•</span>
                                            <span className="text-slate-500 text-sm truncate">{msg.email}</span>
                                        </div>
                                        <p className="font-medium text-slate-700 mb-1 truncate">{msg.subject}</p>
                                        <p className="text-slate-500 text-sm truncate">{msg.message}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatDate(msg.created_at)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsRead(msg.id, !msg.is_read);
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors ${msg.is_read ? 'text-slate-400 hover:bg-slate-100' : 'text-blue-500 hover:bg-blue-100'}`}
                                                title={msg.is_read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                                            >
                                                {msg.is_read ? <Eye size={16} /> : <Check size={16} />}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(msg.id);
                                                }}
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                                                title="حذف"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">تفاصيل الرسالة</h2>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-bold text-lg">
                                            {selectedMessage.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{selectedMessage.name}</h3>
                                        <p className="text-slate-500 text-sm flex items-center gap-1">
                                            <Mail size={14} />
                                            {selectedMessage.email}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-500 mb-1 block">الموضوع</label>
                                    <p className="font-bold text-slate-800 text-lg">{selectedMessage.subject}</p>
                                </div>

                                <div>
                                    <label className="text-sm text-slate-500 mb-1 block">الرسالة</label>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <Clock size={14} />
                                    تم الإرسال في {formatDate(selectedMessage.created_at)}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={() => handleDelete(selectedMessage.id)}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                حذف الرسالة
                            </button>
                            <a
                                href={`mailto:${selectedMessage.email}?subject=رد: ${selectedMessage.subject}`}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <Mail size={18} />
                                الرد بالبريد
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesManager;
