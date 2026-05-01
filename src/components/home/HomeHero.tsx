'use client';

import { motion } from 'framer-motion';

export default function HomeHero() {
  return (
    <section className="relative w-full pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#1d1d1f] mb-6">
          RapidForge<br/><span className="text-[#86868b]">Portfolio</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-[#86868b] font-medium leading-relaxed mb-10 mx-auto">
          A curated collection of web applications, productivity tools, and digital experiences.
        </p>
      </motion.div>
    </section>
  );
}
