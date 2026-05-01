'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Sparkles } from 'lucide-react';

export default function AboutContent() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#0066cc]" />,
      title: "High Performance",
      description: "Optimized for speed and seamless user experiences using the latest web technologies."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#0066cc]" />,
      title: "Reliable Architecture",
      description: "Built with scalable and robust foundations to ensure long-term stability."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#0066cc]" />,
      title: "Modern Design",
      description: "Minimalist and premium aesthetics tailored for professional impact."
    }
  ];

  return (
    <main className="min-h-screen bg-[#fbfbfd] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] tracking-tight mb-8">
            Crafting Digital<br/>Excellence
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            RapidForge is a professional laboratory dedicated to building high-performance 
            web applications that bridge the gap between complex logic and beautiful design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-[#f5f5f7] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-3">{feature.title}</h3>
              <p className="text-[#86868b] text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1d1d1f] rounded-[48px] p-12 md:p-20 text-white overflow-hidden relative"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Our Philosophy</h2>
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <p>
                We believe that the best code is invisible. Our focus is on creating tools 
                that feel natural, fast, and indispensable to the end user.
              </p>
              <p>
                Every project in the RapidForge ecosystem is treated as a piece of digital craftsmanship, 
                where performance optimization meets artistic precision.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc] opacity-20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4d9fff] opacity-10 blur-[100px]" />
        </motion.section>
      </div>
    </main>
  );
}
