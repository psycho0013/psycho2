import { motion } from 'framer-motion';
import { Activity, Droplets, FlaskConical, HeartPulse, Microscope, Utensils } from 'lucide-react';
import { LAB_TESTS, type TestType } from '@/services/labAnalysisService';


interface Props {
    onSelect: (testId: TestType) => void;
}

const getIcon = (id: string) => {
    switch (id) {
        case 'cbc': return Droplets;
        case 'kidney': return Activity;
        case 'liver': return FlaskConical;
        case 'thyroid': return Activity;
        case 'sugar': return Utensils;
        case 'lipid': return HeartPulse;
        case 'vitamin': return Activity; // Generic for now
        case 'iron': return Microscope;
        case 'urine': return FlaskConical;
        case 'stool': return Microscope;
        default: return Activity;
    }
};

const LabSelection = ({ onSelect }: Props) => {
    return (
        <div className="space-y-8">
            <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-3">
                    مختبر التحليلات الذكي
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                    اختر نوع التحليل واكتب النتائج لنقوم بقراءتها وتحليلها لك فوراً باستخدام الذكاء الاصطناعي.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {LAB_TESTS.map((test, index) => {
                    const Icon = getIcon(test.id);
                    return (
                        <motion.button
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(test.id)}
                            className="glass-card p-6 flex items-center gap-5 group h-32 text-right relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-16 h-16 rounded-2xl bg-slate-100/50 backdrop-blur-sm shadow-inner flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                                <Icon size={32} strokeWidth={1.5} />
                            </div>

                            <div className="flex flex-col gap-1 z-10">
                                <span className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">
                                    {test.title}
                                </span>
                                <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
                                    تحليل فوري دقيق
                                </span>
                            </div>

                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default LabSelection;
