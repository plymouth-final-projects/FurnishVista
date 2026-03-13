'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function CTA() {
  return (
    <section id="cta" className="pb-40 pt-10 text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
        <h2 className="font-display text-6xl font-normal leading-[1.15] tracking-[-0.02em] mx-auto mb-5">
          Ready to transform<br />your <em className="italic text-landing-blue">showroom</em>?
        </h2>
        <p className="text-landing-muted font-light max-w-lg mx-auto mb-10 leading-[1.7]">
          Join designers who use FurnishVista to wow their customers with immersive furniture previews.
        </p>
        <div className="flex justify-center gap-3.5 max-sm:flex-col max-sm:items-center">
          <Link 
            href="/signup" 
            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-landing-blue text-white rounded-full text-sm no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-blue-hover hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(37,99,235,0.2)]"
          >
            Get started free
            <svg className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.75" width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7h12m-5-5 5 5-5 5"/></svg>
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent text-landing-text border border-landing-text/15 rounded-full text-sm no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-text hover:text-landing-bg hover:border-landing-text"
          >
            Talk to sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
}