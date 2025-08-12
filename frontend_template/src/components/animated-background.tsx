'use client';

import { motion } from 'framer-motion';

interface CloudProps {
  delay?: number;
  duration?: number;
  className?: string;
}

export const Cloud = ({ delay = 0, duration = 20, className = '' }: CloudProps) => (
  <motion.div
    initial={{ x: '-100%', opacity: 0 }}
    animate={{
      x: '200%',
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
    className={`absolute ${className}`}
  >
    <div className='h-24 w-64 scale-150 rounded-full bg-white/10 blur-xl' />
  </motion.div>
);

export const AnimatedBackground = () => (
  <div className='absolute inset-0 overflow-hidden'>
    {/* Base gradient */}
    <div className='absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600' />

    {/* Multiple cloud layers */}
    <div className='absolute inset-0'>
      <Cloud delay={0} duration={25} className='top-[15%] scale-150' />
      <Cloud delay={5} duration={30} className='top-[35%] scale-100 opacity-70' />
      <Cloud delay={2} duration={22} className='top-[55%] scale-125' />
      <Cloud delay={8} duration={28} className='top-3/4 scale-90 opacity-60' />
    </div>

    {/* Atmospheric overlay */}
    <div className='animate-pulse-slow absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent' />
  </div>
);
