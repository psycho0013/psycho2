import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import DataManager, { type SiteContent } from '@/services/dataManager';

const Contact = () => {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        loadContent();

        const handleUpdate = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        window.addEventListener('content-updated', handleUpdate);
        return () => window.removeEventListener('content-updated', handleUpdate);
    }, []);

    if (!content) return null;

    const { header, info } = content.contact;

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">{header.title}</h1>
                    <p className="text-slate-500">{header.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{info.email.title}</h3>
                            <p className="text-slate-500 text-sm">{info.email.value}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{info.phone.title}</h3>
                            <p className="text-slate-500 text-sm">{info.phone.value}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{info.location.title}</h3>
                            <p className="text-slate-500 text-sm">{info.location.value}</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">الاسم</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="اسمك" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="example@mail.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">الموضوع</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="كيف يمكننا مساعدتك؟" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">الرسالة</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="اكتب رسالتك هنا..." />
                            </div>

                            <button type="button" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                                <Send size={20} />
                                إرسال الرسالة
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
