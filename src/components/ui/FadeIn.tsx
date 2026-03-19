'use client';

import { motion } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    yOffset?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    yOffset = 20,
    duration = 0.4,
    className = '',
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
