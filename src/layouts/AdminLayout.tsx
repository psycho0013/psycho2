import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, LogOut, ExternalLink, Settings,
    BookOpen, Pill, Building2, Database, Activity, MessageSquare,
    Brain, Smile, Stethoscope, UserCheck, Home, HeartPulse, Menu, X, Bell, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

// تعريف الأقسام
const navSections = [
    {
        id: 'main',
        title: 'الرئيسية',
        items: [
            { path: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
            { path: '/admin/content', label: 'إدارة المحتوى', icon: FileText },
        ]
    },
    {
        id: 'general-diagnosis',
        title: 'التشخيص العام',
        items: [
            { path: '/admin/diseases', label: 'الأمراض', icon: BookOpen },
            { path: '/admin/treatments', label: 'العلاجات', icon: Pill },
            { path: '/admin/symptoms', label: 'الأعراض', icon: Activity },
            { path: '/admin/diagnosis-settings', label: 'إعدادات التشخيص', icon: Brain },
        ]
    },
    {
        id: 'dental',
        title: 'تشخيص الأسنان',
        items: [
            { path: '/admin/dental-symptoms', label: 'أعراض الأسنان', icon: Smile },
            { path: '/admin/dental-problems', label: 'مشاكل الأسنان', icon: Stethoscope },
            { path: '/admin/dentists', label: 'الأطباء', icon: UserCheck },
        ]
    },
    {
        id: 'system',
        title: 'النظام',
        items: [
            { path: '/admin/directory', label: 'الدليل الطبي', icon: Building2 },
            { path: '/admin/messages', label: 'الرسائل', icon: MessageSquare },
            { path: '/admin/notifications', label: 'الإشعارات', icon: Bell },
            { path: '/admin/feedback', label: 'التقييمات', icon: Star },
            { path: '/admin/data', label: 'البيانات', icon: Database },
            { path: '/admin/settings', label: 'الإعدادات', icon: Settings },
        ]
    },
];

// Sidebar Content Component
function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        onItemClick?.();
    };

    return (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <HeartPulse size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">لوحة <span className="text-primary">الإدارة</span></span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {navSections.map((section, sectionIndex) => (
                    <div key={section.id} className={sectionIndex > 0 ? 'mt-4' : ''}>
                        <div className="px-6 mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {section.title}
                            </span>
                        </div>

                        <div className="px-3 space-y-1">
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={onItemClick}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 space-y-2 shrink-0">
                <a
                    href="/"
                    target="_blank"
                    onClick={onItemClick}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium text-sm"
                >
                    <Home size={18} />
                    <span>زيارة الموقع</span>
                    <ExternalLink size={14} className="mr-auto" />
                </a>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium text-sm"
                >
                    <LogOut size={18} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </>
    );
}

const AdminLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col lg:hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute left-4 top-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors z-10"
                            >
                                <X size={20} className="text-slate-600" />
                            </button>

                            <SidebarContent onItemClick={() => setMobileMenuOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 lg:mr-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 lg:px-6 flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors lg:hidden"
                    >
                        <Menu size={22} className="text-slate-700" />
                    </button>

                    <h1 className="font-bold text-slate-800 text-sm">نظام إدارة المحتوى</h1>
                </header>

                <div className="p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
