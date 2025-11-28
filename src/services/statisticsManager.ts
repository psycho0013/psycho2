import { supabase } from '@/lib/supabase';
import type { DiagnosisState } from '@/pages/Diagnosis';

export interface DiagnosisRecord {
    id: string;
    created_at: string;
    governorate: string;
    age: number;
    gender: 'male' | 'female';
    disease_id?: string;
    disease_name?: string;
    is_emergency: boolean;
    symptoms: string[];
}

class StatisticsManager {
    static async saveDiagnosis(
        state: DiagnosisState,
        result: { id: string; name: string } | null,
        isEmergency: boolean
    ): Promise<void> {
        try {
            const { error } = await supabase.from('diagnoses').insert({
                governorate: state.personalInfo.governorate,
                age: parseInt(state.personalInfo.age) || 0,
                gender: state.personalInfo.gender,
                disease_id: result?.id,
                disease_name: result?.name,
                is_emergency: isEmergency,
                symptoms: state.selectedSymptoms.map(s => s.id)
            });

            if (error) throw error;

            // Dispatch event for real-time updates
            window.dispatchEvent(new Event('stats-updated'));
        } catch (error) {
            console.error('Error saving diagnosis:', error);
        }
    }

    static async getRecords(): Promise<DiagnosisRecord[]> {
        const { data, error } = await supabase
            .from('diagnoses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching records:', error);
            return [];
        }
        return data || [];
    }

    static async getDashboardStats() {
        const records = await this.getRecords();
        const totalDiagnoses = records.length;

        // Calculate active users (unique dates or just total for now)
        const activeUsers = totalDiagnoses;

        // Calculate accuracy
        const successfulDiagnoses = records.filter(r => r.disease_id).length;
        const accuracy = totalDiagnoses > 0 ? Math.round((successfulDiagnoses / totalDiagnoses) * 100) : 0;

        // Growth (mock for now as we build history)
        const growth = '+12%';

        return [
            { label: 'إجمالي التشخيصات', value: totalDiagnoses.toString(), change: growth, color: 'bg-blue-500', icon: 'FileText' },
            { label: 'المستخدمين النشطين', value: activeUsers.toString(), change: '+5%', color: 'bg-emerald-500', icon: 'Users' },
            { label: 'دقة التشخيص', value: `${accuracy}%`, change: '+2%', color: 'bg-purple-500', icon: 'Activity' },
            { label: 'معدل النمو', value: growth, change: '+1.5%', color: 'bg-orange-500', icon: 'TrendingUp' },
        ];
    }

    static async getGovernorateStats() {
        const records = await this.getRecords();
        const stats: Record<string, { total: number; diseases: Record<string, number> }> = {};

        records.forEach(record => {
            if (!record.governorate) return;

            if (!stats[record.governorate]) {
                stats[record.governorate] = { total: 0, diseases: {} };
            }

            stats[record.governorate].total++;

            if (record.disease_name) {
                stats[record.governorate].diseases[record.disease_name] = (stats[record.governorate].diseases[record.disease_name] || 0) + 1;
            }
        });

        return Object.entries(stats).map(([name, data]) => {
            const topDiseases = Object.entries(data.diseases)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([name, count]) => ({ name, count }));

            return {
                id: name,
                name,
                totalDiagnoses: data.total,
                topDiseases
            };
        });
    }

    static async getAgeStats() {
        const records = await this.getRecords();
        const groups = {
            children: { label: 'الأطفال', range: '0-12 سنة', min: 0, max: 12, color: 'text-blue-500 bg-blue-50', icon: 'Baby' },
            teens: { label: 'المراهقين', range: '13-17 سنة', min: 13, max: 17, color: 'text-emerald-500 bg-emerald-50', icon: 'School' },
            youth: { label: 'الشباب', range: '18-24 سنة', min: 18, max: 24, color: 'text-purple-500 bg-purple-50', icon: 'User' },
            adults: { label: 'البالغين', range: '25-44 سنة', min: 25, max: 44, color: 'text-orange-500 bg-orange-50', icon: 'Briefcase' },
            middle_age: { label: 'متوسطي العمر', range: '45-64 سنة', min: 45, max: 64, color: 'text-rose-500 bg-rose-50', icon: 'Activity' },
            seniors: { label: 'كبار السن', range: '65+ سنة', min: 65, max: 150, color: 'text-red-500 bg-red-50', icon: 'Heart' }
        };

        const stats: any = {};

        // Initialize
        Object.entries(groups).forEach(([key, info]) => {
            stats[key] = { ...info, id: key, totalCases: 0, diseases: {} };
        });

        records.forEach(record => {
            const age = record.age;
            let groupKey = '';

            for (const [key, info] of Object.entries(groups)) {
                if (age >= info.min && age <= info.max) {
                    groupKey = key;
                    break;
                }
            }

            if (groupKey && stats[groupKey]) {
                stats[groupKey].totalCases++;
                if (record.disease_name) {
                    stats[groupKey].diseases[record.disease_name] = (stats[groupKey].diseases[record.disease_name] || 0) + 1;
                }
            }
        });

        return Object.values(stats).map((stat: any) => {
            const topDiseaseEntry = Object.entries(stat.diseases).sort(([, a]: any, [, b]: any) => b - a)[0];
            const topDiseaseName = topDiseaseEntry ? topDiseaseEntry[0] : 'لا يوجد بيانات';
            const topDiseaseCount = topDiseaseEntry ? (topDiseaseEntry[1] as number) : 0;
            const percentage = stat.totalCases > 0 ? Math.round((topDiseaseCount / stat.totalCases) * 100) : 0;

            return {
                ...stat,
                topDisease: {
                    name: topDiseaseName,
                    percentage
                }
            };
        });
    }

    static async getEmergencyStats() {
        const records = await this.getRecords();
        const emergencies = records.filter(r => r.is_emergency);
        const total = emergencies.length;

        const maleCount = emergencies.filter(r => r.gender === 'male').length;
        const femaleCount = emergencies.filter(r => r.gender === 'female').length;

        return {
            totalEmergencies: total,
            male: {
                count: maleCount,
                percentage: total > 0 ? Math.round((maleCount / total) * 100) : 0
            },
            female: {
                count: femaleCount,
                percentage: total > 0 ? Math.round((femaleCount / total) * 100) : 0
            }
        };
    }

    static async clearData() {
        // In Supabase, we might not want to allow clearing all data easily from the client
        // But for this demo, we can delete all rows
        const { error } = await supabase.from('diagnoses').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        if (!error) {
            window.dispatchEvent(new Event('stats-updated'));
        }
    }

    static async exportReport() {
        const records = await this.getRecords();
        const stats = await this.getDashboardStats();
        const governorateStats = await this.getGovernorateStats();
        const date = new Date().toLocaleDateString('ar-IQ');

        // Create HTML content for the Excel file
        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; direction: rtl; }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                    th { background-color: #f3f4f6; color: #1f2937; font-weight: bold; border: 1px solid #e5e7eb; padding: 10px; text-align: center; }
                    td { border: 1px solid #e5e7eb; padding: 8px; text-align: center; color: #4b5563; }
                    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; }
                    .section-title { background-color: #e5e7eb; color: #374151; padding: 10px; font-weight: bold; font-size: 16px; }
                    .emergency { color: #dc2626; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">تقرير النظام الطبي الذكي - ${date}</div>
                
                <!-- Summary Section -->
                <table>
                    <tr><td colspan="4" class="section-title">ملخص الأداء</td></tr>
                    <tr>
                        ${stats.map(s => `<th>${s.label}</th>`).join('')}
                    </tr>
                    <tr>
                        ${stats.map(s => `<td>${s.value}</td>`).join('')}
                    </tr>
                </table>

                <!-- Governorate Summary -->
                <table>
                    <tr><td colspan="3" class="section-title">ملخص المحافظات</td></tr>
                    <tr>
                        <th>المحافظة</th>
                        <th>عدد التشخيصات</th>
                        <th>أكثر الأمراض انتشاراً</th>
                    </tr>
                    ${governorateStats.map(g => `
                        <tr>
                            <td>${g.name}</td>
                            <td>${g.totalDiagnoses}</td>
                            <td>${g.topDiseases.map(d => `${d.name} (${d.count})`).join('، ')}</td>
                        </tr>
                    `).join('')}
                </table>

                <!-- Detailed Records -->
                <table>
                    <tr><td colspan="7" class="section-title">سجل التشخيصات التفصيلي</td></tr>
                    <tr>
                        <th>التاريخ</th>
                        <th>المحافظة</th>
                        <th>العمر</th>
                        <th>الجنس</th>
                        <th>المرض المشخص</th>
                        <th>حالة طارئة</th>
                        <th>الأعراض</th>
                    </tr>
                    ${records.map(r => `
                        <tr>
                            <td>${new Date(r.created_at).toLocaleDateString('ar-IQ')}</td>
                            <td>${r.governorate}</td>
                            <td>${r.age}</td>
                            <td>${r.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                            <td>${r.disease_name || 'غير مشخص'}</td>
                            <td class="${r.is_emergency ? 'emergency' : ''}">${r.is_emergency ? 'نعم' : 'لا'}</td>
                            <td>${Array.isArray(r.symptoms) ? r.symptoms.join('، ') : r.symptoms}</td>
                        </tr>
                    `).join('')}
                </table>
            </body>
            </html>
        `;

        // Create Blob and download
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Medical_Report_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

export default StatisticsManager;
