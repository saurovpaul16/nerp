'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const HOSTS = [
  {
    name: 'Neil',
    initial: 'N',
    photo: '/neil.jpg',
    tagline: 'The architect of mayhem.',
    color: '#8B5CF6',
    accent: 'rgba(139,92,246,0.2)',
    border: 'rgba(139,92,246,0.4)',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    emoji: '🏛️',
  },
  {
    name: 'Eric',
    initial: 'E',
    photo: '/eric.jpg',
    tagline: 'Chaotically organised. Somehow.',
    color: '#06B6D4',
    accent: 'rgba(6,182,212,0.2)',
    border: 'rgba(6,182,212,0.4)',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    emoji: '⚡',
  },
  {
    name: 'Ryan',
    initial: 'R',
    photo: '/ryan.jpg',
    tagline: 'Arrived two hours early; called it fashionable.',
    color: '#EC4899',
    accent: 'rgba(236,72,153,0.2)',
    border: 'rgba(236,72,153,0.4)',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    emoji: '🎭',
  },
  {
    name: 'Paul',
    initial: 'P',
    photo: '/paul.jpg',
    tagline: 'The vibes curator. No notes.',
    color: '#F59E0B',
    accent: 'rgba(245,158,11,0.2)',
    border: 'rgba(245,158,11,0.4)',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    emoji: '🎶',
  },
];

function HostCard({
  host,
  index,
}: {
  host: (typeof HOSTS)[0];
  index: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      <motion.div
        ref={ref}
        className="relative rounded-3xl cursor-pointer overflow-hidden group"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${host.border}`,
        }}
        onMouseMove={handleMouse}
        onMouseLeave={resetMouse}
        whileHover={{
          boxShadow: `0 0 30px ${host.accent}, 0 0 60px ${host.accent}, 0 20px 40px rgba(0,0,0,0.4)`,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Full-width photo panel */}
        <div className="relative w-full h-52 overflow-hidden">
          {host.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${BASE}${host.photo}`}
              alt={host.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-6xl font-black text-white"
              style={{ background: host.gradient }}
            >
              {host.initial}
            </div>
          )}
          {/* Gradient fade to card body */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.95), transparent)' }}
          />
          {/* Emoji badge */}
          <span className="absolute top-3 right-3 text-xl bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            {host.emoji}
          </span>
        </div>

        {/* Text body */}
        <div className="px-5 pb-5 pt-3 text-center">
          <h3
            className="text-xl font-black tracking-tight mb-1"
            style={{ color: host.color }}
          >
            {host.name}
          </h3>
          <p className="text-xs text-white/50 font-medium leading-relaxed">
            &ldquo;{host.tagline}&rdquo;
          </p>
          <div
            className="w-10 h-0.5 rounded-full mx-auto mt-3"
            style={{ background: host.gradient }}
          />
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 30%, ${host.accent} 0%, transparent 65%)` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HostShowcase() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="hosts" className="relative py-24 px-4 overflow-hidden">
      {/* Background accent blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-purple-400/70 mb-3">
            Your Hosts Tonight
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Meet NERP
          </h2>
          <p className="mt-4 text-white/40 text-base max-w-md mx-auto">
            Five friends. One legendary night. Expect nothing less than perfection.
          </p>
        </motion.div>

        {/* Host cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {HOSTS.map((host, i) => (
            <HostCard key={host.name} host={host} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
