import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <ScrollProgress />
            <Sidebar />
            <main className="min-h-screen w-full flex flex-col relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex-1 flex flex-col"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
                <Footer />
            </main>
        </div>
    );
};

export default MainLayout;
