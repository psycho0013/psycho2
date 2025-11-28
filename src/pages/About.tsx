import { motion } from 'framer-motion';
import { Instagram, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import DataManager, { type SiteContent } from '@/services/dataManager';

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

    if (!content) return null;

    const { header, developer, techStack } = content.about;

    const getImageUrl = (url: string) => {
        if (!url) return '';

        // Handle Google Drive links
        if (url.includes('drive.google.com')) {
            // Try to extract ID from /d/ID format
            const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
            }

            // Try to extract ID from id=ID format
            const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idParamMatch && idParamMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
            }
        }

        return url;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">{header.title}</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        {header.description}
                    </p>
                </div>

                {/* Developer Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
                        <img
                            src={getImageUrl(developer.image)}
                            alt="Developer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed';
                            }}
                        />
                    </div>

                    <div className="text-center md:text-right flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{developer.name}</h2>
                        <p className="text-primary font-medium mb-4">{developer.role}</p>
                        <p className="text-slate-500 mb-6 leading-relaxed">
                            {developer.bio}
                        </p>

                        <div className="flex justify-center md:justify-start gap-4">
                            {developer.social?.instagram && (
                                <a
                                    href={developer.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all"
                                >
                                    <Instagram size={24} />
                                </a>
                            )}
                            {developer.social?.telegram && (
                                <a
                                    href={developer.social.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-slate-100 rounded-xl text-slate-600 hover:bg-[#0088cc] hover:text-white transition-all"
                                >
                                    <Send size={24} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Tech Stack */}
                <div className="mt-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">{techStack.title}</h3>
                    <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {techStack.technologies.map((tech) => (
                            <span key={tech} className="text-lg font-bold text-slate-400 hover:text-primary transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
