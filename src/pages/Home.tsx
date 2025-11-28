import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowLeft, Activity, ShieldCheck, HeartPulse } from 'lucide-react'; // Changed ArrowRight to ArrowLeft for RTL
import { Link } from 'react-router-dom';
import DataManager, { type SiteContent } from '@/services/dataManager';
import { useState } from 'react';

const Home = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        // Initial load
        const loadContent = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };
        loadContent();

        // Listen for updates
        const handleUpdate = async () => {
            const data = await DataManager.getContent();
            setContent(data);
        };

        window.addEventListener('content-updated', handleUpdate);
        return () => window.removeEventListener('content-updated', handleUpdate);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".hero-badge", {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            })
                .from(".hero-title", {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power4.out",
                    stagger: 0.1
                }, "-=0.4")
                .from(".hero-desc", {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out"
                }, "-=0.6")
                .from(".hero-buttons", {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out"
                }, "-=0.4");

        }, heroRef);

        return () => ctx.revert();
    }, [content]); // Re-run animation when content changes

    if (!content) return null;

    const { hero, howItWorks } = content.home;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden" ref={heroRef}>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 lg:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="z-10" ref={textRef}>
                        <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                            <Activity size={16} />
                            <span>{hero.badge}</span>
                        </div>

                        <h1 className="hero-title text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                            {hero.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                {hero.titleHighlight}
                            </span>
                        </h1>

                        <p className="hero-desc text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                            {hero.description}
                        </p>

                        <div className="hero-buttons flex flex-wrap gap-4">
                            <Link to="/diagnosis" className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                                {hero.primaryButton} <ArrowLeft size={20} />
                            </Link>
                            <Link to="/about" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                                {hero.secondaryButton}
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image / Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }} // Changed x direction for RTL entrance
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            {/* Placeholder for the "one demo image" requested */}
                            <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-multiply" />
                                <img
                                    src={hero.image}
                                    alt="Medical Technology"
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24 px-6 lg:px-12 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{howItWorks.title}</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            {howItWorks.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.steps.map((step, index) => {
                            const IconComponent = step.icon === 'Activity' ? Activity :
                                step.icon === 'ShieldCheck' ? ShieldCheck :
                                    step.icon === 'HeartPulse' ? HeartPulse : Activity;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                                >
                                    <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{step.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
