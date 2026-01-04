/**
 * Dental Data Hook - Database Only (No Fallback)
 * Hook لجلب بيانات الأسنان من قاعدة البيانات فقط
 */

import { useState, useEffect } from 'react';
import type { DentalSymptom, DentalProblem, SymptomCategory } from '@/types/dental';
import DentalDbManager from '@/services/dentalDbManager';

interface UseDentalDataReturn {
    symptoms: DentalSymptom[];
    problems: DentalProblem[];
    categories: { id: SymptomCategory; name: string; icon: string }[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDentalData(): UseDentalDataReturn {
    const [symptoms, setSymptoms] = useState<DentalSymptom[]>([]);
    const [problems, setProblems] = useState<DentalProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = DentalDbManager.getDentalCategories();

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [dbSymptoms, dbProblems] = await Promise.all([
                DentalDbManager.getDentalSymptoms(),
                DentalDbManager.getDentalProblems()
            ]);

            setSymptoms(dbSymptoms);
            setProblems(dbProblems);

            if (dbSymptoms.length === 0 || dbProblems.length === 0) {
                setError('لا توجد بيانات في قاعدة البيانات. يرجى تشغيل Migration أولاً.');
            }
        } catch (err) {
            console.error('Error fetching dental data:', err);
            setError('فشل في تحميل البيانات من قاعدة البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        symptoms,
        problems,
        categories,
        loading,
        error,
        refetch: fetchData,
    };
}
