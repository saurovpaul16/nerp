'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    onEnter(); // call immediately while the user gesture is fresh — enables autoplay
    setExiting(true);
    setTimeout(() => setVisible(false), 1000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#050508' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Neon blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
                filter: 'blur(80px)',
                animation: 'pulse-glow 4s ease-in-out infinite',
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
                filter: 'blur(80px)',
                animation: 'pulse-glow 4s ease-in-out infinite 2s',
              }}
            />
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
            {/* NERP logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.2, 0.65, 0.3, 0.9] }}
            >
              <h1
                className="text-[25vw] sm:text-[18vw] md:text-[15vw] font-black leading-none select-none"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #c4b5fd 40%, #8B5CF6 80%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.7))',
                }}
              >
                NERP
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <p className="text-white/40 text-xs font-semibold tracking-[0.4em] uppercase">
                Birthday Bash 2026
              </p>
              <p className="text-white/25 text-xs tracking-[0.25em] uppercase">
                27 June · Location TBA
              </p>
            </motion.div>

            {/* Enter button */}
            <motion.button
              onClick={handleEnter}
              className="relative mt-4 px-10 py-4 rounded-2xl font-bold text-white text-lg tracking-widest uppercase overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                boxShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(139,92,246,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={exiting ? { scale: 1.05, opacity: 0 } : { opacity: 1, scale: 1 }}
              transition={exiting ? { duration: 0.4 } : { delay: 1.2, duration: 0.6, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Shine sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  transform: 'skewX(-20deg)',
                }}
              />
              <span className="relative flex items-center gap-3">
                <span>Enter</span>
                {/* Pulsing music note */}
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                >
                  🎵
                </motion.span>
              </span>
            </motion.button>

            <motion.p
              className="text-white/20 text-xs tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              Turn up your volume
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
