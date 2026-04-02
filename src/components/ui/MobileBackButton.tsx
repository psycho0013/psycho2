import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * زر رجوع للموبايل — يظهر فقط على الشاشات الصغيرة
 */
const MobileBackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="lg:hidden flex items-center gap-2 mb-4 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all w-fit"
        >
            <ArrowRight size={18} />
            <span className="text-sm font-medium">رجوع</span>
        </button>
    );
};

export default MobileBackButton;
