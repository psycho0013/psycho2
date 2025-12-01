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
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">اختر نوع التحليل</h2>
                <p className="text-slate-500">يرجى اختيار نوع التحليل الذي تريد تشخيصه من القائمة أدناه</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LAB_TESTS.map((test, index) => {
                    const Icon = getIcon(test.id);
                    return (
                        <motion.button
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onSelect(test.id)}
                            className="p-6 rounded-xl bg-white border border-slate-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group text-right flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <Icon size={24} />
                            </div>
                            <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
                                {test.title}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default LabSelection;
