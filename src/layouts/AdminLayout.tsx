import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, LogOut, ExternalLink, Settings,
    BookOpen, Pill, Building2, Database, Activity, MessageSquare,
    Brain, Smile, Stethoscope, UserCheck, Home, HeartPulse
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
            { path: '/admin/data', label: 'البيانات', icon: Database },
            { path: '/admin/settings', label: 'الإعدادات', icon: Settings },
        ]
    },
];

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
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
                            {/* Section Header */}
                            <div className="px-6 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {section.title}
                                </span>
                            </div>

                            {/* Section Items */}
                            <div className="px-3 space-y-1">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
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
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <a
                        href="/"
                        target="_blank"
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:mr-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
                    <h1 className="font-bold text-slate-800 text-sm">نظام إدارة المحتوى</h1>
                </header>

                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

