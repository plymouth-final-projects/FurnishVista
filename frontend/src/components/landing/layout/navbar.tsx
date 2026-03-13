'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarProps {
  scrolled: boolean;
}

export default function Navbar({ scrolled }: NavbarProps) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 py-5 z-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-b",
        scrolled ? "bg-landing-bg/85 backdrop-blur-sm border-landing-text/8" : "border-transparent"
      )}
    >
        <div className='flex justify-between items-center max-w-7xl mx-auto px-6 w-full'>
            <Link href="/" className="flex items-center gap-2.5 no-underline text-landing-text">
                <svg viewBox="0 0 28 28" fill="none" width={28} height={28}>
                <rect width="28" height="28" rx="7" fill="currentColor" className="text-landing-blue"/>
                <path d="M8 11h5v8H8v-8zm7-2h5v10h-5V9z" fill="white" opacity="0.9"/>
                <rect x="8" y="8" width="12" height="2" rx="1" fill="white" opacity="0.5"/>
                </svg>
                <span className="font-display text-[1.25rem] tracking-[-0.01em]">
                FurnishVista
                </span>
            </Link>

            <div className="flex gap-3 items-center">
                <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-5 py-2 bg-transparent text-landing-text border border-landing-text/15 rounded-full text-sm no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-text hover:text-landing-bg hover:border-landing-text"
                >
                Sign in
                </Link>
                <Link 
                href="/signup" 
                className="group inline-flex items-center gap-2 px-5 py-2 bg-landing-blue text-white rounded-full text-sm no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-landing-blue-hover hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(37,99,235,0.2)]"
                >
                Get started
                <svg className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.75" width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 7h12m-5-5 5 5-5 5"/></svg>
                </Link>
            </div>
        </div>
      
    </nav>
  );
}