/**
 * Dentist Database Manager
 * خدمة إدارة قاعدة بيانات أطباء الأسنان
 */

import { supabase } from '@/lib/supabase';
import type { Dentist, IraqCity, DentalSpecialization } from '@/types/dentist';

export class DentistDbManager {
    // ═══════════════════════════════════════════════════════════════
    // Get Dentists
    // ═══════════════════════════════════════════════════════════════

    static async getAllDentists(): Promise<Dentist[]> {
        const { data, error } = await supabase
            .from('dentists')
            .select('*')
            .eq('is_active', true)
            .order('rating', { ascending: false });

        if (error) {
            console.error('Error fetching dentists:', error);
            return [];
        }
        return data || [];
    }

    static async getDentistsByCity(city: IraqCity): Promise<Dentist[]> {
        const { data, error } = await supabase
            .from('dentists')
            .select('*')
            .eq('city', city)
            .eq('is_active', true)
            .order('rating', { ascending: false });

        if (error) {
            console.error(`Error fetching dentists for city ${city}:`, error);
            return [];
        }
        return data || [];
    }

    static async getDentistById(id: string): Promise<Dentist | null> {
        const { data, error } = await supabase
            .from('dentists')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching dentist ${id}:`, error);
            return null;
        }
        return data;
    }

    // ═══════════════════════════════════════════════════════════════
    // Admin CRUD Operations
    // ═══════════════════════════════════════════════════════════════

    static async saveDentist(dentist: Dentist): Promise<boolean> {
        const dentistData = {
            ...dentist,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('dentists')
            .upsert(dentistData);

        if (error) {
            console.error('Error saving dentist:', error);
            return false;
        }
        return true;
    }

    static async deleteDentist(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('dentists')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting dentist:', error);
            return false;
        }
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    // Helper Methods
    // ═══════════════════════════════════════════════════════════════

    static getCities(): { id: IraqCity; name: string }[] {
        return [
            { id: 'baghdad', name: 'بغداد' },
            { id: 'nasiriyah', name: 'الناصرية' },
            { id: 'basra', name: 'البصرة' },
            { id: 'karbala', name: 'كربلاء' },
            { id: 'najaf', name: 'النجف' },
            { id: 'erbil', name: 'أربيل' },
            { id: 'sulaymaniyah', name: 'السليمانية' },
            { id: 'mosul', name: 'الموصل' },
            { id: 'kirkuk', name: 'كركوك' },
            { id: 'diwaniyah', name: 'الديوانية' },
            { id: 'amarah', name: 'العمارة' },
            { id: 'kut', name: 'الكوت' },
            { id: 'samawah', name: 'السماوة' },
            { id: 'hillah', name: 'الحلة' }
        ];
    }

    static getSpecializations(): { id: DentalSpecialization; name: string }[] {
        return [
            { id: 'general', name: 'طب أسنان عام' },
            { id: 'cosmetic', name: 'تجميل الأسنان' },
            { id: 'orthodontics', name: 'تقويم الأسنان' },
            { id: 'pediatric', name: 'أسنان الأطفال' },
            { id: 'endodontics', name: 'علاج العصب' },
            { id: 'periodontics', name: 'أمراض اللثة' },
            { id: 'oral_surgery', name: 'جراحة الفم' },
            { id: 'prosthodontics', name: 'التركيبات والأطقم' }
        ];
    }

    static getWhatsAppUrl(phone: string, message?: string): string {
        const cleanPhone = phone.replace(/\D/g, '');
        const msg = message ? encodeURIComponent(message) : '';
        return `https://wa.me/${cleanPhone}${msg ? `?text=${msg}` : ''}`;
    }
}

export default DentistDbManager;
