import { useState } from 'react';
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
    LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLoginModal from '../auth/AdminLoginModal';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/diagnosis', label: 'التشخيص الذكي', icon: Activity },
        { path: '/awareness', label: 'توعية طبية', icon: BookOpen },
        { path: '/directory', label: 'دليل طبي', icon: Building2 },
        { path: '/about', label: 'عن المنصة', icon: Info },
        { path: '/contact', label: 'اتصل بنا', icon: Phone },
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
                                    صيدلية <span className="text-primary">فاي</span>
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
                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary font-bold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium",
                                !isOpen && "justify-center px-2"
                            )}
                        >
                            <item.icon size={24} className="shrink-0" />

                            <AnimatePresence mode="wait">
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active Indicator */}
                            {isOpen && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full opacity-0 transition-opacity duration-200 [.active_&]:opacity-100" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Footer */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-primary transition-all duration-200 group",
                            !isOpen && "justify-center p-2"
                        )}
                    >
                        <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all", !isOpen && "w-10 h-10")}>
                            <LogIn size={20} />
                        </div>
                        {isOpen && (
                            <span className="font-medium whitespace-nowrap">دخول المشرفين</span>
                        )}
                    </button>

                    <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100", !isOpen && "justify-center p-2")}>
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </div>
                        {isOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-900 truncate">ضيف زائر</p>
                                <p className="text-xs text-slate-500 truncate">مرحباً بك</p>
                            </div>
                        )}
                    </div>
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
                        <span className="font-bold text-xl text-slate-800">صيدلية <span className="text-primary">فاي</span></span>
                    </div>
                    <button onClick={toggleSidebar}><X size={24} /></button>
                </div>

                <nav className="flex-1 py-8 px-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all",
                                isActive ? "bg-primary/10 text-primary font-bold" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <item.icon size={24} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
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
