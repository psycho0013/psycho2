import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Activity, BookOpen, Building2, Menu, X, Info, Phone, LogIn, LogOut, ChevronRight, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLoginModal from '../auth/AdminLoginModal';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { LucideIcon } from 'lucide-react';

interface MoreItem {
    label: string;
    icon: LucideIcon;
    color?: string;
    bg?: string;
    path?: string;
    isAction?: boolean;
    action?: () => void;
}

const BottomNav = () => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        authService.getCurrentUser().then(setUser);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mainNavItems = [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/services', label: 'التشخيص', icon: Activity },
        { path: '/awareness', label: 'توعية', icon: BookOpen },
        { path: '/directory', label: 'دليل طبي', icon: Building2 },
    ];

    const moreItems: MoreItem[] = [
        { path: '/about', label: 'عن المنصة', icon: Info },
        { path: '/contact', label: 'اتصل بنا', icon: Phone },
        // Auth items - dynamic based on user state
        ...(user ? [
            { 
                path: '/profile', 
                label: 'الملف الشخصي', 
                icon: UserCircle2,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50'
            },
            { 
                isAction: true, 
                action: async () => {
                    await authService.signOut();
                    setIsMoreOpen(false);
                    navigate('/');
                }, 
                label: 'تسجيل خروج', 
                icon: LogOut,
                color: 'text-rose-600',
                bg: 'bg-rose-50'
            }
        ] : [
            { 
                path: '/auth', 
                label: 'تسجيل الدخول', 
                icon: UserCircle2,
                color: 'text-cyan-600',
                bg: 'bg-cyan-50'
            }
        ]),
        { 
            isAction: true, 
            action: () => {
                setIsMoreOpen(false);
                setIsAdminOpen(true);
            }, 
            label: 'دخول المشرفين', 
            icon: LogIn,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        }
    ];

    return (
        <>
            {/* Main Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-safe pt-2 px-2 flex items-center justify-around">
                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center justify-center w-16 px-1 py-1 rounded-xl transition-all duration-200",
                                isActive ? "text-cyan-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={cn(
                                        "flex items-center justify-center w-auto h-8 rounded-full mb-1 transition-all duration-200",
                                        isActive && "bg-cyan-50 px-3"
                                    )}>
                                        <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-medium transition-all duration-200",
                                        isActive ? "font-bold text-cyan-700" : ""
                                    )}>
                                        {item.label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}

                {/* More Menu Button */}
                <button
                    onClick={() => setIsMoreOpen(true)}
                    className="flex flex-col items-center justify-center w-16 px-1 py-1 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-600"
                >
                    <div className="flex items-center justify-center w-auto h-8 mb-1 rounded-full text-slate-500">
                        <Menu size={20} strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-medium">المزيد</span>
                </button>
            </div>

            {/* "More" Slide-up Menu */}
            <AnimatePresence>
                {isMoreOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                            onClick={() => setIsMoreOpen(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] lg:hidden pb-safe overflow-hidden"
                            dir="rtl"
                        >
                            {/* Handle element */}
                            <div className="w-full flex justify-center pt-4 pb-2" onClick={() => setIsMoreOpen(false)}>
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl text-slate-800">خيارات إضافية</h3>
                                    <button 
                                        onClick={() => setIsMoreOpen(false)}
                                        className="p-2 bg-slate-100 rounded-full text-slate-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {moreItems.map((item, idx) => {
                                        const Icon = item.icon;
                                        if (item.isAction && item.action) {
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={item.action}
                                                    className={cn("w-full flex items-center justify-between p-4 rounded-2xl transition-colors border border-slate-100 active:scale-[0.98]", item.bg || "bg-white hover:bg-slate-50")}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg ? "bg-white" : "bg-slate-100", item.color || "text-slate-600")}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <span className={cn("font-bold text-base", item.color || "text-slate-700")}>{item.label}</span>
                                                    </div>
                                                    <ChevronRight size={20} className={item.color || "text-slate-400"} />
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (item.path) navigate(item.path);
                                                    setIsMoreOpen(false);
                                                }}
                                                className={cn("w-full flex items-center justify-between p-4 rounded-2xl transition-colors border border-slate-100 active:scale-[0.98]", item.bg || "bg-white hover:bg-slate-50")}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg ? "bg-white" : "bg-slate-100", item.color || "text-slate-600")}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className={cn("font-bold text-base", item.color || "text-slate-700")}>{item.label}</span>
                                                </div>
                                                <ChevronRight size={20} className={item.color || "text-slate-400"} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Admin Login Modal linked from "More" menu */}
            <AdminLoginModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </>
    );
};

export default BottomNav;
