import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, ExternalLink, Settings, BookOpen, Pill, Building2, Database, Activity, MessageSquare, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session if we had one
        navigate('/');
    };

    const navItems = [
        { path: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
        { path: '/admin/content', label: 'إدارة المحتوى', icon: FileText },
        { path: '/admin/diseases', label: 'إدارة الأمراض', icon: BookOpen },
        { path: '/admin/treatments', label: 'إدارة العلاجات', icon: Pill },
        { path: '/admin/symptoms', label: 'إدارة الأعراض', icon: Activity },
        { path: '/admin/diagnosis-settings', label: 'إعدادات التشخيص', icon: Brain },
        { path: '/admin/directory', label: 'إدارة الدليل', icon: Building2 },
        { path: '/admin/messages', label: 'الرسائل', icon: MessageSquare },
        { path: '/admin/data', label: 'إدارة البيانات', icon: Database },
        { path: '/admin/settings', label: 'الإعدادات', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-l border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <span className="text-xl font-bold text-slate-800">لوحة <span className="text-primary">الإدارة</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:mr-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 flex items-center justify-between">
                    <h1 className="font-bold text-slate-800">نظام إدارة المحتوى</h1>

                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                        <span>زيارة الموقع</span>
                        <ExternalLink size={16} />
                    </a>
                </header>

                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
