/**
 * Interactive Dental Map Component - Ultra Premium Version
 * خريطة الأسنان التفاعلية - نسخة محسنة جداً
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Crosshair,
    ArrowUpRight,
    ArrowUpLeft,
    ArrowDownRight,
    ArrowDownLeft,
    Circle,
    Info,
    Grid,
    Search
} from 'lucide-react';
import type { ProblemArea, ToothLocation } from '@/types/dental';
import { PROBLEM_AREA_NAMES } from '@/types/dental';

interface DentalMapProps {
    selectedArea: ProblemArea;
    selectedTooth?: ToothLocation;
    onSelectArea: (area: ProblemArea) => void;
    onSelectTooth: (tooth: ToothLocation) => void;
}

// أسماء الأسنان
const TOOTH_NAMES: Record<number, string> = {
    1: 'القاطع المركزي',
    2: 'القاطع الجانبي',
    3: 'الناب',
    4: 'الضاحك الأول',
    5: 'الضاحك الثاني',
    6: 'الطاحن الأول',
    7: 'الطاحن الثاني',
    8: 'ضرس العقل',
};

// ترتيب الأسنان للعرض
const UPPER_RIGHT = [8, 7, 6, 5, 4, 3, 2, 1];
const UPPER_LEFT = [1, 2, 3, 4, 5, 6, 7, 8];
const LOWER_RIGHT = [8, 7, 6, 5, 4, 3, 2, 1];
const LOWER_LEFT = [1, 2, 3, 4, 5, 6, 7, 8];

// أيقونة السن (SVG)
const ToothIcon = ({ className, isSelected, isHovered }: { className?: string, isSelected: boolean, isHovered: boolean }) => (
    <svg viewBox="0 0 24 32" className={className} fill="currentColor">
        <path d="M4.5 8C4.5 4.5 7.5 1 12 1C16.5 1 19.5 4.5 19.5 8V16C19.5 16 22 18 22 22C22 26 19 31 16 31C14 31 13 28 12 28C11 28 10 31 8 31C5 31 2 26 2 22C2 18 4.5 16 4.5 16V8Z"
            className={`transition-all duration-300 ${isSelected ? 'fill-red-500 stroke-red-600' :
                isHovered ? 'fill-emerald-100/50 stroke-emerald-500' :
                    'fill-white stroke-slate-300'
                }`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        {/* تفاصيل السطح */}
        {!isSelected && (
            <path d="M8 8C8 8 10 6 12 8C14 6 16 8 16 8"
                className="stroke-slate-200"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
            />
        )}
    </svg>
);

