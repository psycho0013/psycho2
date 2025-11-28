import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="min-h-screen w-full flex flex-col">
                <div className="flex-1">
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default MainLayout;
