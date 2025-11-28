import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface SiteSettings {
    siteName: string;
    siteDescription: string;
    email: string;
    phone: string;
    address: string;
    facebook: string;
    twitter: string;
    instagram: string;
}

const Footer = () => {
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: 'صيدلية فاي',
        siteDescription: 'منصة رعاية صحية ذكية مدعومة بالذكاء الاصطناعي',
        email: 'contact@phy.ai',
        phone: '+964 770 000 0000',
        address: 'بغداد، العراق',
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com'
    });

    useEffect(() => {
        const stored = localStorage.getItem('phy_site_settings');
        if (stored) {
            setSettings(JSON.parse(stored));
        }
    }, []);

    return (
        <footer className="bg-slate-900 text-slate-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">{settings.siteName}</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            {settings.siteDescription}
                        </p>
                        <div className="flex gap-3">
                            {settings.facebook && (
                                <a
                                    href={settings.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings.twitter && (
                                <a
                                    href={settings.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Twitter size={18} />
                                </a>
                            )}
                            {settings.instagram && (
                                <a
                                    href={settings.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-slate-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                            </li>
                            <li>
                                <Link to="/diagnosis" className="hover:text-primary transition-colors">التشخيص</Link>
                            </li>
                            <li>
                                <Link to="/awareness" className="hover:text-primary transition-colors">التوعية الطبية</Link>
                            </li>
                            <li>
                                <Link to="/directory" className="hover:text-primary transition-colors">الدليل الطبي</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-4">خدماتنا</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/diagnosis" className="hover:text-primary transition-colors">مساعد التشخيص</Link>
                            </li>
                            <li>
                                <Link to="/awareness" className="hover:text-primary transition-colors">دليل الأمراض</Link>
                            </li>
                            <li>
                                <Link to="/awareness" className="hover:text-primary transition-colors">دليل العلاجات</Link>
                            </li>
                            <li>
                                <Link to="/directory" className="hover:text-primary transition-colors">دليل المستشفيات</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Mail size={16} className="text-primary mt-1 shrink-0" />
                                <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                                    {settings.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone size={16} className="text-primary mt-1 shrink-0" />
                                <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors" dir="ltr">
                                    {settings.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-primary mt-1 shrink-0" />
                                <span>{settings.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
                    <p>© {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
