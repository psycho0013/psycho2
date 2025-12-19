import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Loader2, Pill, ArrowLeft, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ماسح الأدوية - Medicine Scanner Modal
 * واجهة حديثة لتصوير الدواء والتعرف عليه
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface MedicineScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ScanState = 'idle' | 'loading' | 'success' | 'not_found' | 'error';

interface ScanResult {
    success: boolean;
    found_in_db: boolean;
    extracted?: {
        name_ar: string | null;
        name_en: string | null;
        dosage: string | null;
        form: string | null;
    };
    treatment?: {
        id: string;
        name: string;
        name_en?: string;
        description: string;
        type: string;
        dosage?: string;
    };
    message?: string;
    error?: string;
}

const MedicineScannerModal = ({ isOpen, onClose }: MedicineScannerModalProps) => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [result, setResult] = useState<ScanResult | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            setPreviewImage(base64);
            await scanMedicine(base64);
        };
        reader.readAsDataURL(file);
    };

    const scanMedicine = async (imageBase64: string) => {
        setScanState('loading');
        setResult(null);

        try {
            const response = await fetch('/api/scan-medicine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64 })
            });

            const data: ScanResult = await response.json();
            setResult(data);

            if (data.success && data.found_in_db) {
                setScanState('success');
            } else if (data.success && !data.found_in_db) {
                setScanState('not_found');
            } else {
                setScanState('error');
            }
        } catch (error) {
            console.error('Scan error:', error);
            setScanState('error');
            setResult({
                success: false,
                found_in_db: false,
                error: 'حدث خطأ في الاتصال. حاول مرة أخرى.'
            });
        }
    };

    const handleGoToTreatment = () => {
        if (result?.treatment?.id) {
            onClose();
            navigate(`/awareness/treatment/${result.treatment.id}`);
        }
    };

    const resetScanner = () => {
        setScanState('idle');
        setPreviewImage(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetScanner();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
                                   md:w-full md:max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                                    <Camera className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">ماسح الأدوية</h2>
                                    <p className="text-sm text-slate-500">صوّر الدواء للتعرف عليه</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {scanState === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Instructions */}
                                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-5 rounded-2xl border border-primary/20">
                                        <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                                            <Sparkles size={18} />
                                            كيف يعمل الماسح؟
                                        </h3>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">1</span>
                                                صوّر علبة الدواء أو الشريط
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">2</span>
                                                الذكاء الاصطناعي يقرأ الاسم
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">3</span>
                                                نعرض لك معلومات الدواء الكاملة
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Upload Button */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center cursor-pointer
                                                   hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4
                                                        group-hover:bg-primary/20 transition-colors">
                                            <Upload size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="text-slate-600 font-medium mb-1">اضغط لرفع صورة</p>
                                        <p className="text-sm text-slate-400">JPG, PNG أو HEIC</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </motion.div>
                            )}

                            {scanState === 'loading' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-10"
                                >
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6 shadow-lg"
                                        />
                                    )}
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <Loader2 size={32} className="text-primary animate-spin" />
                                    </div>
                                    <p className="text-slate-600 font-medium">جاري تحليل الصورة...</p>
                                    <p className="text-sm text-slate-400 mt-1">قد يستغرق ذلك بضع ثوانٍ</p>
                                </motion.div>
                            )}

                            {scanState === 'success' && result?.treatment && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Scanned"
                                            className="w-full h-48 object-cover rounded-2xl shadow-lg"
                                        />
                                    )}

                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
                                        <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                                        <p className="text-emerald-700 font-medium">تم التعرف على الدواء بنجاح!</p>
                                    </div>

                                    {/* Treatment Card */}
                                    <motion.button
                                        onClick={handleGoToTreatment}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-primary to-primary/80 p-5 rounded-2xl text-white text-right
                                                   shadow-lg shadow-primary/30 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <Pill size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{result.treatment.name}</p>
                                                {result.treatment.name_en && (
                                                    <p className="text-white/70 text-sm">{result.treatment.name_en}</p>
                                                )}
                                                {result.treatment.dosage && (
                                                    <p className="text-white/80 text-sm mt-1">{result.treatment.dosage}</p>
                                                )}
                                            </div>
                                            <ArrowLeft size={24} className="text-white/70" />
                                        </div>
                                        <p className="text-white/80 text-sm mt-3 text-center">
                                            اضغط لعرض معلومات الدواء الكاملة
                                        </p>
                                    </motion.button>
                                </motion.div>
                            )}

                            {scanState === 'not_found' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Scanned"
                                            className="w-full h-48 object-cover rounded-2xl shadow-lg"
                                        />
                                    )}

                                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                                            <div>
                                                <p className="text-amber-700 font-bold mb-1">تم قراءة الدواء</p>
                                                <p className="text-amber-600 text-sm">
                                                    {result?.extracted?.name_ar || result?.extracted?.name_en || 'اسم غير محدد'}
                                                </p>
                                                <p className="text-amber-600/70 text-sm mt-2">
                                                    هذا الدواء غير موجود في قاعدة البيانات حالياً.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {scanState === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={24} />
                                            <div>
                                                <p className="text-red-700 font-bold mb-1">حدث خطأ</p>
                                                <p className="text-red-600 text-sm">
                                                    {result?.error || 'لم نتمكن من قراءة الصورة. حاول التقاط صورة أوضح.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        {scanState !== 'idle' && scanState !== 'loading' && (
                            <div className="p-4 border-t border-slate-100">
                                <button
                                    onClick={resetScanner}
                                    className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium
                                               hover:bg-slate-200 transition-colors"
                                >
                                    مسح صورة أخرى
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MedicineScannerModal;
