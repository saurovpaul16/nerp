'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MapPin, Clock, Shirt, Calendar, X, Wine } from 'lucide-react';

interface InvitationCardProps {
  open: boolean;
  onClose: () => void;
}

const DETAILS = [
  { icon: Calendar, label: 'Date', value: 'Saturday, 20 June 2026' },
  { icon: Clock, label: 'Time', value: '4:00 PM — Late' },
  { icon: MapPin, label: 'Venue', value: 'To be announced soon' },
  { icon: Shirt, label: 'Dress Code', value: 'Tropical Drip Only 🌴' },
  { icon: Wine, label: 'Drinks', value: 'BYOB 🍾' },

];

function fireConfetti() {
  const count = 180;
  const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 };
  const colors = ['#8B5CF6', '#06B6D4', '#EC4899', '#C0C0C0', '#ffffff', '#F59E0B'];

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const fire = (particleRatio: number, opts: Record<string, unknown>) => {
    confetti({ ...defaults, ...opts, colors, particleCount: Math.floor(count * particleRatio) });
  };

  fire(0.25, { spread: 26, startVelocity: 55, origin: { x: 0.5, y: 0.6 } });
  fire(0.2, { spread: 60, origin: { x: 0.5, y: 0.6 } });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 0.5, y: 0.6 } });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, origin: { x: 0.5, y: 0.6 } });
  fire(0.1, { spread: 120, startVelocity: 45, origin: { x: 0.5, y: 0.6 } });
}

export default function InvitationCard({ open, onClose }: InvitationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  // 3-D tilt via mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const resetMouse = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Fire confetti once when card opens
  useEffect(() => {
    if (open && !confettiFired) {
      const t = setTimeout(() => {
        fireConfetti();
        setConfettiFired(true);
      }, 400);
      return () => clearTimeout(t);
    }
    if (!open) setConfettiFired(false);
  }, [open, confettiFired]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            ref={cardRef}
            className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto"
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateY: -90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onMouseMove={handleMouse}
            onMouseLeave={resetMouse}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <X size={16} />
            </button>

            {/* Main card face */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(20,10,40,0.95) 0%, rgba(10,8,25,0.95) 100%)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow:
                  '0 0 0 1px rgba(6,182,212,0.1), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(139,92,246,0.3)',
              }}
            >
              {/* Top gradient strip */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    'linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                }}
              />

              <div className="p-8">
                {/* Holographic logo */}
                <div className="flex flex-col items-center mb-8">
                  <motion.div
                    className="text-7xl font-black mb-1 select-none"
                    style={{
                      background:
                        'linear-gradient(135deg, #fff 0%, #c4b5fd 30%, #67e8f9 60%, #f9a8d4 80%, #fff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      backgroundSize: '300% 300%',
                      animation: 'holographic 4s ease infinite',
                      filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.8))',
                    }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  >
                    NERP
                  </motion.div>
                  <span
                    className="text-xs font-semibold tracking-[0.4em] uppercase"
                    style={{ color: 'rgba(139,92,246,0.7)' }}
                  >
                    Birthday Bash 2026
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="h-[1px] w-full mb-8 mx-auto"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(6,182,212,0.6), transparent)',
                  }}
                />

                {/* Detail rows */}
                <div className="space-y-5">
                  {DETAILS.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(139,92,246,0.15)',
                          border: '1px solid rgba(139,92,246,0.3)',
                        }}
                      >
                        <Icon size={16} style={{ color: '#a78bfa' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-medium text-white/90 leading-relaxed whitespace-pre-line">
                          {value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* RSVP note */}
                <motion.div
                  className="mt-8 rounded-2xl p-4 text-center"
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.25)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xs font-medium text-purple-300/80 mb-3">
                    RSVP by 10 June 2026
                  </p>
                  <a
                    href="#rsvp"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                      boxShadow: '0 0 20px rgba(139,92,246,0.35)',
                    }}
                  >
                    Get Your Invite
                  </a>
                </motion.div>
              </div>

              {/* Bottom gradient strip */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    'linear-gradient(90deg, #06B6D4, #EC4899, #8B5CF6, #06B6D4)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite reverse',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
