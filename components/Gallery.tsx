'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

// Gradient "photo" placeholders with descriptive captions
const PHOTOS = [
  { gradient: 'linear-gradient(135deg, #1a0533 0%, #6D28D9 50%, #312E81 100%)', caption: 'Last year\'s chaos 🎉', aspect: 'tall', year: '2025' },
  { gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0891B2 50%, #164e63 100%)', caption: 'The pre-game vibes', aspect: 'wide', year: '2024' },
  { gradient: 'linear-gradient(135deg, #4a1942 0%, #BE185D 50%, #831843 100%)', caption: 'Neil\'s legendary entrance', aspect: 'square', year: '2025' },
  { gradient: 'linear-gradient(135deg, #78350f 0%, #D97706 50%, #92400e 100%)', caption: 'Paul on the decks 🎶', aspect: 'wide', year: '2024' },
  { gradient: 'linear-gradient(135deg, #14532d 0%, #16A34A 50%, #166534 100%)', caption: 'Eric\'s cake face 😂', aspect: 'tall', year: '2023' },
  { gradient: 'linear-gradient(135deg, #1e1b4b 0%, #7C3AED 40%, #0891B2 100%)', caption: 'The whole squad', aspect: 'square', year: '2025' },
  { gradient: 'linear-gradient(135deg, #450a0a 0%, #DC2626 50%, #7f1d1d 100%)', caption: 'Ryan\'s speech 🎤', aspect: 'wide', year: '2024' },
  { gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 50%, #1e293b 100%)', caption: 'After midnight 🌙', aspect: 'tall', year: '2023' },
  { gradient: 'linear-gradient(135deg, #1a0533 0%, #EC4899 40%, #7C3AED 100%)', caption: 'Dance floor takeover', aspect: 'square', year: '2025' },
];

const ASPECT_CLASSES: Record<string, string> = {
  tall: 'row-span-2',
  wide: '',
  square: '',
};

const ASPECT_HEIGHTS: Record<string, string> = {
  tall: '320px',
  wide: '150px',
  square: '200px',
};

function PhotoCard({
  photo,
  index,
  onClick,
}: {
  photo: (typeof PHOTOS)[0];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [loaded, setLoaded] = useState(false);

  // Simulate "loading" for cinematic effect
  useState(() => {
    const t = setTimeout(() => setLoaded(true), 200 + index * 120);
    return () => clearTimeout(t);
  });

  return (
    <motion.div
      ref={ref}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl ${ASPECT_CLASSES[photo.aspect] ?? ''}`}
      style={{ height: ASPECT_HEIGHTS[photo.aspect] }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      onClick={onClick}
    >
      {/* Polaroid-style border */}
      <div
        className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      />

      {/* Gradient image */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        style={{ background: photo.gradient }}
      />

      {/* Loading shimmer overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="absolute inset-0 z-20"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)',
              backgroundSize: '200% auto',
              animation: 'shimmer 1.5s linear infinite',
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Loading text */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            exit={{ opacity: 0 }}
          >
            <span className="text-xs text-white/30 font-medium tracking-widest uppercase">
              memories loading…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col items-center justify-center gap-2">
        <ZoomIn size={22} className="text-white" />
        <span className="text-xs font-medium text-white/80">{photo.year}</span>
      </div>

      {/* Caption */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 p-3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      >
        <p className="text-xs font-medium text-white/80">{photo.caption}</p>
      </div>
    </motion.div>
  );
}

function Lightbox({ photo, onClose }: { photo: (typeof PHOTOS)[0]; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[600] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      />
      <motion.div
        className="relative max-w-lg w-full rounded-3xl overflow-hidden z-10"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 250, damping: 24 }}
      >
        <div className="w-full h-80" style={{ background: photo.gradient }} />
        <div
          className="p-4"
          style={{
            background: 'rgba(10,8,20,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: 'none',
          }}
        >
          <p className="text-white font-medium">{photo.caption}</p>
          <p className="text-sm text-white/40 mt-1">{photo.year}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
        >
          <X size={14} />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [selected, setSelected] = useState<(typeof PHOTOS)[0] | null>(null);

  return (
    <section id="gallery" className="relative py-24 px-4 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-cyan-400/70 mb-3">
            The Archives
          </p>
          <h2
            className="text-5xl sm:text-6xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #67e8f9 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Gallery
          </h2>
          <p className="mt-4 text-white/40 text-sm max-w-sm mx-auto">
            Proof that we know how to party. Every. Single. Time.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          style={{ gridAutoRows: 'auto' }}
        >
          {PHOTOS.map((photo, i) => (
            <PhotoCard key={i} photo={photo} index={i} onClick={() => setSelected(photo)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
