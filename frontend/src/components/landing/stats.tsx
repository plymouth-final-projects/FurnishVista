'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  { num: '2D + 3D', label: 'Dual view modes' },
  { num: '150+', label: 'Furniture pieces' },
  { num: '< 1s', label: '3D render time' },
  { num: '∞', label: 'Saved designs' }
];

export default function Stats() {
  return (
    <div className="px-[clamp(24px,6vw,80px)] mb-[clamp(60px,8vw,100px)]">
      <motion.div
        className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 gap-[1px] bg-landing-text/[0.08] border border-landing-text/[0.08] rounded-[20px] overflow-hidden"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8, ease }}
      >
        {stats.map(({ num, label }, i) => (
          <motion.div 
            key={label} 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease }} 
            className="bg-white p-[clamp(24px,3vw,40px)] text-center"
          >
            <div className="font-display text-[clamp(2rem,3.5vw,3rem)] text-landing-text leading-none mb-1.5">{num}</div>
            <div className="text-[0.8rem] text-landing-muted-light font-light">{label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}