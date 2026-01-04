/**
 * Dental Problems Manager - Admin Page
 * صفحة إدارة مشاكل الأسنان
 */

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, X, AlertTriangle, Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';
import type { DentalProblem, DentalSymptom, UrgencyLevel, SeverityLevel } from '@/types/dental';
import DentalDbManager from '@/services/dentalDbManager';

const urgencyOptions: { id: UrgencyLevel; name: string; color: string }[] = [
    { id: 'emergency', name: 'طوارئ 🚨', color: 'bg-red-500 text-white' },
    { id: 'urgent', name: 'عاجل ⚠️', color: 'bg-orange-500 text-white' },
    { id: 'important', name: 'مهم 📋', color: 'bg-yellow-500 text-gray-900' },
    { id: 'routine', name: 'روتيني ✅', color: 'bg-green-500 text-white' },
];

const DentalProblemsManager = () => {
    const [problemsList, setProblemsList] = useState<DentalProblem[]>([]);
    const [symptomsList, setSymptomsList] = useState<DentalSymptom[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
    const [currentProblem, setCurrentProblem] = useState<Partial<DentalProblem>>({
        id: '',
        name: '',
        name_en: '',
        description: '',
        symptoms: [],
        symptom_weights: {},
        severity_levels: [],
        urgency: 'routine',
        urgency_message: '',
        treatments: [],
        prevention: [],
        emergency_signs: [],
        warning: ''
    });
    const [loading, setLoading] = useState(true);

    // Temp inputs
    const [newTreatment, setNewTreatment] = useState('');
    const [newPrevention, setNewPrevention] = useState('');
    const [newEmergencySign, setNewEmergencySign] = useState('');
    const [newSeverity, setNewSeverity] = useState({ level: '', description: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [problems, symptoms] = await Promise.all([
            DentalDbManager.getDentalProblems(),
            DentalDbManager.getDentalSymptoms()
        ]);
        setProblemsList(problems);
        setSymptomsList(symptoms);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentProblem.name || !currentProblem.name_en || !currentProblem.description) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        const problemToSave: DentalProblem = {
            id: currentProblem.id || `problem_${Date.now()}`,
            name: currentProblem.name!,
            name_en: currentProblem.name_en!,
            description: currentProblem.description!,
            symptoms: currentProblem.symptoms || [],
            symptom_weights: currentProblem.symptom_weights || {},
            severity_levels: currentProblem.severity_levels || [],
            urgency: currentProblem.urgency as UrgencyLevel || 'routine',
            urgency_message: currentProblem.urgency_message || '',
            treatments: currentProblem.treatments || [],
            prevention: currentProblem.prevention || [],
            emergency_signs: currentProblem.emergency_signs,
            warning: currentProblem.warning
        };

        const success = await DentalDbManager.saveDentalProblem(problemToSave);
        if (success) {
            await loadData();
            setIsEditing(false);
            resetForm();
        } else {
            alert('حدث خطأ أثناء حفظ المشكلة');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المشكلة؟')) {
            const success = await DentalDbManager.deleteDentalProblem(id);
            if (success) {
                await loadData();
            } else {
                alert('حدث خطأ أثناء حذف المشكلة');
            }
        }
    };

    const startEdit = (problem: DentalProblem) => {
        setCurrentProblem({ ...problem });
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentProblem({
            id: '',
            name: '',
            name_en: '',
            description: '',
            symptoms: [],
            symptom_weights: {},
            severity_levels: [],
            urgency: 'routine',
            urgency_message: '',
            treatments: [],
            prevention: [],
            emergency_signs: [],
            warning: ''
        });
        setNewTreatment('');
        setNewPrevention('');
        setNewEmergencySign('');
        setNewSeverity({ level: '', description: '' });
    };

    // Symptom selection
    const toggleSymptom = (symptomId: string) => {
        const current = currentProblem.symptoms || [];
        const weights = currentProblem.symptom_weights || {};

        if (current.includes(symptomId)) {
            setCurrentProblem({
                ...currentProblem,
                symptoms: current.filter(s => s !== symptomId),
                symptom_weights: Object.fromEntries(
                    Object.entries(weights).filter(([k]) => k !== symptomId)
                )
            });
        } else {
            setCurrentProblem({
                ...currentProblem,
                symptoms: [...current, symptomId],
                symptom_weights: { ...weights, [symptomId]: 50 }
            });
        }
    };

    const updateWeight = (symptomId: string, weight: number) => {
        setCurrentProblem({
            ...currentProblem,
            symptom_weights: {
                ...currentProblem.symptom_weights,
                [symptomId]: weight
            }
        });
    };

    // List helpers
    const addToList = (field: 'treatments' | 'prevention' | 'emergency_signs', value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setCurrentProblem({
            ...currentProblem,
            [field]: [...(currentProblem[field] || []), value.trim()]
        });
        setter('');
    };

    const removeFromList = (field: 'treatments' | 'prevention' | 'emergency_signs', index: number) => {
        setCurrentProblem({
            ...currentProblem,
            [field]: (currentProblem[field] || []).filter((_, i) => i !== index)
        });
    };

    const addSeverity = () => {
        if (!newSeverity.level || !newSeverity.description) return;
        setCurrentProblem({
            ...currentProblem,
            severity_levels: [...(currentProblem.severity_levels || []), newSeverity as SeverityLevel]
        });
        setNewSeverity({ level: '', description: '' });
    };

    const removeSeverity = (index: number) => {
        setCurrentProblem({
            ...currentProblem,
            severity_levels: (currentProblem.severity_levels || []).filter((_, i) => i !== index)
        });
    };

    const getUrgencyBadge = (urgency: UrgencyLevel) => {
        const opt = urgencyOptions.find(o => o.id === urgency);
        return opt ? <span className={`px-2 py-1 rounded text-xs font-bold ${opt.color}`}>{opt.name}</span> : null;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        <Stethoscope size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">إدارة مشاكل الأسنان</h1>
                        <p className="text-slate-500">إضافة وتعديل المشاكل والتشخيصات</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsEditing(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    مشكلة جديدة
                </button>
            </div>

            {/* Form */}
            {isEditing && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">
                            {currentProblem.id ? 'تعديل مشكلة' : 'إضافة مشكلة جديدة'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">اسم المشكلة (عربي) *</label>
                            <input
                                type="text"
                                value={currentProblem.name}
                                onChange={(e) => setCurrentProblem({ ...currentProblem, name: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="مثال: تسوس الأسنان"
                                dir="rtl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Problem Name (English) *</label>
                            <input
                                type="text"
                                value={currentProblem.name_en}
                                onChange={(e) => setCurrentProblem({ ...currentProblem, name_en: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                                placeholder="Ex: Dental Caries"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">الوصف *</label>
                            <textarea
                                value={currentProblem.description}
                                onChange={(e) => setCurrentProblem({ ...currentProblem, description: e.target.value })}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none resize-none"
                                rows={2}
                                dir="rtl"
                            />
                        </div>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">مستوى الإلحاح</label>
                        <div className="flex flex-wrap gap-2">
                            {urgencyOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setCurrentProblem({ ...currentProblem, urgency: opt.id })}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentProblem.urgency === opt.id
                                            ? opt.color + ' ring-2 ring-offset-2'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={currentProblem.urgency_message}
                            onChange={(e) => setCurrentProblem({ ...currentProblem, urgency_message: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary outline-none mt-2"
                            placeholder="رسالة الإلحاح للمريض..."
                            dir="rtl"
                        />
                    </div>

                    {/* Symptoms Selection with Weights */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">الأعراض المرتبطة (مع الأوزان)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-50 rounded-xl">
                            {symptomsList.length === 0 ? (
                                <p className="text-slate-400 text-sm col-span-full text-center py-4">
                                    لا توجد أعراض مسجلة - أضف الأعراض أولاً من صفحة إدارة الأعراض
                                </p>
                            ) : (
                                symptomsList.map(symptom => {
                                    const isSelected = currentProblem.symptoms?.includes(symptom.id);
                                    return (
                                        <div
                                            key={symptom.id}
                                            className={`p-3 rounded-lg border transition-all ${isSelected
                                                    ? 'bg-primary/10 border-primary'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSymptom(symptom.id)}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <span className="text-sm font-medium text-slate-700">{symptom.name}</span>
                                            </label>
                                            {isSelected && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={currentProblem.symptom_weights?.[symptom.id] || 50}
                                                        onChange={(e) => updateWeight(symptom.id, parseInt(e.target.value))}
                                                        className="flex-1 accent-primary"
                                                    />
                                                    <span className="text-xs font-bold text-primary w-8">
                                                        {currentProblem.symptom_weights?.[symptom.id] || 50}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Severity Levels */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">مستويات الشدة</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSeverity.level}
                                onChange={(e) => setNewSeverity({ ...newSeverity, level: e.target.value })}
                                className="w-32 p-2 rounded-lg border border-slate-200"
                                placeholder="المستوى"
                                dir="rtl"
                            />
                            <input
                                type="text"
                                value={newSeverity.description}
                                onChange={(e) => setNewSeverity({ ...newSeverity, description: e.target.value })}
                                className="flex-1 p-2 rounded-lg border border-slate-200"
                                placeholder="الوصف"
                                dir="rtl"
                            />
                            <button onClick={addSeverity} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200">إضافة</button>
                        </div>
                        <div className="space-y-1">
                            {currentProblem.severity_levels?.map((s, i) => (
                                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                                    <span className="font-bold text-slate-700">{s.level}:</span>
                                    <span className="flex-1 text-sm text-slate-600">{s.description}</span>
                                    <button onClick={() => removeSeverity(i)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Treatments */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">العلاجات</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTreatment}
                                onChange={(e) => setNewTreatment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addToList('treatments', newTreatment, setNewTreatment)}
                                className="flex-1 p-2 rounded-lg border border-slate-200"
                                placeholder="أضف علاج..."
                                dir="rtl"
                            />
                            <button onClick={() => addToList('treatments', newTreatment, setNewTreatment)} className="px-4 py-2 bg-slate-100 rounded-lg">إضافة</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentProblem.treatments?.map((t, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                                    {t}
                                    <button onClick={() => removeFromList('treatments', i)} className="hover:text-blue-900"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">الوقاية</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPrevention}
                                onChange={(e) => setNewPrevention(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addToList('prevention', newPrevention, setNewPrevention)}
                                className="flex-1 p-2 rounded-lg border border-slate-200"
                                placeholder="أضف نصيحة وقاية..."
                                dir="rtl"
                            />
                            <button onClick={() => addToList('prevention', newPrevention, setNewPrevention)} className="px-4 py-2 bg-slate-100 rounded-lg">إضافة</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentProblem.prevention?.map((p, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                                    {p}
                                    <button onClick={() => removeFromList('prevention', i)} className="hover:text-green-900"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Signs */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">علامات الطوارئ (اختياري)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newEmergencySign}
                                onChange={(e) => setNewEmergencySign(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addToList('emergency_signs', newEmergencySign, setNewEmergencySign)}
                                className="flex-1 p-2 rounded-lg border border-slate-200"
                                placeholder="علامة طوارئ..."
                                dir="rtl"
                            />
                            <button onClick={() => addToList('emergency_signs', newEmergencySign, setNewEmergencySign)} className="px-4 py-2 bg-slate-100 rounded-lg">إضافة</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentProblem.emergency_signs?.map((e, i) => (
                                <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                                    🚨 {e}
                                    <button onClick={() => removeFromList('emergency_signs', i)} className="hover:text-red-900"><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">تحذير (اختياري)</label>
                        <input
                            type="text"
                            value={currentProblem.warning || ''}
                            onChange={(e) => setCurrentProblem({ ...currentProblem, warning: e.target.value })}
                            className="w-full p-3 rounded-xl border border-red-200 focus:border-red-400 outline-none bg-red-50"
                            placeholder="رسالة تحذيرية..."
                            dir="rtl"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-xl">إلغاء</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center gap-2">
                            <Save size={18} />
                            حفظ
                        </button>
                    </div>
                </div>
            )}

            {/* Problems List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
                ) : problemsList.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                        <AlertTriangle className="mx-auto text-amber-400 mb-2" size={40} />
                        <p className="text-slate-500">لا توجد مشاكل مسجلة</p>
                        <p className="text-xs text-slate-400">اضغط "مشكلة جديدة" للبدء</p>
                    </div>
                ) : (
                    problemsList.map(problem => (
                        <div key={problem.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                                onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
                            >
                                <div className="flex items-center gap-4">
                                    {getUrgencyBadge(problem.urgency)}
                                    <div>
                                        <h3 className="font-bold text-slate-900">{problem.name}</h3>
                                        <p className="text-sm text-slate-500">{problem.name_en}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); startEdit(problem); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(problem.id); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} />
                                    </button>
                                    {expandedProblem === problem.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                            {expandedProblem === problem.id && (
                                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3 text-sm">
                                    <p><strong>الوصف:</strong> {problem.description}</p>
                                    <p><strong>الأعراض:</strong> {problem.symptoms.length} عرض</p>
                                    <p><strong>العلاجات:</strong> {problem.treatments.join('، ')}</p>
                                    {problem.warning && (
                                        <p className="text-red-600"><strong>⚠️ تحذير:</strong> {problem.warning}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DentalProblemsManager;
