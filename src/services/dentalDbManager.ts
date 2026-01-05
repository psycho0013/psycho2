/**
 * Dental Database Manager
 * خدمة إدارة قاعدة بيانات الأسنان
 */

import { supabase } from '@/lib/supabase';
import type { DentalSymptom, DentalProblem, SymptomCategory } from '@/types/dental';

// فئات الأعراض الافتراضية
const defaultCategories: { id: SymptomCategory; name: string; icon: string }[] = [
    { id: 'pain', name: 'الألم', icon: '😣' },
    { id: 'gum', name: 'اللثة', icon: '🩸' },
    { id: 'appearance', name: 'المظهر', icon: '👁️' },
    { id: 'function', name: 'الوظيفة', icon: '🍽️' },
    { id: 'general', name: 'أعراض عامة', icon: '🤒' },
];

export class DentalDbManager {
    // ═══════════════════════════════════════════════════════════════
    // Dental Symptoms CRUD
    // ═══════════════════════════════════════════════════════════════

    static async getDentalSymptoms(): Promise<DentalSymptom[]> {
        const { data, error } = await supabase
            .from('dental_symptoms')
            .select('*')
            .order('category', { ascending: true });

        if (error) {
            console.error('Error fetching dental symptoms:', error);
            return [];
        }

        // Map snake_case to camelCase
        const mapped = (data || []).map(item => ({
            id: item.id,
            name: item.name,
            name_en: item.name_en,
            category: item.category,
            severities: item.severities || ['mild', 'moderate', 'severe'],
            description: item.description,
            followUpQuestions: item.follow_up_questions || []
        }));

        return mapped;
    }

    static async getDentalSymptomById(id: string): Promise<DentalSymptom | null> {
        const { data, error } = await supabase
            .from('dental_symptoms')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching dental symptom ${id}:`, error);
            return null;
        }
        return data;
    }

    static async saveDentalSymptom(symptom: DentalSymptom): Promise<boolean> {
        const symptomData = {
            id: symptom.id,
            name: symptom.name,
            name_en: symptom.name_en,
            category: symptom.category,
            severities: symptom.severities,
            description: symptom.description || null,
            follow_up_questions: symptom.followUpQuestions || null,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('dental_symptoms')
            .upsert(symptomData);

        if (error) {
            console.error('Error saving dental symptom:', error);
            return false;
        }
        return true;
    }

    static async deleteDentalSymptom(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('dental_symptoms')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting dental symptom:', error);
            return false;
        }
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // Dental Problems CRUD
    // ═══════════════════════════════════════════════════════════════

    static async getDentalProblems(): Promise<DentalProblem[]> {
        const { data, error } = await supabase
            .from('dental_problems')
            .select('*')
            .order('urgency', { ascending: true });

        if (error) {
            console.error('Error fetching dental problems:', error);
            return [];
        }

        // Map snake_case to camelCase
        return (data || []).map(item => ({
            id: item.id,
            name: item.name,
            name_en: item.name_en,
            description: item.description,
            symptoms: item.symptoms || [],
            symptom_weights: item.symptom_weights || {},
            severity_levels: item.severity_levels || [],
            urgency: item.urgency,
            urgency_message: item.urgency_message,
            treatments: item.treatments || [],
            prevention: item.prevention || [],
            emergency_signs: item.emergency_signs,
            warning: item.warning
        }));
    }

    static async getDentalProblemById(id: string): Promise<DentalProblem | null> {
        const { data, error } = await supabase
            .from('dental_problems')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching dental problem ${id}:`, error);
            return null;
        }
        return data;
    }

    static async saveDentalProblem(problem: DentalProblem): Promise<boolean> {
        const problemData = {
            id: problem.id,
            name: problem.name,
            name_en: problem.name_en,
            description: problem.description,
            symptoms: problem.symptoms,
            symptom_weights: problem.symptom_weights,
            severity_levels: problem.severity_levels,
            urgency: problem.urgency,
            urgency_message: problem.urgency_message,
            treatments: problem.treatments,
            prevention: problem.prevention,
            emergency_signs: problem.emergency_signs || null,
            warning: problem.warning || null,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('dental_problems')
            .upsert(problemData);

        if (error) {
            console.error('Error saving dental problem:', error);
            return false;
        }
        return true;
    }

    static async deleteDentalProblem(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('dental_problems')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting dental problem:', error);
            return false;
        }
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // Categories
    // ═══════════════════════════════════════════════════════════════

    static getDentalCategories(): { id: SymptomCategory; name: string; icon: string }[] {
        return defaultCategories;
    }

    // ═══════════════════════════════════════════════════════════════
    // Migration Helper - Import from static files
    // ═══════════════════════════════════════════════════════════════

    static async migrateFromStatic(
        symptoms: DentalSymptom[],
        problems: DentalProblem[]
    ): Promise<{ symptomsSuccess: number; problemsSuccess: number }> {
        let symptomsSuccess = 0;
        let problemsSuccess = 0;

        // Migrate symptoms
        for (const symptom of symptoms) {
            const success = await this.saveDentalSymptom(symptom);
            if (success) symptomsSuccess++;
        }

        // Migrate problems
        for (const problem of problems) {
            const success = await this.saveDentalProblem(problem);
            if (success) problemsSuccess++;
        }

        return { symptomsSuccess, problemsSuccess };
    }
}

export default DentalDbManager;
