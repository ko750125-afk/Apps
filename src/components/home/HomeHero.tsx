'use client';

import { motion, Variants } from 'framer-motion';

export default function HomeHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  return (
    <section className="relative w-full pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden bg-[#fbfbfd]">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-5%] right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10"
      >
        <motion.h1 
          variants={itemVariants}
          className="font-semibold text-5xl md:text-8xl lg:text-9xl tracking-tighter mb-8"
        >
          <span className="block text-[#1d1d1f] leading-tight">RapidForge</span>
          <span className="bg-gradient-to-b from-[#1d1d1f] via-[#515154] to-[#86868b] bg-clip-text text-transparent">
            Portfolio
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="max-w-2xl text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed mb-12 mx-auto"
        >
          A curated collection of premium web applications, <br className="hidden md:block" />
          productivity tools, and digital experiences.
        </motion.p>

        <motion.div variants={itemVariants}>
          <div className="w-12 h-[1px] bg-[#d2d2d7] mx-auto"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
