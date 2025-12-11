import { motion } from 'framer-motion';
import { Instagram, Send, GraduationCap, Code2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import DataManager, { type SiteContent } from '@/services/dataManager';
import PageLoader from '@/components/ui/PageLoader';

const About = () => {
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        loadContent();

        const handleUpdate = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        window.addEventListener('content-updated', handleUpdate);
        return () => window.removeEventListener('content-updated', handleUpdate);
    }, []);

    if (!content) return <PageLoader />;

    const { header, developer, supervisor, techStack } = content.about;

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
            }
            const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idParamMatch && idParamMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
            }
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 lg:p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header with Liquid Glass Effect */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5 mb-6">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-sm font-medium text-slate-600">منصة طبية ذكية</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 mb-6">
                        {header.title}
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        {header.description}
                    </p>
                </motion.div>

                {/* Team Section Title */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl font-bold text-slate-800">فريق العمل</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-500 mx-auto mt-3 rounded-full" />
                </motion.div>

                {/* Profile Cards - Liquid Glass Style */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Developer Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Card */}
                        <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            {/* Badge */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20">
                                <Code2 size={14} className="text-primary" />
                                <span className="text-xs font-bold text-primary">المطوّر</span>
                            </div>

                            <div className="flex flex-col items-center text-center pt-8">
                                {/* Avatar with Ring */}
                                <div className="relative mb-6">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-md opacity-30" />
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                                        <img
                                            src={getImageUrl(developer.image)}
                                            alt={developer.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed';
                                            }}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{developer.name}</h3>
                                <p className="text-primary font-semibold mb-4">{developer.role}</p>
                                <p className="text-slate-500 leading-relaxed mb-6 max-w-sm">
                                    {developer.bio}
                                </p>

                                {/* Social Links */}
                                {(developer.social?.instagram || developer.social?.telegram) && (
                                    <div className="flex justify-center gap-3">
                                        {developer.social?.instagram && (
                                            <a
                                                href={developer.social.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white/80 backdrop-blur-xl rounded-2xl text-slate-500 border border-white/60 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-110 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                                            >
                                                <Instagram size={22} />
                                            </a>
                                        )}
                                        {developer.social?.telegram && (
                                            <a
                                                href={developer.social.telegram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white/80 backdrop-blur-xl rounded-2xl text-slate-500 border border-white/60 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-110 hover:bg-[#0088cc] hover:text-white hover:border-transparent transition-all duration-300"
                                            >
                                                <Send size={22} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Supervisor Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Card */}
                        <div className="relative bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                            {/* Badge */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                <GraduationCap size={14} className="text-amber-600" />
                                <span className="text-xs font-bold text-amber-600">المشرف</span>
                            </div>

                            <div className="flex flex-col items-center text-center pt-8">
                                {/* Avatar with Ring */}
                                <div className="relative mb-6">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-md opacity-30" />
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                        {supervisor?.image ? (
                                            <img
                                                src={getImageUrl(supervisor.image)}
                                                alt={supervisor?.name || 'Supervisor'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <GraduationCap size={48} className="text-amber-500" />
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{supervisor?.name || 'د. اسم المشرف'}</h3>
                                <p className="text-amber-600 font-semibold mb-2">{supervisor?.role || 'المشرف الأكاديمي'}</p>
                                {supervisor?.department && (
                                    <p className="text-slate-400 text-sm mb-4">{supervisor.department}</p>
                                )}
                                <p className="text-slate-500 leading-relaxed max-w-sm">
                                    {supervisor?.bio || 'مشرف على مشروع SmartTashkhees'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tech Stack - Liquid Glass Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                >
                    <div className="bg-white/50 backdrop-blur-2xl rounded-[2rem] p-10 border border-white/60 shadow-xl shadow-black/5">
                        <h3 className="text-xl font-bold text-slate-800 mb-8 text-center">{techStack.title}</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {techStack.technologies.map((tech, index) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-2xl text-slate-600 font-medium border border-white/60 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 hover:text-white hover:border-transparent transition-all duration-300 cursor-default"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;

