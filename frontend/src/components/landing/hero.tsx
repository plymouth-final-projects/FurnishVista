'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="flex flex-col justify-center items-center text-center px-[clamp(24px,6vw,80px)] py-[clamp(120px,16vw,180px)] pb-[clamp(80px,10vw,120px)] relative">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-landing-blue/7 border border-landing-blue/12 rounded-full text-[0.8rem] text-landing-blue font-medium tracking-wide mb-10"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-landing-blue inline-block animate-pulse" />
        Furniture Visualization Reimagined
      </motion.div>

      {/* H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease }}
        className="font-display text-[clamp(3.2rem,8vw,7.5rem)] font-normal leading-none tracking-[-0.03em] max-w-6xl m-0"
      >
        Design rooms<br />that <em className="italic text-landing-blue">inspire</em>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease }}
        className="max-w-xl text-landing-muted text-[1.05rem] leading-[1.7] mt-7 font-light"
      >
        Create immersive 2D layouts and 3D visualizations. Let your customers see their dream spaces before a single piece is moved.
      </motion.p>

      {/* Actions */}
      <motion.div
        className="flex justify-center gap-3.5 mt-11 max-sm:flex-col max-sm:items-center"
        initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8, ease }}
      >
        <Link 
          href="/signup" 
          className="group inline-flex items-center gap-2 px-6 py-2.5 bg-landing-blue text-white rounded-full text-sm no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-blue-hover hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(37,99,235,0.2)]"
        >
          Start designing
          <ArrowRight className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.75" size={16} />
        </Link>
      </motion.div>
    </section>
  );
}