'use client';

import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Hosts', href: '#hosts' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'RSVP', href: '#rsvp' },
];

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 overflow-hidden border-t border-white/[0.04]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          className="text-4xl font-black"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.4))',
          }}
          whileHover={{ scale: 1.05 }}
        >
          NERP
        </motion.div>

        {/* Nav */}
        <nav className="flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 hover:text-white/80 transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div
          className="w-48 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)',
          }}
        />

        {/* Date */}
        <div className="text-center">
          <p className="text-sm font-medium text-white/50">
            Saturday, 27 June 2026 · 7 PM · Asgard Cottage, Shillong
          </p>
          <p className="text-xs text-white/20 mt-2">
            © 2026 NERP Birthday Bash. All vibes reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
