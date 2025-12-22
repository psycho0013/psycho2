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
                    width: isOpen ? 280 : 80,
                    transition: { duration: 0.3, type: "spring", stiffness: 100, damping: 20 }
                }}
                className={cn(
                    "fixed top-0 right-0 h-screen bg-white/80 backdrop-blur-xl border-l border-slate-200 z-40 hidden lg:flex flex-col shadow-2xl shadow-slate-200/50",
                    !isOpen && "items-center"
                )}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 relative">
                    <div
                        className={cn("flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300", !isOpen && "justify-center w-full px-0 scale-90")}
                        onClick={() => !isOpen && setIsOpen(true)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <Pill size={24} />
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-bold text-xl text-slate-800 mr-3"
                                >
                                    <span className="text-primary">SmartTashkhees</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Toggle Button - Visible on Desktop */}
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white border border-slate-200 p-1.5 rounded-full shadow-sm text-slate-400 hover:text-primary hover:border-primary transition-all z-50 hidden lg:flex",
                            !isOpen && "translate-x-1/2 left-1/2 top-24 rotate-180"
                        )}
                        style={{ left: isOpen ? '0' : '50%', transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, 0) rotate(180deg)', top: isOpen ? '50%' : '5rem' }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {navItems.map((item, index) => {
                        if (item.isSubMenu && item.children) {
                            const isExpanded = expandedMenu === item.label;
                            return (
                                <div key={index} className="space-y-1">
                                    <button
                                        onClick={() => {
                                            if (!isOpen) setIsOpen(true);
                                            toggleSubMenu(item.label);
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden text-slate-500 hover:text-slate-900 font-medium",
                                            !isOpen && "justify-center px-2"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                                        <item.icon size={24} className={cn("shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110", isExpanded && "text-primary")} />

                                        <AnimatePresence mode="wait">
                                            {isOpen && (
                                                <>
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="whitespace-nowrap relative z-10 flex-1 text-right"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                    <ChevronDown size={16} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pr-8" // indented for hierarchy
                                            >
                                                {item.children.map((subItem, subIndex) => (
                                                    subItem.isAction ? (
                                                        <button
                                                            key={subIndex}
                                                            onClick={subItem.action}
                                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-50 transition-all text-sm font-medium"
                                                        >
                                                            <subItem.icon size={20} />
                                                            <span>{subItem.label}</span>
                                                        </button>
                                                    ) : (
                                                        <NavLink
                                                            key={subIndex}
                                                            to={subItem.path || '#'}
                                                            className={({ isActive }) => cn(
                                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                                                                isActive ? "text-primary bg-primary/5 font-bold" : "text-slate-500 hover:text-primary hover:bg-slate-50"
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
                                key={item.path}
                                to={item.path || '#'}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "text-primary font-bold shadow-lg shadow-primary/10"
                                        : "text-slate-500 hover:text-slate-900 font-medium",
                                    !isOpen && "justify-center px-2"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNavBackground"
                                                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-100 rounded-2xl border border-primary/20 backdrop-blur-sm"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
                                        <item.icon size={24} className={cn("shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary")} />
                                        <AnimatePresence mode="wait">
                                            {isOpen && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="whitespace-nowrap relative z-10"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        {isOpen && isActive && (
                                            <motion.div
                                                layoutId="activeNavBar"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-sm shadow-primary/50"
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile / Footer */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    {user ? (
                        <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100", !isOpen && "justify-center p-2")}>
                            <NavLink to="/profile" className={cn("flex items-center gap-3 flex-1 min-w-0", !isOpen && "justify-center w-full")}>
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                {isOpen && (
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-sm font-bold text-slate-900 truncate">{user.user_metadata?.full_name || 'User'}</p>
                                        <span className="text-xs text-slate-500 hover:text-primary transition-colors">الملف الشخصي</span>
                                    </div>
                                )}
                            </NavLink>

                            {isOpen && (
                                <button
                                    onClick={handleSignOut}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                    title="تسجيل الخروج"
                                >
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/auth"
                            className={({ isActive }) => cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-primary transition-all duration-200 group",
                                !isOpen && "justify-center p-2",
                                isActive && "bg-slate-50 text-primary"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all", !isOpen && "w-10 h-10")}>
                                <LogIn size={20} />
                            </div>
                            {isOpen && (
                                <span className="font-medium whitespace-nowrap">تسجيل الدخول</span>
                            )}
                        </NavLink>
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
