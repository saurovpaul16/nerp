'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const STATS = [
  { label: 'Vibe', value: 'Immaculate' },
  { label: 'Role', value: 'Scene Stealer' },
  { label: 'Threat Level', value: 'Maximum' },
];

export default function SideCharacter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Subtle pink blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto" ref={ref}>
        {/* Section label */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.3))' }} />
          <span
            className="text-xs font-bold tracking-[0.4em] uppercase px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(236,72,153,0.1)',
              border: '1px solid rgba(236,72,153,0.3)',
              color: '#f9a8d4',
            }}
          >
            Side Character
          </span>
          <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.3), transparent)' }} />
        </motion.div>

        {/* Card */}
        <motion.div
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(236,72,153,0.25)',
              boxShadow: '0 0 40px rgba(236,72,153,0.08), 0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Top strip */}
            <div
              className="h-1 w-full"
              style={{
                background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #EC4899)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
              }}
            />

            {/* Photo */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={`${BASE}/mary.jpg`}
                alt="Mary"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, transparent 50%, rgba(5,5,8,0.95) 100%)',
                }}
              />
              {/* Floating badge */}
              <div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(236,72,153,0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  boxShadow: '0 0 16px rgba(236,72,153,0.5)',
                }}
              >
                Wannabe Host
              </div>
            </div>

            <div className="px-6 pb-6 -mt-4 relative">
              {/* Name */}
              <h3
                className="text-4xl font-black mb-1"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #f9a8d4 50%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.5))',
                }}
              >
                Mary
              </h3>
              <p className="text-white/40 text-xs tracking-wider mb-5">
                &quot;The one who actually keeps things together.&quot;
              </p>

              {/* Divider */}
              <div
                className="h-[1px] w-full mb-5"
                style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.4), transparent)' }}
              />

              {/* Stats */}
              <div className="space-y-3">
                {STATS.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30">
                      {label}
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(236,72,153,0.1)',
                        border: '1px solid rgba(236,72,153,0.25)',
                        color: '#f9a8d4',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom strip */}
            <div
              className="h-1 w-full"
              style={{
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite reverse',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
