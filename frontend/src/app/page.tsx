'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Landing page components
import Navbar from '@/components/landing/layout/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import HowWork from '@/components/landing/how-work';
import Stats from '@/components/landing/stats';
import CTA from '@/components/landing/cta';
import Footer from '@/components/landing/layout/footer';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      className="min-h-screen bg-landing-bg text-landing-text overflow-x-hidden antialiased selection:bg-landing-blue selection:text-white"
    >
      {/* Navigation */}
      <Navbar scrolled={scrolled} />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How it Works Section */}
      <HowWork />

      {/* Stats Section */}
      <Stats />

      {/* Call to Action */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
