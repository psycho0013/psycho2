import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FeedbackWidgetProps {
    diseaseName?: string;
    confidenceScore?: number;
}

const emojis = ['😞', '😕', '😐', '🙂', '🤩'];
const labels = ['سيئة', 'ضعيفة', 'مقبولة', 'جيدة', 'ممتازة'];

const FeedbackWidget = ({ diseaseName, confidenceScore }: FeedbackWidgetProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [showComment, setShowComment] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSending(true);

        try {
            await supabase.from('diagnosis_feedback').insert({
                rating,
                comment: comment.trim() || null,
                disease_name: diseaseName || null,
                confidence_score: confidenceScore || null,
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Feedback error:', err);
        } finally {
            setSending(false);
        }
    };

    const activeRating = hoveredRating || rating;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-8"
        >
            <AnimatePresence mode="wait">
                {submitted ? (
                    /* ═══════ Thank You State ═══════ */
                    <motion.div
                        key="thanks"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        >
                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                        </motion.div>
                        <h4 className="text-xl font-bold text-emerald-800 mb-2">شكراً لتقييمك! 💚</h4>
                        <p className="text-emerald-600 text-sm">رأيك يساعدنا على تحسين دقة التشخيص وتطوير المنصة.</p>
                    </motion.div>
                ) : (
                    /* ═══════ Rating Form ═══════ */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 rounded-2xl p-6 md:p-8"
                    >
                        <div className="text-center mb-6">
                            <h4 className="text-lg font-bold text-slate-800 mb-1">كيف كانت تجربة التشخيص؟</h4>
                            <p className="text-sm text-slate-500">قيّم دقة النتيجة لتساعدنا في التحسين</p>
                        </div>

                        {/* Emoji + Stars Row */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            {/* Emoji Display */}
                            <AnimatePresence mode="wait">
                                {activeRating > 0 && (
                                    <motion.div
                                        key={activeRating}
                                        initial={{ scale: 0, y: 10 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0, y: -10 }}
                                        className="text-5xl"
                                    >
                                        {emojis[activeRating - 1]}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Stars */}
                            <div className="flex gap-2" dir="ltr">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-colors"
                                    >
                                        <Star
                                            size={36}
                                            className={`transition-all duration-200 ${
                                                star <= activeRating
                                                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]'
                                                    : 'text-slate-300'
                                            }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Label */}
                            <AnimatePresence>
                                {activeRating > 0 && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-bold text-slate-600"
                                    >
                                        {labels[activeRating - 1]}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Optional Comment */}
                        {rating > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                {!showComment ? (
                                    <button
                                        onClick={() => setShowComment(true)}
                                        className="mx-auto flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                                    >
                                        <MessageSquare size={16} /> أضف ملاحظة (اختياري)
                                    </button>
                                ) : (
                                    <motion.textarea
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="أخبرنا بالمزيد... (اختياري)"
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                                    />
                                )}

                                {/* Submit */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={sending}
                                    className="w-full py-3 bg-gradient-to-l from-primary to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} /> إرسال التقييم
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FeedbackWidget;
