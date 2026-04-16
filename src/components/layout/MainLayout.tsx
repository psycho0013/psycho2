import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './BottomNav';
import NotificationBell from '../NotificationBell';

const MainLayout = () => {
    const location = useLocation();
    const isFullScreenPage = location.pathname === '/directory';

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {!isFullScreenPage && <ScrollProgress />}
            {!isFullScreenPage && <Sidebar />}

            {/* Floating Notification Bell - Top Left (RTL) */}
            {!isFullScreenPage && (
                <div className="fixed top-5 left-5 z-50">
                    <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-lg shadow-slate-200/50 border border-white/60 p-1">
                        <NotificationBell iconSize={22} />
                    </div>
                </div>
            )}

            <main className={`min-h-screen w-full flex flex-col relative ${isFullScreenPage ? '' : 'pb-20 lg:pb-0'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: isFullScreenPage ? 0 : 15, filter: isFullScreenPage ? 'none' : 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: isFullScreenPage ? 0 : -15, filter: isFullScreenPage ? 'none' : 'blur(5px)' }}
                        transition={{ duration: isFullScreenPage ? 0.15 : 0.3, ease: "easeOut" }}
                        className="flex-1 flex flex-col"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
                {!isFullScreenPage && <Footer />}
                {!isFullScreenPage && <BottomNav />}
            </main>
        </div>
    );
};

export default MainLayout;
