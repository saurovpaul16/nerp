'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const EVENTS = [
  { time: '5:00 PM', title: 'Doors Open', desc: 'Step into the night. BYOB — bring your finest.', icon: '🚪', color: '#8B5CF6' },
  { time: '6:00 PM', title: 'Pool Time', desc: 'Dive in. The water is calling.', icon: '🏊', color: '#06B6D4' },
  { time: '7:30 PM', title: 'Music & Dance', desc: 'The playlist drops. The floor is yours. Vibes only.', icon: '🎶', color: '#EC4899' },
  { time: '9:00 PM', title: 'Dinner', desc: 'Good food, good company.', icon: '🍽️', color: '#34D399' },
  { time: '10:00 PM', title: 'Cake Cutting', desc: 'The moment. All four candles blown at once.', icon: '🎂', color: '#F59E0B' },
  { time: 'Midnight', title: 'Chaos Begins', desc: 'What happens at NERP, stays at NERP. 🤫', icon: '💥', color: '#F472B6' },
];

function TimelineItem({
  event,
  index,
  total,
}: {
  event: (typeof EVENTS)[0];
  index: number;
  total: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'} md:w-[calc(50%-2rem)] ${
        isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
      }`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {/* Dot on the center line — only visible on md+ */}
      <div
        className={`hidden md:flex absolute ${
          isLeft ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
        } top-1/2 -translate-y-1/2 w-5 h-5 rounded-full z-10 items-center justify-center`}
        style={{ background: event.color, boxShadow: `0 0 15px ${event.color}` }}
      >
        <div className="w-2 h-2 rounded-full bg-white/80" />
      </div>

      {/* Card */}
      <motion.div
        className="flex-1 rounded-2xl p-5 group relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${event.color}30`,
        }}
        whileHover={{
          boxShadow: `0 0 30px ${event.color}40, 0 10px 30px rgba(0,0,0,0.4)`,
          borderColor: `${event.color}60`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${event.color}12 0%, transparent 70%)`,
          }}
        />

        {/* Time badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xl"
            style={{ filter: `drop-shadow(0 0 6px ${event.color})` }}
          >
            {event.icon}
          </span>
          <span
            className="text-xs font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
            style={{
              background: `${event.color}20`,
              border: `1px solid ${event.color}40`,
              color: event.color,
            }}
          >
            {event.time}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{event.desc}</p>
      </motion.div>
    </motion.div>
  );
}

export default function PartyTimeline() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="timeline" ref={scrollRef} className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 top-1/2 w-72 h-72 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-pink-400/70 mb-3">
            The Schedule
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #f9a8d4 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Party Timeline
          </h2>
        </motion.div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Center vertical line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, #8B5CF6, #06B6D4, #EC4899)',
                boxShadow: '0 0 10px rgba(139,92,246,0.5)',
              }}
            />
          </div>

          {/* Mobile left line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-[1px] overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, #8B5CF6, #06B6D4, #EC4899)',
              }}
            />
          </div>

          <div className="flex flex-col gap-8 md:gap-12">
            {EVENTS.map((event, i) => (
              <TimelineItem key={event.time} event={event} index={i} total={EVENTS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
