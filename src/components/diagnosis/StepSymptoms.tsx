import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiagnosisState } from '../../pages/Diagnosis';
import { symptomCategories, type Symptom, type Severity } from '@/types/medical';
import DbManager from '@/services/dbManager';

interface Props {
    state: DiagnosisState;
    setState: React.Dispatch<React.SetStateAction<DiagnosisState>>;
    onNext: () => void;
    onPrev: () => void;
}

const StepSymptoms = ({ state, setState, onNext, onPrev }: Props) => {
    const [activeCategory, setActiveCategory] = useState(symptomCategories[0].id);
    const [selectedSymptomForSeverity, setSelectedSymptomForSeverity] = useState<Symptom | null>(null);
    const [symptomsList, setSymptomsList] = useState<Symptom[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await DbManager.getSymptoms();
            setSymptomsList(data);
        };
        loadData();
    }, []);

    // Helper function to get symptom name for matching
    const getSymptomName = (symptom: Symptom) => {
        return (symptom.name_ar || symptom.name || '').toLowerCase().trim();
    };

    // Check if a symptom is already selected (by name, not just ID)
    const isSymptomSelected = (symptom: Symptom) => {
        const symptomName = getSymptomName(symptom);
        return state.selectedSymptoms.find(selected => {
            const selectedSymptom = symptomsList.find(s => s.id === selected.id);
            if (!selectedSymptom) return selected.id === symptom.id;
            return getSymptomName(selectedSymptom) === symptomName;
        });
    };

    const toggleSymptom = (symptom: Symptom) => {
        const existingSelection = isSymptomSelected(symptom);
        if (existingSelection) {
            // Remove by ID of the originally selected symptom
            setState((prev) => ({
                ...prev,
                selectedSymptoms: prev.selectedSymptoms.filter((s) => s.id !== existingSelection.id),
            }));
        } else {
            setSelectedSymptomForSeverity(symptom);
        }
    };

    const confirmSeverity = (severity: Severity) => {
        if (selectedSymptomForSeverity) {
            setState((prev) => ({
                ...prev,
                selectedSymptoms: [...prev.selectedSymptoms, { id: selectedSymptomForSeverity.id, severity }],
            }));
            setSelectedSymptomForSeverity(null);
        }
    };

    // Get category name in Arabic
    const getCategoryName = (categoryId: string) => {
        return symptomCategories.find(c => c.id === categoryId)?.name || categoryId;
    };

    // Filter symptoms based on search or category
    const getDisplayedSymptoms = () => {
        if (isSearchMode && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return symptomsList.filter(s =>
                (s.name_ar || s.name || '').toLowerCase().includes(query) ||
                (s.name_en || '').toLowerCase().includes(query)
            );
        }
        return symptomsList.filter((s) => s.category === activeCategory);
    };

    const displayedSymptoms = getDisplayedSymptoms();

    // Count selected symptoms per category (for badges)
    const getSelectedCountByCategory = (categoryId: string) => {
        return state.selectedSymptoms.filter(selected => {
            const symptom = symptomsList.find(s => s.id === selected.id);
            return symptom?.category === categoryId;
        }).length;
    };

    return (
        <div className="space-y-6">
            <div className="text-center relative z-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
                    بماذا تشعر؟
                </h2>
                <p className="text-slate-500">اختر الأعراض التي تعاني منها حالياً وسنساعدك في التشخيص.</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="ابحث عن عرض معين..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchMode(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => searchQuery.trim() && setIsSearchMode(true)}
                    className="w-full pr-12 pl-4 py-3.5 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setIsSearchMode(false);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Selected Symptoms Count */}
            {state.selectedSymptoms.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                    <Check size={18} className="text-primary" />
                    <span className="text-primary font-medium">
                        تم اختيار {state.selectedSymptoms.length} عرض
                    </span>
                </div>
            )}

            {/* Categories (hidden when searching) */}
            {!isSearchMode && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {symptomCategories.map((cat) => {
                        const selectedCount = getSelectedCountByCategory(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 backdrop-blur-md relative",
                                    activeCategory === cat.id
                                        ? "bg-slate-900/90 text-white shadow-lg shadow-slate-900/20"
                                        : "bg-white/40 text-slate-600 hover:bg-white/60 border border-white/50"
                                )}
                            >
                                {cat.name}
                                {selectedCount > 0 && (
                                    <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                        {selectedCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Search Mode Header */}
            {isSearchMode && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-slate-500">
                        نتائج البحث: {displayedSymptoms.length} عرض
                    </span>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setIsSearchMode(false);
                        }}
                        className="text-sm text-primary hover:underline"
                    >
                        عرض الأجهزة
                    </button>
                </div>
            )}

            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {displayedSymptoms.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        {isSearchMode ? 'لم يتم العثور على نتائج' : 'لا توجد أعراض في هذا القسم'}
                    </div>
                ) : (
                    displayedSymptoms.map((symptom) => {
                        const isSelected = isSymptomSelected(symptom);
                        return (
                            <motion.button
                                key={`${symptom.id}-${symptom.category}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleSymptom(symptom)}
                                className={cn(
                                    "glass-card p-4 flex flex-col justify-between min-h-[6rem] text-right group relative",
                                    isSelected && "selected border-primary/50 bg-primary/5"
                                )}
                            >
                                {/* Selected Checkmark */}
                                {isSelected && (
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}

                                <span className={cn(
                                    "font-bold text-base transition-colors leading-tight",
                                    isSelected ? "text-primary" : "text-slate-700 group-hover:text-slate-900"
                                )}>
                                    {symptom.name_ar || symptom.name}
                                </span>

                                {/* Show category when in search mode */}
                                {isSearchMode && (
                                    <span className="text-xs text-slate-400 mt-1">
                                        {getCategoryName(symptom.category)}
                                    </span>
                                )}

                                {isSelected ? (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 self-start font-medium mt-1"
                                    >
                                        {isSelected.severity === 'mild' ? 'خفيف' : isSelected.severity === 'moderate' ? 'متوسط' : 'شديد'}
                                    </motion.span>
                                ) : (
                                    <div className="absolute bottom-3 left-3 w-7 h-7 rounded-full bg-slate-100/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Activity size={14} className="text-slate-400" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })
                )}
            </div>

            {/* Severity Modal */}
            <AnimatePresence>
                {selectedSymptomForSeverity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                            onClick={() => setSelectedSymptomForSeverity(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-panel p-6 w-full max-w-sm relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">ما مدى حدة {selectedSymptomForSeverity.name_ar || selectedSymptomForSeverity.name}؟</h3>
                                <button onClick={() => setSelectedSymptomForSeverity(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                                    <button
                                        key={sev}
                                        onClick={() => confirmSeverity(sev)}
                                        className="group w-full p-4 rounded-2xl border border-white/60 bg-white/40 hover:bg-white/80 hover:scale-[1.02] active:scale-[0.98] transition-all text-right shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "font-bold text-lg",
                                                sev === 'severe' ? "text-rose-600" : sev === 'moderate' ? "text-amber-600" : "text-emerald-600"
                                            )}>
                                                {sev === 'mild' ? 'خفيف' : sev === 'moderate' ? 'متوسط' : 'شديد'}
                                            </span>
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                sev === 'severe' ? "bg-rose-500" : sev === 'moderate' ? "bg-amber-500" : "bg-emerald-500"
                                            )} />
                                        </div>
                                        <div className="text-xs text-slate-500 opacity-80 group-hover:opacity-100">
                                            {sev === 'mild' ? 'انزعاج بسيط، لا يؤثر على الحياة اليومية' :
                                                sev === 'moderate' ? 'مزعج، قد يحد من بعض الأنشطة' :
                                                    'ألم شديد، يمنع الأنشطة اليومية'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="pt-4 flex justify-between border-t border-slate-200/50">
                <button
                    onClick={onPrev}
                    className="glass-button px-8 py-3 hover:bg-white/60"
                >
                    رجوع
                </button>
                <button
                    onClick={onNext}
                    disabled={state.selectedSymptoms.length === 0}
                    className="glass-button glass-button-primary px-10 py-3 disabled:opacity-50 disabled:grayscale"
                >
                    الخطوة التالية
                </button>
            </div>
        </div>
    );
};

export default StepSymptoms;

