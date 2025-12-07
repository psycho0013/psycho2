import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-rose-500 origin-left z-50 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            style={{ scaleX }}
        />
    );
};

export default ScrollProgress;
