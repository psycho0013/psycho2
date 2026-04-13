import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, RefreshCw, MessageSquare, Brain } from 'lucide-react';

interface Feedback {
    id: string;
    rating: number;
    comment: string | null;
    disease_name: string | null;
    confidence_score: number | null;
    created_at: string;
}

const FeedbackManager = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('diagnosis_feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching feedbacks:', error);
        } else {
            setFeedbacks(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Star className="text-amber-400 group-hover:rotate-12 transition-transform" size={28} /> تقييمات التشخيص
                    </h1>
                    <p className="text-slate-500 mt-1">عرض آراء وتقييمات المستخدمين لنتائج التشخيص</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                            <Star size={20} className="fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold">متوسط التقييم</p>
                            <p className="text-xl font-bold text-slate-800">{averageRating} <span className="text-sm text-slate-400">/ 5</span></p>
                        </div>
                    </div>
                    <button onClick={fetchFeedbacks} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600" title="تحديث">
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <RefreshCw size={24} className="animate-spin mb-2" />
                        <p>جاري تحميل التقييمات...</p>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <MessageSquare size={48} className="mb-4 opacity-30" />
                        <p className="font-bold text-lg">لا توجد تقييمات بعد</p>
                        <p className="text-sm mt-1">بمجرد قيام المرضى بالتقييم ستظهر نتائجهم هنا.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {feedbacks.map((f) => (
                            <div key={f.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 items-start">
                                {/* Rating Stars */}
                                <div className="shrink-0 flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full md:w-32">
                                    <div className="flex items-center gap-1 mb-2" dir="ltr">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                size={16} 
                                                className={star <= f.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} 
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-xl text-slate-800">{f.rating}<span className="text-xs text-slate-400">/5</span></span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 space-y-3">
                                    {f.disease_name && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-bold border border-blue-100">
                                            <Brain size={16} /> 
                                            النتيجة كانت: {f.disease_name}
                                            {f.confidence_score !== null && (
                                                <span className="opacity-70 font-normal">
                                                    (دقة {f.confidence_score}%)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {f.comment ? (
                                        <p className="text-slate-700 leading-relaxed bg-white border border-slate-100 p-4 rounded-xl shadow-sm italic">
                                            "{f.comment}"
                                        </p>
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">بدون تعليق إضافي.</p>
                                    )}
                                    
                                    <div className="text-xs text-slate-400 font-medium">
                                        تاريخ التقييم: {new Date(f.created_at).toLocaleString('ar-IQ')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackManager;
