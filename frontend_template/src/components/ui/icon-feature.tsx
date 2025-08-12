'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface IconFeatureProps {
  icon: LucideIcon;
  label: string;
}

export const IconFeature = ({ icon: Icon, label }: IconFeatureProps) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className='group flex flex-col items-center'
  >
    <div className='mb-3 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/20'>
      <Icon className='size-6 text-sky-100' />
    </div>
    <span className='text-sm font-medium text-sky-100'>{label}</span>
  </motion.div>
);
