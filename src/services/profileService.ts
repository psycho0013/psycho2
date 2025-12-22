import { supabase } from '@/lib/supabase';

export interface Profile {
    id: string;
    full_name: string | null;
    gender: 'Male' | 'Female' | null;
    date_of_birth: string | null;
    blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown' | null;
    height: number | null;
    weight: number | null;
    chronic_conditions: string[];
    created_at?: string;
    updated_at?: string;
}

export interface MedicalHistory {
    id: string;
    user_id: string;
    symptoms: any[];
    diagnosis_result: any;
    notes: string | null;
    created_at: string;
}

export const profileService = {
    // Get User Profile
    getProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle(); // Use maybeSingle to handle no rows gracefully
        return { data, error };
    },

    // Update User Profile (upsert to create if not exists)
    updateProfile: async (userId: string, updates: Partial<Profile>) => {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...updates,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        return { data, error };
    },

    // Get Medical History
    getMedicalHistory: async (userId: string) => {
        const { data, error } = await supabase
            .from('medical_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    // Add Medical History Record (To be used after diagnosis)
    addMedicalHistory: async (userId: string, record: Partial<MedicalHistory>) => {
        const { data, error } = await supabase
            .from('medical_history')
            .insert([{ ...record, user_id: userId }])
            .select()
            .single();
        return { data, error };
    }
};
