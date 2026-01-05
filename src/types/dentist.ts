/**
 * Dentist Types
 * أنواع بيانات أطباء الأسنان
 */

// المدن العراقية المدعومة
export type IraqCity =
    | 'baghdad'         // بغداد
    | 'nasiriyah'       // الناصرية
    | 'basra'           // البصرة
    | 'karbala'         // كربلاء
    | 'najaf'           // النجف
    | 'erbil'           // أربيل
    | 'sulaymaniyah'    // السليمانية
    | 'mosul'           // الموصل
    | 'kirkuk'          // كركوك
    | 'diwaniyah'       // الديوانية
    | 'amarah'          // العمارة
    | 'kut'             // الكوت
    | 'samawah'         // السماوة
    | 'hillah';         // الحلة

// أسماء المدن بالعربي
export const CITY_NAMES: Record<IraqCity, string> = {
    baghdad: 'بغداد',
    nasiriyah: 'الناصرية',
    basra: 'البصرة',
    karbala: 'كربلاء',
    najaf: 'النجف',
    erbil: 'أربيل',
    sulaymaniyah: 'السليمانية',
    mosul: 'الموصل',
    kirkuk: 'كركوك',
    diwaniyah: 'الديوانية',
    amarah: 'العمارة',
    kut: 'الكوت',
    samawah: 'السماوة',
    hillah: 'الحلة'
};

// تخصصات طب الأسنان
export type DentalSpecialization =
    | 'general'         // طب أسنان عام
    | 'cosmetic'        // تجميل الأسنان
    | 'orthodontics'    // تقويم الأسنان
    | 'pediatric'       // أسنان الأطفال
    | 'endodontics'     // علاج العصب
    | 'periodontics'    // أمراض اللثة
    | 'oral_surgery'    // جراحة الفم
    | 'prosthodontics'; // التركيبات

// أسماء التخصصات بالعربي
export const SPECIALIZATION_NAMES: Record<DentalSpecialization, string> = {
    general: 'طب أسنان عام',
    cosmetic: 'تجميل الأسنان',
    orthodontics: 'تقويم الأسنان',
    pediatric: 'أسنان الأطفال',
    endodontics: 'علاج العصب',
    periodontics: 'أمراض اللثة',
    oral_surgery: 'جراحة الفم',
    prosthodontics: 'التركيبات والأطقم'
};

// بيانات الطبيب
export interface Dentist {
    id: string;
    name: string;
    specialization: DentalSpecialization;
    city: IraqCity;
    clinic_name: string;
    address: string;
    phone: string;
    whatsapp?: string;
    map_url?: string;  // رابط Google Maps مباشر
    image_url?: string;
    rating: number;
    experience_years: number;
    working_hours: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}
