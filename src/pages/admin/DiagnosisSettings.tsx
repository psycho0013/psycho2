import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, AlertTriangle, Activity, HeartPulse } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface ChronicDiseaseCorrelation {
    id: string;
    chronic_disease: string;
    chronic_disease_ar: string;
    related_conditions: string[];
    related_conditions_ar: string[];
    symptoms_to_watch: string[];
    symptoms_to_watch_ar: string[];
    risk_increase_factor: number;
    notes?: string;
}

interface SymptomSeverityRule {
    id: string;
    symptom_id?: string;
    symptom_name: string;
    symptom_name_ar: string;
    severity_level: 'mild' | 'moderate' | 'severe';
    urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
    possible_conditions: string[];
    possible_conditions_ar: string[];
    recommended_action: string;
    recommended_action_ar: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// إدارة إعدادات التشخيص الذكي
// ═══════════════════════════════════════════════════════════════════════════

const DiagnosisSettings = () => {
    const [activeTab, setActiveTab] = useState<'chronic' | 'severity'>('chronic');

    // Chronic Disease Correlations
    const [chronicList, setChronicList] = useState<ChronicDiseaseCorrelation[]>([]);
    const [chronicEditing, setChronicEditing] = useState(false);
    const [chronicEditingId, setChronicEditingId] = useState<string | null>(null);
    const [chronicForm, setChronicForm] = useState<Partial<ChronicDiseaseCorrelation>>({
        chronic_disease: '',
        chronic_disease_ar: '',
        related_conditions: [''],
        related_conditions_ar: [''],
        symptoms_to_watch: [''],
        symptoms_to_watch_ar: [''],
        risk_increase_factor: 1.5,
        notes: ''
    });

    // Severity Rules
    const [severityList, setSeverityList] = useState<SymptomSeverityRule[]>([]);
    const [severityEditing, setSeverityEditing] = useState(false);
    const [severityEditingId, setSeverityEditingId] = useState<string | null>(null);
    const [severityForm, setSeverityForm] = useState<Partial<SymptomSeverityRule>>({
        symptom_name: '',
        symptom_name_ar: '',
        severity_level: 'moderate',
        urgency_level: 'MEDIUM',
        possible_conditions: [''],
        possible_conditions_ar: [''],
        recommended_action: '',
        recommended_action_ar: ''
    });

    const [loading, setLoading] = useState(true);

    // ═══════════════════════════════════════════════════════════════════════
    // Load Data
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [chronicResult, severityResult] = await Promise.all([
                supabase.from('chronic_disease_correlations').select('*').order('chronic_disease_ar'),
                supabase.from('symptom_severity_rules').select('*').order('symptom_name_ar')
            ]);

            if (chronicResult.data) setChronicList(chronicResult.data);
            if (severityResult.data) setSeverityList(severityResult.data);
        } catch (error) {
            console.error('Error loading diagnosis settings:', error);
        }
        setLoading(false);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Chronic Disease CRUD
    // ═══════════════════════════════════════════════════════════════════════

    const handleChronicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSave = {
            ...chronicForm,
            related_conditions: chronicForm.related_conditions?.filter(c => c.trim()),
            related_conditions_ar: chronicForm.related_conditions_ar?.filter(c => c.trim()),
            symptoms_to_watch: chronicForm.symptoms_to_watch?.filter(s => s.trim()),
            symptoms_to_watch_ar: chronicForm.symptoms_to_watch_ar?.filter(s => s.trim()),
        };

        if (chronicEditingId) {
            const { error } = await supabase
                .from('chronic_disease_correlations')
                .update(dataToSave)
                .eq('id', chronicEditingId);
            if (error) {
                alert('حدث خطأ: ' + error.message);
                return;
            }
        } else {
            const { error } = await supabase
                .from('chronic_disease_correlations')
                .insert(dataToSave);
            if (error) {
                alert('حدث خطأ: ' + error.message);
                return;
            }
        }

