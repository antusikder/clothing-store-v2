'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-[#fafafa]">
      {/* Background/Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-primary">
              STYLE IS <br />
              <span className="text-gray-300">AGELESS.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed"
          >
            Discover our premium curated collection designed for comfort and absolute elegance. Limited pieces available for this season.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              href="/shop" 
              className="bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-accent hover:scale-105 transition-all duration-300 group"
            >
              Shop Collection <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/lookbook" 
              className="px-8 py-4 rounded-full font-bold border-2 border-primary/10 hover:border-primary transition-all"
            >
              View Lookbook
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Hero Image - Visual Placeholder/Abstract */}
      <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[600px] rounded-full border border-gray-100 overflow-hidden transform rotate-6">
        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-white" />
      </div>
    </section>
  );
}