const MolarIcon = ({ className, isSelected, isHovered }: { className?: string, isSelected: boolean, isHovered: boolean }) => (
    <svg viewBox="0 0 28 32" className={className} fill="currentColor">
        <path d="M4 10C4 5 8 2 14 2C20 2 24 5 24 10V18C24 18 26 20 26 24C26 28 23 31 20 31C18 31 17 29 16 27C15 29 13 31 11 31C9 31 8 29 8 27C7 29 5 31 3 31C2 31 2 28 2 24C2 20 4 18 4 18V10Z"
            className={`transition-all duration-300 ${isSelected ? 'fill-red-500 stroke-red-600' :
                isHovered ? 'fill-emerald-100/50 stroke-emerald-500' :
                    'fill-white stroke-slate-300'
                }`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M8 8C8 8 11 6 14 8C17 6 20 8 20 8"
            className="stroke-slate-200"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
        />
    </svg>
);

// خيارات المناطق مع أيقونات Lucide
const areaOptionsData: { id: ProblemArea; icon: React.ReactNode; color: string }[] = [
    { id: 'specific-tooth', icon: <Crosshair size={22} />, color: 'from-emerald-500 to-teal-500' },
    { id: 'upper-right', icon: <ArrowUpRight size={22} />, color: 'from-blue-500 to-indigo-500' },
    { id: 'upper-left', icon: <ArrowUpLeft size={22} />, color: 'from-blue-500 to-indigo-500' },
    { id: 'lower-right', icon: <ArrowDownRight size={22} />, color: 'from-purple-500 to-pink-500' },
    { id: 'lower-left', icon: <ArrowDownLeft size={22} />, color: 'from-purple-500 to-pink-500' },
    { id: 'gums-general', icon: <Circle size={22} />, color: 'from-rose-500 to-red-500' },
    { id: 'whole-mouth', icon: <Grid size={22} />, color: 'from-amber-500 to-orange-500' },
    { id: 'jaw-joint', icon: <Info size={22} />, color: 'from-slate-500 to-gray-600' },
    { id: 'unknown', icon: <Search size={22} />, color: 'from-slate-400 to-slate-500' },
];

export default function DentalMap({
    selectedArea,
    selectedTooth,
    onSelectArea,
    onSelectTooth,
}: DentalMapProps) {
    const [hoveredTooth, setHoveredTooth] = useState<string | null>(null);
    const [showToothMap, setShowToothMap] = useState(selectedArea === 'specific-tooth');

    const isToothSelected = (quadrant: ToothLocation['quadrant'], toothNumber: number) => {
        return selectedTooth?.quadrant === quadrant && selectedTooth?.toothNumber === toothNumber;
    };

    const handleToothClick = (quadrant: ToothLocation['quadrant'], toothNumber: number) => {
        onSelectTooth({ quadrant, toothNumber });
        onSelectArea('specific-tooth');
    };

    // مكون السن الفردي - تصميم محسن
    const ToothButton = ({
        quadrant,
        toothNumber,
        isWisdom = false
    }: {
        quadrant: ToothLocation['quadrant'];
        toothNumber: number;
        isWisdom?: boolean;
    }) => {
        const toothId = `${quadrant}-${toothNumber}`;
        const isSelected = isToothSelected(quadrant, toothNumber);
        const isHovered = hoveredTooth === toothId;
        const isUpper = quadrant.includes('upper');
        const isMolar = toothNumber >= 4; // الضواحك والطواحن

        return (
            <motion.button
                whileHover={{ scale: 1.15, y: isUpper ? 2 : -2 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredTooth(toothId)}
                onMouseLeave={() => setHoveredTooth(null)}
                onClick={() => handleToothClick(quadrant, toothNumber)}
                className={`
                    relative flex flex-col items-center justify-center group
                    ${isWisdom ? 'mx-1' : 'mx-0.5'}
                `}
            >
                {/* شكل السن SVG */}
                <div className={`
                    relative transition-all duration-300
                    ${isMolar
                        ? 'w-8 h-10 sm:w-10 sm:h-12'
                        : 'w-6 h-9 sm:w-8 sm:h-11'
                    }
                    ${isUpper ? 'rotate-180' : ''}
                `}>
                    {isMolar ? (
                        <MolarIcon
                            className="w-full h-full drop-shadow-sm filter"
                            isSelected={isSelected}
                            isHovered={isHovered}
                        />
                    ) : (
                        <ToothIcon
                            className="w-full h-full drop-shadow-sm filter"
                            isSelected={isSelected}
                            isHovered={isHovered}
                        />
                    )}
                </div>

                {/* رقم السن */}
                <span className={`
                    absolute ${isUpper ? '-bottom-5' : '-top-5'}
                    text-[10px] sm:text-xs font-bold transition-colors duration-200
                    ${isSelected ? 'text-red-500 scale-110' :
                        isHovered ? 'text-emerald-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'}
                `}>
                    {toothNumber}
                </span>

                {/* مؤشر التحديد */}
                {isSelected && (
                    <motion.div
                        layoutId="selectedToothIndicator"
                        className={`
                            absolute ${isUpper ? 'top-1/2' : 'bottom-1/2'} 
                            w-2 h-2 bg-white rounded-full 
                        `}
                    />
                )}
            </motion.button>
        );
    };

    // صف الأسنان المحسن
    const ToothRow = ({
        teeth,
        quadrant
    }: {
        teeth: number[];
        quadrant: ToothLocation['quadrant'];
    }) => (
        <div className={`flex items-end justify-center px-1`}>
            {teeth.map(num => (
                <ToothButton
                    key={`${quadrant}-${num}`}
                    quadrant={quadrant}
                    toothNumber={num}
                    isWisdom={num === 8}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            {/* اختيار نوع التحديد */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                {areaOptionsData.map(option => {
                    const isActive = selectedArea === option.id;
                    return (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                onSelectArea(option.id);
                                setShowToothMap(option.id === 'specific-tooth');
                            }}
                            className={`
                                relative p-3 sm:p-4 rounded-2xl transition-all duration-300
                                flex flex-col items-center gap-3 overflow-hidden group
                                ${isActive
                                    ? `bg-gradient-to-br ${option.color} text-white shadow-xl ring-2 ring-white ring-offset-2`
                                    : 'bg-white border-2 border-slate-100 hover:border-slate-300 hover:shadow-lg'
                                }
                            `}
                        >
                            <div className={`
                                p-2.5 rounded-xl transition-all duration-300
                                ${isActive ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700'}
                            `}>
                                {option.icon}
                            </div>

                            <span className={`
                                text-xs font-bold text-center leading-tight
                                ${isActive ? 'text-white' : 'text-slate-600'}
                            `}>
                                {PROBLEM_AREA_NAMES[option.id]}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* خريطة الأسنان التفاعلية المحسنة */}
            <AnimatePresence>
                {showToothMap && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gradient-to-b from-slate-50 to-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-xl relative">
                            {/* زخرفة خلفية */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

                            <div className="text-center mb-8">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-2">
                                    <Info size={14} />
                                    اضغط على السن لتحديده
                                </span>
                                <h3 className="font-bold text-slate-800 text-xl">مخطط الأسنان</h3>
                            </div>

                            {/* الحاوية الرئيسية للفكين */}
                            <div className="max-w-3xl mx-auto">
                                {/* الفك العلوي */}
                                <div className="relative mb-8 pb-8 border-b-2 border-dashed border-slate-200">
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-slate-400 text-xs font-bold tracking-wider border border-slate-100 rounded-full">
                                        UPPER JAW
                                    </span>

                                    <div className="flex justify-center items-end gap-4 sm:gap-8 pt-6">
                                        <div className="text-center">
                                            <ToothRow teeth={UPPER_RIGHT} quadrant="upper-right" />
                                            <span className="text-[10px] font-bold text-slate-300 mt-2 block tracking-widest">RIGHT</span>
                                        </div>
                                        <div className="h-24 w-px bg-gradient-to-b from-slate-200 to-transparent" />
                                        <div className="text-center">
                                            <ToothRow teeth={UPPER_LEFT} quadrant="upper-left" />
                                            <span className="text-[10px] font-bold text-slate-300 mt-2 block tracking-widest">LEFT</span>
                                        </div>
                                    </div>
                                </div>

                                {/* الفك السفلي */}
                                <div className="relative pt-4">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-slate-400 text-xs font-bold tracking-wider border border-slate-100 rounded-full z-10">
                                        LOWER JAW
                                    </span>

                                    <div className="flex justify-center items-start gap-4 sm:gap-8">
                                        <div className="text-center">
                                            <span className="text-[10px] font-bold text-slate-300 mb-2 block tracking-widest">RIGHT</span>
                                            <ToothRow teeth={LOWER_RIGHT} quadrant="lower-right" />
                                        </div>
                                        <div className="h-24 w-px bg-gradient-to-t from-slate-200 to-transparent" />
                                        <div className="text-center">
                                            <span className="text-[10px] font-bold text-slate-300 mb-2 block tracking-widest">LEFT</span>
                                            <ToothRow teeth={LOWER_LEFT} quadrant="lower-left" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* معلومات السن المختار - Floating Card */}
                            <AnimatePresence>
                                {selectedTooth && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="mt-8 mx-auto max-w-sm"
                                    >
                                        <div className="bg-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Crosshair className="text-emerald-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                                                    SELECTED
                                                </p>
                                                <h4 className="font-bold text-lg truncate">
                                                    {TOOTH_NAMES[selectedTooth.toothNumber]}
                                                </h4>
                                                <p className="text-slate-400 text-xs">
                                                    {selectedTooth.quadrant.includes('upper') ? 'Upper' : 'Lower'} •
                                                    {selectedTooth.quadrant.includes('right') ? 'Right' : 'Left'}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
