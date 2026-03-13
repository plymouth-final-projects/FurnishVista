'use client';

import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function HowWork() {
  return (
    <section id="showcase" className="pb-40 pt-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="text-center mb-16"
      >
        <div className="text-xs uppercase tracking-[0.15em] text-landing-muted-light mb-4">How it works</div>
        <h2 className="font-display text-6xl font-normal leading-[1.15] tracking-[-0.02em] max-w-xl mx-auto my-0">
          From floor plan to <em className="italic text-landing-blue">photorealistic</em> render
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-6">
        {/* 2D card */}
        <motion.div 
          className="group bg-white border border-landing-text/8 rounded-4xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-landing-text/15 hover:shadow-[0_16px_64px_rgba(0,0,0,0.05)] hover:-translate-y-1"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          <div className="aspect-video bg-linear-to-br from-landing-gradient-start to-landing-gradient-end flex items-center justify-center">
            <div className="w-[70%] h-[60%] border-2 border-dashed border-landing-blue/20 rounded-xl grid grid-cols-4 grid-rows-3 gap-2 p-4">
              <div className="col-span-2 row-span-2 rounded-md bg-landing-blue/12 border border-landing-blue/12" />
              <div className="col-start-3 row-span-2 rounded-md bg-landing-blue/8 border border-landing-blue/12" />
              <div className="col-start-4 row-start-2 rounded-full bg-landing-blue/8 border border-landing-blue/12" />
              <div className="col-start-3 col-span-2 row-start-3 rounded-md bg-landing-blue/8 border border-landing-blue/12" />
            </div>
          </div>
          <div className="p-[clamp(24px,3vw,36px)]">
            <h3 className="font-display text-[clamp(1.3rem,2vw,1.6rem)] font-normal tracking-[-0.01em] mb-2 mt-0">Start with a 2D layout</h3>
            <p className="text-landing-muted text-[0.9rem] leading-[1.65] font-light m-0">Drag furniture onto the canvas, snap to grid, and build your floor plan in minutes. Resize rooms, set wall colours, and fine-tune every detail.</p>
          </div>
        </motion.div>

        {/* 3D card */}
        <motion.div 
          className="group bg-white border border-landing-text/8 rounded-4xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-landing-text/15 hover:shadow-[0_16px_64px_rgba(0,0,0,0.05)] hover:-translate-y-1"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <div className="aspect-video bg-linear-to-br from-landing-gradient-start to-landing-gradient-end flex items-center justify-center">
            <div className="w-[55%] h-[65%] bg-linear-to-br from-landing-brown-start to-landing-brown-end rounded-[14px] relative shadow-[0_20px_60px_rgba(0,0,0,0.1)] transform-[perspective(800px)_rotateY(-5deg)_rotateX(3deg)] flex items-center justify-center">
              <span className="font-display text-[2rem] text-white/40 tracking-widest">3D</span>
            </div>
          </div>
          <div className="p-[clamp(24px,3vw,36px)]">
            <h3 className="font-display text-[clamp(1.3rem,2vw,1.6rem)] font-normal tracking-[-0.01em] mb-2 mt-0">Visualize in 3D instantly</h3>
            <p className="text-landing-muted text-[0.9rem] leading-[1.65] font-light m-0">One click transforms your layout into a walkable 3D room with lighting, shadows, and material rendering. Orbit, zoom, and share with clients.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}