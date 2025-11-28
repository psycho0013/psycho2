import { supabase } from '@/lib/supabase';
import type { Disease, Treatment, Symptom } from '@/types/medical';

export class DbManager {
    // --- Diseases ---
    static async getDiseases(): Promise<Disease[]> {
        const { data, error } = await supabase
            .from('diseases')
            .select('*');

        if (error) {
            console.error('Error fetching diseases:', error);
            return [];
        }
        return data || [];
    }

    static async getDisease(id: string): Promise<Disease | null> {
        const { data, error } = await supabase
            .from('diseases')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching disease ${id}:`, error);
            return null;
        }
        return data;
    }

    static async saveDisease(disease: Disease): Promise<boolean> {
        const { error } = await supabase
            .from('diseases')
            .upsert(disease);

        if (error) {
            console.error('Error saving disease:', error);
            return false;
        }
        return true;
    }

    static async deleteDisease(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('diseases')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting disease:', error);
            return false;
        }
        return true;
    }

    // --- Treatments ---
    static async getTreatments(): Promise<Treatment[]> {
        const { data, error } = await supabase
            .from('treatments')
            .select('*');

        if (error) {
            console.error('Error fetching treatments:', error);
            return [];
        }
        return data || [];
    }

    static async getTreatment(id: string): Promise<Treatment | null> {
        const { data, error } = await supabase
            .from('treatments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching treatment ${id}:`, error);
            return null;
        }
        return data;
    }

    static async saveTreatment(treatment: Treatment): Promise<boolean> {
        const { error } = await supabase
            .from('treatments')
            .upsert(treatment);

        if (error) {
            console.error('Error saving treatment:', error);
            return false;
        }
        return true;
    }

    static async deleteTreatment(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('treatments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting treatment:', error);
            return false;
        }
        return true;
    }

    // --- Symptoms ---
    static async getSymptoms(): Promise<Symptom[]> {
        const { data, error } = await supabase
            .from('symptoms')
            .select('*');

        if (error) {
            console.error('Error fetching symptoms:', error);
            return [];
        }
        return data || [];
    }

    static async saveSymptom(symptom: Symptom): Promise<boolean> {
        const { error } = await supabase
            .from('symptoms')
            .upsert(symptom);

        if (error) {
            console.error('Error saving symptom:', error);
            return false;
        }
        return true;
    }

    static async deleteSymptom(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('symptoms')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting symptom:', error);
            return false;
        }
        return true;
    }
}

export default DbManager;
