'use client';

import { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';

// No SSR — countdown uses Date.now() which always mismatches between server and client
const CountdownTimer = dynamic(() => import('./CountdownTimer'), { ssr: false });

const LETTER_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.4 + i * 0.12, duration: 0.8, ease: 'easeOut' as const },
  }),
};

interface HeroProps {
  onOpenInvite: () => void;
}

export default function Hero({ onOpenInvite }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  const handleLogoClick = useCallback(() => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setEasterEgg(true);
      setTimeout(() => setEasterEgg(false), 3000);
    }
  }, [logoClicks]);

  const letters = ['N', 'E', 'R', 'P'];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Neon blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="neon-blob absolute"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
            top: '-10%',
            left: '-15%',
            animationDelay: '0s',
          }}
        />
        <div
          className="neon-blob absolute"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            bottom: '-5%',
            right: '-10%',
            animationDelay: '-2s',
          }}
        />
        <div
          className="neon-blob absolute"
          style={{
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            animationDelay: '-4s',
          }}
        />
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          zIndex: 1,
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-2 mb-8"
        >
          <div
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.25em] uppercase"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: '#a78bfa',
            }}
          >
            ✦ An Exclusive Celebration ✦
          </div>
        </motion.div>

        {/* Giant NERP letters */}
        <div
          className="flex items-center justify-center gap-2 sm:gap-4 cursor-pointer mb-2"
          onClick={handleLogoClick}
          style={{ perspective: '800px' }}
        >
          {letters.map((letter, i) => (
            <motion.span
              key={letter}
              custom={i}
              variants={LETTER_VARIANTS}
              initial="hidden"
              animate="visible"
              className="text-[22vw] sm:text-[18vw] md:text-[15vw] lg:text-[12vw] font-black leading-none select-none"
              style={{
                background:
                  'linear-gradient(180deg, #ffffff 0%, #c4b5fd 40%, #8B5CF6 80%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.6))',
                fontFamily: 'var(--font-inter)',
              }}
              whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 50px rgba(6,182,212,0.8))' }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Easter egg */}
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50 pointer-events-none"
          >
            <div
              className="px-6 py-3 rounded-2xl text-white font-bold text-lg"
              style={{
                background: 'rgba(139,92,246,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 60px rgba(139,92,246,0.8)',
              }}
            >
              🎉 You found the Easter egg! Welcome to NERP 🎉
            </div>
          </motion.div>
        )}

        {/* Birthday Bash 2026 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col items-center gap-1 mb-6"
        >
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Birthday Bash 2026
          </h2>
        </motion.div>

        {/* Hosted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col items-center gap-1 mb-10"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase"
            style={{ color: 'rgba(196,181,253,0.5)' }}
          >
            Hosted by
          </p>
          <p
            className="text-base sm:text-xl font-bold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(196,181,253,0.9)' }}
          >
            Neil&nbsp; •&nbsp; Eric&nbsp; •&nbsp; Ryan&nbsp; •&nbsp; Paul
          </p>
          <p
            className="text-base sm:text-xl font-bold tracking-[0.2em] uppercase mt-1"
            style={{ color: 'rgba(249,168,212,0.7)' }}
          >
            •&nbsp; Mary&nbsp; •
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/40 mb-4 text-center">
            Countdown to 20 June 2026
          </p>
          <CountdownTimer />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <button
            onClick={onOpenInvite}
            className="group relative px-10 py-4 rounded-2xl font-bold text-lg tracking-wider overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)',
            }}
          >
            {/* Shine sweep on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                transform: 'skewX(-20deg)',
              }}
            />
            <span className="relative text-white">Open Invite</span>

            {/* Ripple ring */}
            <span
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
              style={{
                boxShadow: '0 0 0 3px rgba(139,92,246,0.6)',
                animation: 'ripple 1s ease-out infinite',
              }}
            />
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <motion.div
            className="w-[1px] h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.6), transparent)' }}
            animate={{ scaleY: [0, 1, 0], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
