'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TARGET = new Date('2026-06-20T19:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 0 20px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            className="text-2xl sm:text-3xl font-black text-white"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
          >
            {display}
          </motion.span>
        </AnimatePresence>

        {/* Shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>
      <span className="mt-2 text-xs font-semibold tracking-[0.2em] uppercase"
        style={{ color: 'rgba(139,92,246,0.8)' }}>
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  // Start null to avoid SSR/client hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return <div className="flex items-end gap-3 sm:gap-4 h-[5.5rem]" />;

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      <Digit value={timeLeft.days} label="days" />
      <span className="text-2xl sm:text-3xl font-black text-white/40 mb-4">:</span>
      <Digit value={timeLeft.hours} label="hours" />
      <span className="text-2xl sm:text-3xl font-black text-white/40 mb-4">:</span>
      <Digit value={timeLeft.minutes} label="min" />
      <span className="text-2xl sm:text-3xl font-black text-white/40 mb-4">:</span>
      <Digit value={timeLeft.seconds} label="sec" />
    </div>
  );
}
