export interface DirectoryItem {
    id: string;
    title: string;
    category: 'hospital' | 'clinic' | 'pharmacy' | 'device' | 'maintenance';
    image: string;
    description: string;
    phone: string;
    location: string; // Map link or coordinates
    address: string;
    rating: number;
    features: string[];
    workHours: string;
}

export const directoryItems: DirectoryItem[] = [
    {
        id: '1',
        title: 'مستشفى الأمل التخصصي',
        category: 'hospital',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=1000',
        description: 'مستشفى متكامل يقدم رعاية صحية متميزة بأحدث التقنيات الطبية وكادر طبي متخصص.',
        phone: '+964 770 123 4567',
        location: 'https://maps.google.com',
        address: 'بغداد، الكرادة، شارع 62',
        rating: 4.8,
        features: ['طوارئ 24 ساعة', 'عناية مركزة', 'مختبرات حديثة', 'صيدلية داخلية'],
        workHours: 'مفتوح 24 ساعة'
    },
    {
        id: '2',
        title: 'عيادات النور الطبية',
        category: 'clinic',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
        description: 'مجمع عيادات يضم نخبة من الأطباء الاستشاريين في مختلف التخصصات.',
        phone: '+964 780 987 6543',
        location: 'https://maps.google.com',
        address: 'البصرة، الجزائر، قرب التقاطع',
        rating: 4.5,
        features: ['حجز إلكتروني', 'مختبر تحليلات', 'أشعة وسونار'],
        workHours: '9:00 ص - 9:00 م'
    },
    {
        id: '3',
        title: 'صيدلية الشفاء المركزية',
        category: 'pharmacy',
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1000',
        description: 'توفير كافة أنواع الأدوية والمستلزمات الطبية ومستحضرات التجميل.',
        phone: '+964 750 111 2233',
        location: 'https://maps.google.com',
        address: 'أربيل، شارع 100، قرب المطار',
        rating: 4.9,
        features: ['توصيل منزلي', 'قياس ضغط وسكر', 'استشارات صيدلانية'],
        workHours: '8:00 ص - 12:00 ص'
    },
    {
        id: '4',
        title: 'شركة التقنية للأجهزة الطبية',
        category: 'device',
        image: 'https://images.unsplash.com/photo-1583912267670-6575ad43263d?auto=format&fit=crop&q=80&w=1000',
        description: 'تجهيز المستشفيات والعيادات بأحدث الأجهزة الطبية العالمية.',
        phone: '+964 771 555 6677',
        location: 'https://maps.google.com',
        address: 'بغداد، شارع السعدون',
        rating: 4.7,
        features: ['ضمان حقيقي', 'صيانة دورية', 'تدريب الكوادر'],
        workHours: '9:00 ص - 5:00 م'
    },
    {
        id: '5',
        title: 'مركز الصيانة الهندسية',
        category: 'maintenance',
        image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&q=80&w=1000',
        description: 'صيانة وتصليح كافة الأجهزة الطبية والمختبرية بدقة عالية.',
        phone: '+964 790 333 4455',
        location: 'https://maps.google.com',
        address: 'النجف، حي الأمير',
        rating: 4.6,
        features: ['فريق هندسي متخصص', 'قطع غيار أصلية', 'خدمة موقعية'],
        workHours: '8:00 ص - 4:00 م'
    }
];
