'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Network } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { IconFeature } from '@/components/ui/icon-feature';

export default function Home() {
  return (
    <main className='relative min-h-screen overflow-hidden'>
      <AnimatedBackground />

      {/* Content */}
      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center'
        >
          <h1 className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            Hi. I&apos;m <span className='text-sky-100 dark:text-purple-200'>Dan</span>.
          </h1>
          <p className='mx-auto max-w-2xl text-xl text-sky-100 dark:text-purple-200/90 sm:text-2xl'>
            I enjoy architecting solutions to technical problems.
          </p>

          <div className='mt-12 flex justify-center gap-8'>
            <IconFeature icon={Code2} label='Projects' />
            <IconFeature icon={Cpu} label='About' />
            <IconFeature icon={Network} label='Contact' />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
