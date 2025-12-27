import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Activity,
    BookOpen,
    Info,
    Phone,
    Menu,
    X,
    ChevronRight, // In RTL, this might need to be ChevronLeft if used for pointing, but for "expand" icon usually it's fine or flipped via CSS
    Pill,
    Building2,
    LogIn,
    FlaskConical,
    LogOut,
    Settings as SettingsIcon,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLoginModal from '../auth/AdminLoginModal';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        authService.getCurrentUser().then(setUser);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await authService.signOut();
        // wrapper will update via onAuthStateChange
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const toggleSubMenu = (label: string) => {
        if (expandedMenu === label) {
            setExpandedMenu(null);
        } else {
            setExpandedMenu(label);
        }
    };

    const navItems = [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/diagnosis', label: 'التشخيص الذكي', icon: Activity },
        { path: '/lab-diagnosis', label: 'المختبر الذكي', icon: FlaskConical },
        { path: '/awareness', label: 'توعية طبية', icon: BookOpen },
        { path: '/directory', label: 'دليل طبي', icon: Building2 },
        { path: '/contact', label: 'اتصل بنا', icon: Phone },
        {
            label: 'الإعدادات',
            icon: SettingsIcon, // Renamed to avoid conflict if any, or just Settings
            isSubMenu: true,
            children: [
                { path: '/about', label: 'عن المنصة', icon: Info },
                { isAction: true, action: () => setIsLoginModalOpen(true), label: 'دخول المشرفين', icon: LogIn }
            ]
        },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md text-slate-600"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 280 : 90, // Slightly wider collapsed state for the bubbles
                    transition: { duration: 0.3, type: "spring", stiffness: 100, damping: 20 }
                }}
                className={cn(
                    "fixed top-4 right-4 bottom-4 bg-white/90 backdrop-blur-xl z-40 hidden lg:flex flex-col shadow-2xl shadow-slate-200/50 rounded-[2.5rem]", // Floating look with rounded corners
                    !isOpen && "items-center"
                )}
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center justify-center relative w-full mb-2">
                    <div
                        className={cn("flex items-center gap-3 transition-all duration-300", !isOpen && "justify-center")}
                        onClick={() => !isOpen && setIsOpen(true)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* Logo Icon - Custom style for the top pill */}
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300",
                            "bg-cyan-500 shadow-cyan-500/30" // Cyan as base color
                        )}>
                            <Pill size={24} />
                        </div>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-bold text-xl text-slate-800 ml-3 overflow-hidden whitespace-nowrap"
                                >
                                    <span className="text-cyan-600">Smart</span>Tashkhees
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] w-full flex flex-col items-center">
                    {navItems.map((item, index) => {
                        // Handle Submenus (Keeping simple for now, focusing on the main look)
                        if (item.isSubMenu && item.children) {
                            // Simplified sub-menu trigger for this specific "bubble" style
                            return (
                                <div key={index} className="flex flex-col items-center w-full">
                                    <button
                                        onClick={() => {
                                            if (!isOpen) setIsOpen(true);
                                            toggleSubMenu(item.label);
                                        }}
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group relative",
                                            expandedMenu === item.label ? "bg-cyan-50 text-cyan-600" : "text-slate-400 hover:text-cyan-500 hover:bg-slate-50",
                                            isOpen && "w-full justify-start px-4 h-auto py-3 rounded-2xl gap-3"
                                        )}
                                    >
                                        <item.icon size={24} strokeWidth={2} />
                                        {isOpen && <span className="font-medium text-slate-600 group-hover:text-cyan-600">{item.label}</span>}
                                        {isOpen && <ChevronDown size={16} className="mr-auto" />}
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && expandedMenu === item.label && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="w-full pl-8 mt-1 space-y-1"
                                            >
                                                {item.children.map((subItem, idx) => (
                                                    <div key={idx} className="py-1">
                                                        {/* Sub-item rendering logic needs to be simpler for this style */}
                                                        <span className="text-sm text-slate-500">{subItem.label}</span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path || '#'}
                                className={({ isActive }) => cn(
                                    "relative flex items-center justify-center transition-all duration-300 group",
                                    isOpen ? "w-full px-4 py-3 rounded-2xl gap-4 justify-start" : "w-12 h-12 rounded-full",
                                    isActive
                                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30" // Active: Blue Circle
                                        : "text-slate-400 hover:text-cyan-500 hover:bg-slate-50 bg-transparent" // Inactive
                                )}
                            >
                                <item.icon size={24} strokeWidth={2} className="shrink-0 relative z-10" />

                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="whitespace-nowrap font-medium z-10"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 w-full flex flex-col items-center gap-4 mb-4">
                    {/* Toggle Button - always visible now */}
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            "w-12 h-12 rounded-full bg-slate-50 text-slate-400 hover:text-cyan-600 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md",
                            !isOpen && "rotate-180" // Rotate when collapsed (points left to expand), default points right (to collapse)
                        )}
                        title={isOpen ? "تصغير القائمة" : "توسيع القائمة"}
                    >
                        <ChevronRight size={20} />
                    </button>

                    {user && (
                        <div className={cn("mt-auto flex items-center gap-3", isOpen && "w-full p-3 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-colors duration-300")}>
                            <NavLink to="/profile" className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold shrink-0 border-2 border-white shadow-sm">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                {isOpen && (
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-slate-700 truncate">{user.user_metadata?.full_name || 'User'}</p>
                                        <span className="text-xs text-slate-400 group-hover:text-cyan-600 transition-colors">الملف الشخصي</span>
                                    </div>
                                )}
                            </NavLink>
                            {isOpen && (
                                <button
                                    onClick={handleSignOut}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="تسجيل الخروج"
                                >
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-72 bg-white z-40 lg:hidden shadow-2xl flex flex-col"
            >
                {/* Reusing the same structure for mobile, simplified for brevity in this edit if needed, but keeping consistent */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <Pill size={24} />
                        </div>
                        <span className="font-bold text-xl text-slate-800"><span className="text-primary">SmartTashkhees</span></span>
                    </div>
                    <button onClick={toggleSidebar}><X size={24} /></button>
                </div>

                <nav className="flex-1 py-8 px-6 space-y-2">
                    {navItems.map((item, index) => {
                        if (item.isSubMenu && item.children) {
                            const isExpanded = expandedMenu === item.label;
                            return (
                                <div key={index} className="space-y-1">
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-all font-medium"
                                    >
                                        <item.icon size={24} />
                                        <span className="flex-1 text-right">{item.label}</span>
                                        <ChevronDown size={16} className={cn("transition-transform", isExpanded && "rotate-180")} />
                                    </button>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden pr-8"
                                            >
                                                {item.children.map((subItem, subIndex) => (
                                                    subItem.isAction ? (
                                                        <button
                                                            key={subIndex}
                                                            onClick={() => {
                                                                subItem.action();
                                                                setIsOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-primary transition-all text-sm"
                                                        >
                                                            <subItem.icon size={20} />
                                                            <span>{subItem.label}</span>
                                                        </button>
                                                    ) : (
                                                        <NavLink
                                                            key={subIndex}
                                                            to={subItem.path || '#'}
                                                            onClick={() => setIsOpen(false)}
                                                            className={({ isActive }) => cn(
                                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm",
                                                                isActive ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:text-primary"
                                                            )}
                                                        >
                                                            <subItem.icon size={20} />
                                                            <span>{subItem.label}</span>
                                                        </NavLink>
                                                    )
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <NavLink
                                key={item.path || index}
                                to={item.path || '#'}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all",
                                    isActive ? "bg-primary/10 text-primary font-bold" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                <item.icon size={24} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Mobile User Profile / Footer */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    {user ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <NavLink to="/profile" className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1 text-right">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.user_metadata?.full_name || 'User'}</p>
                                    <span className="text-xs text-slate-500">الملف الشخصي</span>
                                </div>
                            </NavLink>
                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setIsOpen(false);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                title="تسجيل الخروج"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/auth"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-primary transition-all duration-200 group",
                                isActive && "bg-slate-50 text-primary"
                            )}
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                <LogIn size={20} />
                            </div>
                            <span className="font-medium whitespace-nowrap">تسجيل الدخول</span>
                        </NavLink>
                    )}
                </div>
            </motion.div>
            {/* Desktop Spacer */}
            <motion.div
                initial={false}
                animate={{
                    width: isOpen ? 280 : 80,
                    transition: { duration: 0.3, type: "spring", stiffness: 100, damping: 20 }
                }}
                className="hidden lg:block shrink-0"
            />

            <AdminLoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;
