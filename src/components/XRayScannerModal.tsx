import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, ScanLine, AlertTriangle, CheckCircle2, Activity, ShieldAlert, Stethoscope, FileWarning } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * محلل صور الأشعة - X-Ray Scanner Modal
 * واجهة حديثة لرفع صور الأشعة وتحليلها بالذكاء الاصطناعي
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface XRayScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ScanState = 'idle' | 'loading' | 'success' | 'not_medical' | 'error';

interface Finding {
    finding: string;
    location: string;
    severity: string;
    confidence: number;
}

interface AnalysisResult {
    success: boolean;
    not_medical?: boolean;
    message?: string;
    error?: string;
    analysis?: {
        image_type: string;
        body_part: string;
        quality: string;
        findings: Finding[];
        normal_structures: string[];
        abnormalities_detected: boolean;
        overall_impression: string;
        recommendations: string[];
        urgency: string;
        differential_diagnosis: string[];
        disclaimer: string;
    };
}

const XRayScannerModal = ({ isOpen, onClose }: XRayScannerModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            setPreviewImage(base64);
            await analyzeXRay(base64);
        };
        reader.readAsDataURL(file);
    };

    const analyzeXRay = async (imageBase64: string) => {
        setScanState('loading');
        setResult(null);

        try {
            const response = await fetch('/api/analyze-xray', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64 })
            });

            const data: AnalysisResult = await response.json();
            setResult(data);

            if (data.success && data.analysis) {
                setScanState('success');
            } else if (data.not_medical) {
                setScanState('not_medical');
            } else {
                setScanState('error');
            }
        } catch (error) {
            console.error('X-Ray analysis error:', error);
            setScanState('error');
            setResult({
                success: false,
                error: 'حدث خطأ في الاتصال. حاول مرة أخرى.'
            });
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

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'حرج': return 'bg-red-100 text-red-700 border-red-200';
            case 'شديد': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'متوسط': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'خفيف': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getUrgencyStyle = (urgency: string) => {
        switch (urgency) {
            case 'طوارئ': return { bg: 'bg-red-50 border-red-300', text: 'text-red-700', icon: '🚨' };
            case 'عاجل': return { bg: 'bg-orange-50 border-orange-300', text: 'text-orange-700', icon: '⚡' };
            case 'متابعة': return { bg: 'bg-amber-50 border-amber-300', text: 'text-amber-700', icon: '📋' };
            default: return { bg: 'bg-green-50 border-green-300', text: 'text-green-700', icon: '✅' };
        }
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
                                   md:w-full md:max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-l from-indigo-50 to-purple-50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <ScanLine className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">محلل صور الأشعة</h2>
                                    <p className="text-sm text-slate-500">تحليل ذكي بالذكاء الاصطناعي</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/80 rounded-xl transition-colors"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* === IDLE STATE === */}
                            {scanState === 'idle' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Disclaimer */}
                                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
                                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-amber-700 font-bold text-sm mb-1">تنبيه مهم</p>
                                            <p className="text-amber-600 text-xs leading-relaxed">
                                                هذا التحليل استرشادي فقط ولا يُغني عن استشارة طبيب أشعة متخصص. لا تتخذ قرارات طبية بناءً على هذه النتائج وحدها.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
                                        <h3 className="font-bold text-indigo-700 mb-3 flex items-center gap-2">
                                            <Stethoscope size={18} />
                                            كيف يعمل المحلل؟
                                        </h3>
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">1</span>
                                                ارفع صورة الأشعة (سينية، مقطعية، أو رنين مغناطيسي)
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">2</span>
                                                الذكاء الاصطناعي يحلل الصورة ويحدد الملاحظات
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">3</span>
                                                تحصل على تقرير مفصل بالنتائج والتوصيات
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">4</span>
                                                راجع النتائج مع طبيب متخصص دائماً
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 text-center cursor-pointer
                                                   hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 group"
                                    >
                                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4
                                                        group-hover:bg-indigo-100 transition-colors">
                                            <Upload size={32} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <p className="text-slate-600 font-medium mb-1">اضغط لرفع صورة الأشعة</p>
                                        <p className="text-sm text-slate-400">JPG, PNG, DICOM أو HEIC</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </motion.div>
                            )}

                            {/* === LOADING STATE === */}
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
                                            className="w-48 h-48 object-cover rounded-2xl mx-auto mb-6 shadow-lg border-2 border-indigo-100"
                                        />
                                    )}
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <Loader2 size={32} className="text-indigo-500 animate-spin" />
                                    </div>
                                    <p className="text-slate-700 font-bold text-lg">جاري تحليل صورة الأشعة...</p>
                                    <p className="text-sm text-slate-400 mt-2">الذكاء الاصطناعي يفحص الصورة بدقة، قد يستغرق ذلك بضع ثوانٍ</p>
                                    
                                    {/* Animated progress dots */}
                                    <div className="flex justify-center gap-2 mt-6">
                                        {[0, 1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-2.5 h-2.5 bg-indigo-400 rounded-full"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* === SUCCESS STATE === */}
                            {scanState === 'success' && result?.analysis && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-5"
                                >
                                    {/* Image & Type Info */}
                                    <div className="flex gap-4 items-start">
                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="X-Ray"
                                                className="w-28 h-28 object-cover rounded-2xl shadow-lg border-2 border-indigo-100 shrink-0"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 className="text-emerald-500" size={20} />
                                                <span className="text-emerald-600 font-bold text-sm">تم التحليل بنجاح</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{result.analysis.image_type}</h3>
                                            <p className="text-sm text-slate-500">المنطقة: {result.analysis.body_part}</p>
                                            <p className="text-sm text-slate-500">جودة الصورة: {result.analysis.quality}</p>
                                        </div>
                                    </div>

                                    {/* Urgency Badge */}
                                    {(() => {
                                        const style = getUrgencyStyle(result.analysis.urgency);
                                        return (
                                            <div className={`p-3 rounded-xl border ${style.bg} flex items-center gap-2`}>
                                                <span className="text-lg">{style.icon}</span>
                                                <span className={`font-bold text-sm ${style.text}`}>
                                                    مستوى الاستعجال: {result.analysis.urgency}
                                                </span>
                                            </div>
                                        );
                                    })()}

                                    {/* Findings */}
                                    {result.analysis.findings && result.analysis.findings.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <Activity size={18} className="text-indigo-500" />
                                                الملاحظات ({result.analysis.findings.length})
                                            </h4>
                                            {result.analysis.findings.map((finding, idx) => (
                                                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <p className="text-slate-800 font-medium text-sm">{finding.finding}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 ${getSeverityColor(finding.severity)}`}>
                                                            {finding.severity}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <span>📍 {finding.location}</span>
                                                        <span>🎯 الثقة: {finding.confidence}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Overall Impression */}
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <h4 className="font-bold text-indigo-800 mb-2 text-sm">📝 الانطباع العام</h4>
                                        <p className="text-indigo-700 text-sm leading-relaxed">{result.analysis.overall_impression}</p>
                                    </div>

                                    {/* Differential Diagnosis */}
                                    {result.analysis.differential_diagnosis && result.analysis.differential_diagnosis.length > 0 && (
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <h4 className="font-bold text-purple-800 mb-2 text-sm">🔬 التشخيصات التفريقية المحتملة</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.analysis.differential_diagnosis.map((diag, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                                        {diag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {result.analysis.recommendations && result.analysis.recommendations.length > 0 && (
                                        <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                                            <h4 className="font-bold text-cyan-800 mb-2 text-sm">💡 التوصيات</h4>
                                            <ul className="space-y-1.5">
                                                {result.analysis.recommendations.map((rec, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-cyan-700">
                                                        <span className="text-cyan-400 mt-1">•</span>
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Disclaimer */}
                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                                        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
                                        <p className="text-amber-600 text-xs leading-relaxed">
                                            {result.analysis.disclaimer}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* === NOT MEDICAL STATE === */}
                            {scanState === 'not_medical' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Uploaded"
                                            className="w-full h-48 object-cover rounded-2xl shadow-lg"
                                        />
                                    )}
                                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                                        <div className="flex items-start gap-3">
                                            <FileWarning className="text-amber-500 shrink-0 mt-0.5" size={24} />
                                            <div>
                                                <p className="text-amber-700 font-bold mb-1">الصورة غير مناسبة</p>
                                                <p className="text-amber-600 text-sm">
                                                    {result?.message || 'الصورة المرفوعة لا تبدو صورة أشعة طبية. يرجى رفع صورة أشعة.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* === ERROR STATE === */}
                            {scanState === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={24} />
                                            <div>
                                                <p className="text-red-700 font-bold mb-1">حدث خطأ</p>
                                                <p className="text-red-600 text-sm">
                                                    {result?.error || 'لم نتمكن من تحليل الصورة. حاول رفع صورة أوضح.'}
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
                                    className="w-full py-3 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-xl font-medium
                                               hover:from-indigo-100 hover:to-purple-100 transition-colors border border-indigo-100"
                                >
                                    تحليل صورة أخرى
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default XRayScannerModal;