        await loadData();
        resetChronicForm();
    };

    const handleChronicEdit = (item: ChronicDiseaseCorrelation) => {
        setChronicForm({
            ...item,
            related_conditions: item.related_conditions?.length ? item.related_conditions : [''],
            related_conditions_ar: item.related_conditions_ar?.length ? item.related_conditions_ar : [''],
            symptoms_to_watch: item.symptoms_to_watch?.length ? item.symptoms_to_watch : [''],
            symptoms_to_watch_ar: item.symptoms_to_watch_ar?.length ? item.symptoms_to_watch_ar : [''],
        });
        setChronicEditingId(item.id);
        setChronicEditing(true);
    };

    const handleChronicDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المرض المزمن؟')) return;

        const { error } = await supabase
            .from('chronic_disease_correlations')
            .delete()
            .eq('id', id);

        if (error) {
            alert('حدث خطأ: ' + error.message);
        } else {
            await loadData();
        }
    };

    const resetChronicForm = () => {
        setChronicForm({
            chronic_disease: '',
            chronic_disease_ar: '',
            related_conditions: [''],
            related_conditions_ar: [''],
            symptoms_to_watch: [''],
            symptoms_to_watch_ar: [''],
            risk_increase_factor: 1.5,
            notes: ''
        });
        setChronicEditing(false);
        setChronicEditingId(null);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Severity Rules CRUD
    // ═══════════════════════════════════════════════════════════════════════

    const handleSeveritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSave = {
            ...severityForm,
            possible_conditions: severityForm.possible_conditions?.filter(c => c.trim()),
            possible_conditions_ar: severityForm.possible_conditions_ar?.filter(c => c.trim()),
        };

        if (severityEditingId) {
            const { error } = await supabase
                .from('symptom_severity_rules')
                .update(dataToSave)
                .eq('id', severityEditingId);
            if (error) {
                alert('حدث خطأ: ' + error.message);
                return;
            }
        } else {
            const { error } = await supabase
                .from('symptom_severity_rules')
                .insert(dataToSave);
            if (error) {
                alert('حدث خطأ: ' + error.message);
                return;
            }
        }

        await loadData();
        resetSeverityForm();
    };

    const handleSeverityEdit = (item: SymptomSeverityRule) => {
        setSeverityForm({
            ...item,
            possible_conditions: item.possible_conditions?.length ? item.possible_conditions : [''],
            possible_conditions_ar: item.possible_conditions_ar?.length ? item.possible_conditions_ar : [''],
        });
        setSeverityEditingId(item.id);
        setSeverityEditing(true);
    };

    const handleSeverityDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذه القاعدة؟')) return;

        const { error } = await supabase
            .from('symptom_severity_rules')
            .delete()
            .eq('id', id);

        if (error) {
            alert('حدث خطأ: ' + error.message);
        } else {
            await loadData();
        }
    };

    const resetSeverityForm = () => {
        setSeverityForm({
            symptom_name: '',
            symptom_name_ar: '',
            severity_level: 'moderate',
            urgency_level: 'MEDIUM',
            possible_conditions: [''],
            possible_conditions_ar: [''],
            recommended_action: '',
            recommended_action_ar: ''
        });
        setSeverityEditing(false);
        setSeverityEditingId(null);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Array Field Helpers
    // ═══════════════════════════════════════════════════════════════════════

    const updateArrayField = (
        formSetter: React.Dispatch<React.SetStateAction<any>>,
        field: string,
        index: number,
        value: string
    ) => {
        formSetter((prev: any) => {
            const arr = [...(prev[field] || [])];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };

    const addArrayItem = (formSetter: React.Dispatch<React.SetStateAction<any>>, field: string) => {
        formSetter((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), '']
        }));
    };

    const removeArrayItem = (formSetter: React.Dispatch<React.SetStateAction<any>>, field: string, index: number) => {
        formSetter((prev: any) => ({
            ...prev,
            [field]: (prev[field] || []).filter((_: any, i: number) => i !== index)
        }));
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Urgency Badge Colors
    // ═══════════════════════════════════════════════════════════════════════

    const getUrgencyBadge = (level: string) => {
        switch (level) {
            case 'EMERGENCY':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'HIGH':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'MEDIUM':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            default:
                return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    const getSeverityBadge = (level: string) => {
        switch (level) {
            case 'severe':
                return 'bg-red-100 text-red-700';
            case 'moderate':
                return 'bg-amber-100 text-amber-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">إعدادات التشخيص الذكي</h2>
                <p className="text-slate-500">إدارة علاقات الأمراض المزمنة وقواعد شدة الأعراض</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('chronic')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'chronic'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <HeartPulse size={18} />
                        <span>الأمراض المزمنة</span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{chronicList.length}</span>
                    </div>
                    {activeTab === 'chronic' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('severity')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'severity'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={18} />
                        <span>قواعد شدة الأعراض</span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{severityList.length}</span>
                    </div>
                    {activeTab === 'severity' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════════
                Chronic Disease Correlations Tab
            ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'chronic' && (
                <div className="space-y-4">
                    {!chronicEditing && (
                        <button
                            onClick={() => setChronicEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                        >
                            <Plus size={20} />
                            إضافة مرض مزمن جديد
                        </button>
                    )}

                    {chronicEditing && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {chronicEditingId ? 'تعديل المرض المزمن' : 'إضافة مرض مزمن جديد'}
                                </h3>
                                <button onClick={resetChronicForm} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleChronicSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم المرض (عربي)</label>
                                        <input
                                            type="text"
                                            value={chronicForm.chronic_disease_ar}
                                            onChange={(e) => setChronicForm({ ...chronicForm, chronic_disease_ar: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                            placeholder="مثل: السكري"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم المرض (English)</label>
                                        <input
                                            type="text"
                                            value={chronicForm.chronic_disease}
                                            onChange={(e) => setChronicForm({ ...chronicForm, chronic_disease: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                            placeholder="e.g., diabetes"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">عامل زيادة الخطر</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={chronicForm.risk_increase_factor}
                                        onChange={(e) => setChronicForm({ ...chronicForm, risk_increase_factor: parseFloat(e.target.value) })}
                                        className="w-32 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                    />
                                    <span className="text-xs text-slate-500 mr-2">× (1.0 - 5.0)</span>
                                </div>

                                {/* Related Conditions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">المضاعفات المحتملة (عربي)</label>
                                        {chronicForm.related_conditions_ar?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setChronicForm, 'related_conditions_ar', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="مثل: اعتلال الأعصاب السكري"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setChronicForm, 'related_conditions_ar', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setChronicForm, 'related_conditions_ar')} className="text-sm text-primary hover:underline">
                                            + إضافة مضاعفة
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">المضاعفات (English)</label>
                                        {chronicForm.related_conditions?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setChronicForm, 'related_conditions', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="e.g., Diabetic Neuropathy"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setChronicForm, 'related_conditions', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setChronicForm, 'related_conditions')} className="text-sm text-primary hover:underline">
                                            + Add condition
                                        </button>
                                    </div>
                                </div>

                                {/* Symptoms to Watch */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">أعراض يجب مراقبتها (عربي)</label>
                                        {chronicForm.symptoms_to_watch_ar?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setChronicForm, 'symptoms_to_watch_ar', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="مثل: تنميل"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setChronicForm, 'symptoms_to_watch_ar', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setChronicForm, 'symptoms_to_watch_ar')} className="text-sm text-primary hover:underline">
                                            + إضافة عرض
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms to Watch (English)</label>
                                        {chronicForm.symptoms_to_watch?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setChronicForm, 'symptoms_to_watch', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="e.g., numbness"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setChronicForm, 'symptoms_to_watch', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setChronicForm, 'symptoms_to_watch')} className="text-sm text-primary hover:underline">
                                            + Add symptom
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات</label>
                                    <textarea
                                        value={chronicForm.notes || ''}
                                        onChange={(e) => setChronicForm({ ...chronicForm, notes: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                                        placeholder="ملاحظات إضافية..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                        <Save size={20} />
                                        حفظ
                                    </button>
                                    <button type="button" onClick={resetChronicForm} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* List */}
                    <div className="grid grid-cols-1 gap-4">
                        {chronicList.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <HeartPulse className="text-rose-500" size={20} />
                                            <h3 className="text-lg font-bold text-slate-800">{item.chronic_disease_ar}</h3>
                                            <span className="text-sm text-slate-400">({item.chronic_disease})</span>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">خطر ×{item.risk_increase_factor}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 mb-1">المضاعفات المحتملة:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.related_conditions_ar?.slice(0, 3).map((c, i) => (
                                                        <span key={i} className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">{c}</span>
                                                    ))}
                                                    {(item.related_conditions_ar?.length || 0) > 3 && (
                                                        <span className="text-xs text-slate-400">+{(item.related_conditions_ar?.length || 0) - 3}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 mb-1">أعراض للمراقبة:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.symptoms_to_watch_ar?.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{s}</span>
                                                    ))}
                                                    {(item.symptoms_to_watch_ar?.length || 0) > 3 && (
                                                        <span className="text-xs text-slate-400">+{(item.symptoms_to_watch_ar?.length || 0) - 3}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleChronicEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleChronicDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {chronicList.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                لا توجد أمراض مزمنة مسجلة. اضغط "إضافة مرض مزمن جديد" للبدء.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════════
                Severity Rules Tab
            ═══════════════════════════════════════════════════════════════════════ */}
            {activeTab === 'severity' && (
                <div className="space-y-4">
                    {!severityEditing && (
                        <button
                            onClick={() => setSeverityEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                        >
                            <Plus size={20} />
                            إضافة قاعدة شدة جديدة
                        </button>
                    )}

                    {severityEditing && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {severityEditingId ? 'تعديل قاعدة الشدة' : 'إضافة قاعدة شدة جديدة'}
                                </h3>
                                <button onClick={resetSeverityForm} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSeveritySubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم العرض (عربي)</label>
                                        <input
                                            type="text"
                                            value={severityForm.symptom_name_ar}
                                            onChange={(e) => setSeverityForm({ ...severityForm, symptom_name_ar: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                            placeholder="مثل: ألم الصدر"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم العرض (English)</label>
                                        <input
                                            type="text"
                                            value={severityForm.symptom_name}
                                            onChange={(e) => setSeverityForm({ ...severityForm, symptom_name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                            placeholder="e.g., chest_pain"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">مستوى الشدة</label>
                                        <select
                                            value={severityForm.severity_level}
                                            onChange={(e) => setSeverityForm({ ...severityForm, severity_level: e.target.value as any })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        >
                                            <option value="mild">خفيف (Mild)</option>
                                            <option value="moderate">متوسط (Moderate)</option>
                                            <option value="severe">شديد (Severe)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">مستوى الطوارئ</label>
                                        <select
                                            value={severityForm.urgency_level}
                                            onChange={(e) => setSeverityForm({ ...severityForm, urgency_level: e.target.value as any })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none"
                                        >
                                            <option value="LOW">منخفض (LOW)</option>
                                            <option value="MEDIUM">متوسط (MEDIUM)</option>
                                            <option value="HIGH">عالي (HIGH)</option>
                                            <option value="EMERGENCY">طوارئ (EMERGENCY)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Possible Conditions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">الحالات المحتملة (عربي)</label>
                                        {severityForm.possible_conditions_ar?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setSeverityForm, 'possible_conditions_ar', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="مثل: نوبة قلبية"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setSeverityForm, 'possible_conditions_ar', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setSeverityForm, 'possible_conditions_ar')} className="text-sm text-primary hover:underline">
                                            + إضافة حالة
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Possible Conditions (English)</label>
                                        {severityForm.possible_conditions?.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => updateArrayField(setSeverityForm, 'possible_conditions', idx, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm"
                                                    placeholder="e.g., Heart Attack"
                                                />
                                                <button type="button" onClick={() => removeArrayItem(setSeverityForm, 'possible_conditions', idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addArrayItem(setSeverityForm, 'possible_conditions')} className="text-sm text-primary hover:underline">
                                            + Add condition
                                        </button>
                                    </div>
                                </div>

                                {/* Recommended Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">الإجراء الموصى (عربي)</label>
                                        <textarea
                                            value={severityForm.recommended_action_ar}
                                            onChange={(e) => setSeverityForm({ ...severityForm, recommended_action_ar: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                                            placeholder="مثل: اتصل بالطوارئ فوراً"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Recommended Action (English)</label>
                                        <textarea
                                            value={severityForm.recommended_action}
                                            onChange={(e) => setSeverityForm({ ...severityForm, recommended_action: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-20 resize-none"
                                            placeholder="e.g., Call emergency services immediately"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                        <Save size={20} />
                                        حفظ
                                    </button>
                                    <button type="button" onClick={resetSeverityForm} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* List */}
                    <div className="grid grid-cols-1 gap-4">
                        {severityList.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Activity className="text-amber-500" size={20} />
                                            <h3 className="text-lg font-bold text-slate-800">{item.symptom_name_ar}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadge(item.severity_level)}`}>
                                                {item.severity_level === 'mild' ? 'خفيف' : item.severity_level === 'moderate' ? 'متوسط' : 'شديد'}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyBadge(item.urgency_level)}`}>
                                                {item.urgency_level === 'EMERGENCY' ? '🚨 طوارئ' : item.urgency_level === 'HIGH' ? '⚠️ عالي' : item.urgency_level === 'MEDIUM' ? 'متوسط' : 'منخفض'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">{item.recommended_action_ar}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {item.possible_conditions_ar?.map((c, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSeverityEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleSeverityDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {severityList.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                لا توجد قواعد شدة مسجلة. اضغط "إضافة قاعدة شدة جديدة" للبدء.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosisSettings;
