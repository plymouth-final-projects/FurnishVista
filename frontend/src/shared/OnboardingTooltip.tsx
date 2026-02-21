'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/states/useUIStore';

interface OnboardingStep {
  title: string;
  description: string;
  target?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to FurnishVista!',
    description: 'Let\'s take a quick tour of the room editor. You can place furniture, customize colours, and visualize your design in 3D.',
  },
  {
    title: 'Furniture Palette',
    description: 'Browse and search furniture items on the left panel. Click any item to place it in your room.',
  },
  {
    title: '2D & 3D Views',
    description: 'Use the toggle in the toolbar to switch between top-down 2D layout and immersive 3D visualization.',
  },
  {
    title: 'Properties Panel',
    description: 'Select any furniture item to adjust its position, rotation, scale, colour, and shading on the right panel.',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Press ? at any time to see available shortcuts. Use Ctrl+Z to undo, R to rotate, and Delete to remove items.',
  },
];

export function OnboardingOverlay() {
  const { onboardingComplete, setOnboardingComplete } = useUIStore();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!onboardingComplete) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [onboardingComplete]);

  if (onboardingComplete || !visible) return null;

  const current = ONBOARDING_STEPS[step];
  if (!current) return null;
  const isLast = step === ONBOARDING_STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      setOnboardingComplete(true);
      setVisible(false);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSkip() {
    setOnboardingComplete(true);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleSkip();
          }}
          role="dialog"
          aria-label="Onboarding tour"
          aria-modal="true"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25 }}
            className="relative mx-4 w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={handleSkip}
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Skip onboarding"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold">{current.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {current.description}
            </p>

            {/* Progress & actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {ONBOARDING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      i <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip
                </Button>
                <Button size="sm" onClick={handleNext} className="gap-1">
                  {isLast ? 'Get started' : 'Next'}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
