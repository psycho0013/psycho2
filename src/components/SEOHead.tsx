/**
 * SEO Component - مكون تحسين محركات البحث
 * Provides dynamic page titles and meta tags for each route
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string;
}

// تعريف SEO لكل صفحة
const pagesSEO: Record<string, SEOConfig> = {
    '/': {
        title: 'SmartTashkhees | تشخيص طبي ذكي بالذكاء الاصطناعي',
        description: 'SmartTashkhees - نظام تشخيص طبي ذكي يعتمد على الذكاء الاصطناعي. احصل على تشخيص أولي لأعراضك، تعرف على الأمراض والعلاجات، واستكشف دليل المراكز الطبية في العراق.',
        keywords: 'تشخيص طبي, ذكاء اصطناعي, أعراض, علاج, العراق'
    },
    '/diagnosis': {
        title: 'التشخيص الذكي | SmartTashkhees',
        description: 'احصل على تشخيص أولي ذكي لأعراضك باستخدام الذكاء الاصطناعي. أدخل أعراضك واحصل على تشخيص محتمل مع توصيات العلاج.',
        keywords: 'تشخيص الأعراض, فحص طبي, تشخيص ذكي, أعراض الأمراض'
    },
    '/dental-diagnosis': {
        title: 'تشخيص الأسنان | SmartTashkhees',
        description: 'تشخيص ذكي لمشاكل الأسنان واللثة. اكتشف المشاكل المحتملة واحصل على نصائح العلاج وقائمة بأفضل أطباء الأسنان.',
        keywords: 'تشخيص الأسنان, ألم الأسنان, طبيب أسنان, مشاكل اللثة'
    },
    '/lab-diagnosis': {
        title: 'تشخيص التحاليل | SmartTashkhees',
        description: 'فهم نتائج تحاليلك المخبرية. أدخل نتائج تحاليلك واحصل على تفسير مفصل وتوصيات.',
        keywords: 'تحاليل طبية, نتائج التحاليل, فحوصات الدم'
    },
    '/awareness': {
        title: 'التوعية الصحية | SmartTashkhees',
        description: 'تعرف على الأمراض الشائعة وأعراضها وطرق الوقاية والعلاج. معلومات صحية موثوقة.',
        keywords: 'توعية صحية, أمراض شائعة, الوقاية, نصائح صحية'
    },
    '/directory': {
        title: 'الدليل الطبي | SmartTashkhees',
        description: 'دليل شامل للمستشفيات والعيادات والصيدليات في العراق. ابحث عن أقرب مركز طبي لك.',
        keywords: 'مستشفيات العراق, عيادات, صيدليات, دليل طبي'
    },
    '/about': {
        title: 'من نحن | SmartTashkhees',
        description: 'تعرف على فريق SmartTashkhees ورسالتنا في تحسين الرعاية الصحية باستخدام الذكاء الاصطناعي.',
        keywords: 'عن سمارت تشخيص, فريق العمل'
    },
    '/contact': {
        title: 'اتصل بنا | SmartTashkhees',
        description: 'تواصل معنا لأي استفسارات أو اقتراحات. نحن هنا لمساعدتك.',
        keywords: 'اتصل بنا, تواصل, دعم'
    },
    '/auth': {
        title: 'تسجيل الدخول | SmartTashkhees',
        description: 'سجل دخولك أو أنشئ حساباً جديداً للوصول إلى جميع ميزات التشخيص الذكي.',
        keywords: 'تسجيل دخول, حساب جديد, تسجيل'
    },
    '/profile': {
        title: 'الملف الشخصي | SmartTashkhees',
        description: 'إدارة ملفك الشخصي وإعدادات حسابك.',
        keywords: 'ملف شخصي, إعدادات الحساب'
    }
};

// Default SEO
const defaultSEO: SEOConfig = {
    title: 'SmartTashkhees | تشخيص طبي ذكي',
    description: 'نظام تشخيص طبي ذكي يعتمد على الذكاء الاصطناعي',
    keywords: 'تشخيص طبي, ذكاء اصطناعي, العراق'
};

export default function SEOHead() {
    const location = useLocation();

    useEffect(() => {
        // Get SEO config for current path
        const seo = pagesSEO[location.pathname] || defaultSEO;

        // Update document title
        document.title = seo.title;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', seo.description);
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && seo.keywords) {
            metaKeywords.setAttribute('content', seo.keywords);
        }

        // Update Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute('content', seo.title);
        if (ogDescription) ogDescription.setAttribute('content', seo.description);

        // Update Twitter
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        if (twitterTitle) twitterTitle.setAttribute('content', seo.title);
        if (twitterDescription) twitterDescription.setAttribute('content', seo.description);

    }, [location.pathname]);

    return null; // This component doesn't render anything
}

// Hook for programmatic SEO updates
export function usePageSEO(config: Partial<SEOConfig>) {
    useEffect(() => {
        if (config.title) document.title = config.title;

        if (config.description) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute('content', config.description);
        }
    }, [config.title, config.description]);
}
