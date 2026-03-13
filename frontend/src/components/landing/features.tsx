'use client';

import { motion } from 'framer-motion';
import {
  Move, Box, Palette, Package, LayoutGrid,
  Save, Keyboard, Sun, Star,
} from 'lucide-react';

const features = [
  { num: '01', Icon: Move,       title: 'Drag & Drop Layout',    desc: 'Place and arrange furniture on a 2D canvas with snap-to-grid precision. Intuitive and fast.' },
  { num: '02', Icon: Box,        title: '3D Visualization',       desc: 'Switch to a realistic 3D view with lighting, shadows, and orbit controls instantly.' },
  { num: '03', Icon: Palette,    title: 'Colour & Shading',       desc: 'Customize colours and shading for individual pieces or the entire design at once.' },
  { num: '04', Icon: Package,    title: 'Furniture Catalog',      desc: 'Browse a curated catalog of chairs, tables, shelves, lamps, and more. Always growing.' },
  { num: '05', Icon: LayoutGrid, title: 'Room Customisation',     desc: 'Configure room dimensions, wall colours, floor types, and ceiling finishes with full control.' },
  { num: '06', Icon: Save,       title: 'Save & Manage',          desc: 'Save your designs, duplicate them, or revisit and edit anytime from your dashboard.' },
  { num: '07', Icon: Keyboard,   title: 'Keyboard Shortcuts',     desc: 'Undo, redo, rotate, delete and more, all from your keyboard for speed.' },
  { num: '08', Icon: Sun,        title: 'Dark & Light Mode',      desc: 'Switch between themes effortlessly. Designed for comfort in any lighting condition.' },
  { num: '09', Icon: Star,       title: 'Premium Experience',     desc: 'Smooth animations, toast notifications, and a polished UI built for professionals.' },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Features() {
  return (
    <section id="features" className="pb-40 pt-30 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="flex justify-between items-end mb-14 px-5 gap-10 flex-wrap"
      >
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-landing-muted-light mb-4">Capabilities</div>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal leading-[1.15] tracking-[-0.02em] max-w-xl m-0">
            Everything you need to <em className="italic text-landing-blue">visualize</em> spaces
          </h2>
        </div>
        <p className="max-w-sm text-landing-muted text-[0.95rem] font-light leading-[1.7] m-0">
          A complete toolkit for furniture designers and their customers. From 2D layouts to photorealistic 3D renders.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-landing-text/8 border border-landing-text/8 rounded-4xl overflow-hidden">
        {features.map(({ num, Icon, title, desc }, i) => (
          <motion.div
            key={num}
            className="group relative bg-white p-[clamp(28px,3vw,44px)] flex flex-col gap-4 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-bg cursor-default"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease }}
          >
            {/* Top border effect */}
            <div className="absolute top-0 left-6 right-6 h-0 bg-landing-blue rounded-b-[2px] transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-0.75" />
            
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-landing-blue/8 text-landing-blue transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-landing-blue group-hover:text-white">
              <Icon size={20} aria-hidden="true" />
            </div>
            <h3 className="font-display text-[1.2rem] font-normal tracking-[-0.01em] m-0">{title}</h3>
            <p className="text-landing-muted text-sm leading-[1.65] font-light m-0">{desc}</p>
            <div className="font-display text-[0.8rem] text-landing-muted-light mt-auto pt-4">{num}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}