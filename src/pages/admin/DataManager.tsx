import { useState } from 'react';
import { Download, Upload, Save, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const DataManager = () => {
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const exportData = () => {
        try {
            const data = {
                content: localStorage.getItem('phy_site_content'),
                diseases: localStorage.getItem('phy_diseases'),
                treatments: localStorage.getItem('phy_treatments'),
                directory: localStorage.getItem('phy_directory'),
                timestamp: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `phy-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStatus({ type: 'success', message: 'تم تصدير البيانات بنجاح!' });
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: 'حدث خطأ أثناء تصدير البيانات' });
        }
    };

    const exportToDataFiles = () => {
        try {
            // Export content
            const content = localStorage.getItem('phy_site_content');
            if (content) {
                const contentData = JSON.parse(content);

                // Export each section as separate file
                ['home', 'about', 'contact'].forEach(section => {
                    if (contentData[section]) {
                        const blob = new Blob([
                            `export const ${section}Content = ${JSON.stringify(contentData[section], null, 2)};`
                        ], { type: 'text/typescript' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${section}.ts`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }
                });
            }

            // Export diseases
            const diseases = localStorage.getItem('phy_diseases');
            if (diseases) {
                const blob = new Blob([
                    `export interface Disease {\n    id: string;\n    name: string;\n    description: string;\n    symptoms: string[];\n    treatments: string[];\n    prevention: string[];\n    causes: string[];\n    complications: string[];\n    diagnosis_method: string;\n}\n\nexport const diseases: Disease[] = ${JSON.stringify(JSON.parse(diseases), null, 4)};`
                ], { type: 'text/typescript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diseases.ts';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            // Export treatments
            const treatments = localStorage.getItem('phy_treatments');
            if (treatments) {
                const blob = new Blob([
                    `export interface Treatment {\n    id: string;\n    name: string;\n    description: string;\n    type: 'دواء' | 'نمط حياة' | 'إجراء طبي';\n    dosage?: string;\n    side_effects?: string[];\n    precautions?: string[];\n    instructions?: string;\n    duration?: string;\n}\n\nexport const treatments: Treatment[] = ${JSON.stringify(JSON.parse(treatments), null, 4)};`
                ], { type: 'text/typescript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'treatments.ts';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            // Export directory
            const directory = localStorage.getItem('phy_directory');
            if (directory) {
                const blob = new Blob([
                    `export interface DirectoryItem {\n    id: string;\n    title: string;\n    category: 'hospital' | 'clinic' | 'pharmacy' | 'device' | 'maintenance';\n    image: string;\n    description: string;\n    phone: string;\n    location: string;\n    address: string;\n    rating: number;\n    features: string[];\n    workHours: string;\n}\n\nexport const directoryItems: DirectoryItem[] = ${JSON.stringify(JSON.parse(directory), null, 4)};`
                ], { type: 'text/typescript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'directory.ts';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            setStatus({ type: 'success', message: 'تم تصدير الملفات بنجاح! قم باستبدال الملفات في مجلد src/data' });
            setTimeout(() => setStatus({ type: null, message: '' }), 5000);
        } catch (error) {
            setStatus({ type: 'error', message: 'حدث خطأ أثناء تصدير الملفات' });
        }
    };

    const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);

                if (data.content) localStorage.setItem('phy_site_content', data.content);
                if (data.diseases) localStorage.setItem('phy_diseases', data.diseases);
                if (data.treatments) localStorage.setItem('phy_treatments', data.treatments);
                if (data.directory) localStorage.setItem('phy_directory', data.directory);

                // Trigger content update event
                window.dispatchEvent(new Event('content-updated'));

                setStatus({ type: 'success', message: 'تم استيراد البيانات بنجاح!' });
                setTimeout(() => {
                    setStatus({ type: null, message: '' });
                    window.location.reload();
                }, 2000);
            } catch (error) {
                setStatus({ type: 'error', message: 'خطأ في قراءة الملف. تأكد من أنه ملف نسخ احتياطي صحيح.' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">إدارة البيانات</h2>
                <p className="text-slate-500">تصدير واستيراد بيانات الموقع</p>
            </div>

            {status.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Backup */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                        <Download size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">تصدير نسخة احتياطية</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        احفظ جميع بيانات الموقع في ملف واحد للنسخ الاحتياطي
                    </p>
                    <button
                        onClick={exportData}
                        className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        تصدير كملف JSON
                    </button>
                </div>

                {/* Export to Files */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                        <FileText size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">تصدير ملفات TypeScript</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        احفظ البيانات كملفات .ts لاستبدال ملفات src/data
                    </p>
                    <button
                        onClick={exportToDataFiles}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        تصدير الملفات
                    </button>
                </div>

                {/* Import Backup */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <Upload size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">استيراد نسخة احتياطية</h3>
                    <p className="text-slate-500 text-sm mb-4">
                        استعادة البيانات من ملف نسخ احتياطي سابق
                    </p>
                    <label className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <Upload size={18} />
                        استيراد من JSON
                        <input
                            type="file"
                            accept=".json"
                            onChange={importData}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 mb-2">تعليمات هامة</h3>
                    <ul className="text-amber-800 text-sm space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            بعد تصدير ملفات TypeScript، استبدل الملفات في <code className="bg-amber-100 px-1 rounded">src/data</code>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            قم بعمل نسخة احتياطية قبل رفع المشروع للاستضافة
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            استخدم استيراد JSON لاستعادة البيانات بسرعة
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DataManager;
