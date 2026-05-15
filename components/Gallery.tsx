'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const VIDEOS = [
  { src: '/new3.mp4', thumb: '/thumb-new3.jpg', aspect: 'wide' },
  { src: '/v4.mp4', thumb: '/thumb-v4.jpg', aspect: 'square' },
  { src: '/new2.mp4', thumb: '/thumb-new2.jpg', aspect: 'wide' },
  { src: '/v2.mp4', thumb: '/thumb-v2.jpg', aspect: 'square' },
  { src: '/v7.mp4', thumb: '/thumb-v7.jpg', aspect: 'wide' },
  { src: '/new1.mp4', thumb: '/thumb-new1.jpg', aspect: 'wide' },
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

function VideoCard({
  video,
  index,
}: {
  video: (typeof VIDEOS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // On touch devices, play when scrolled into view
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!window.matchMedia('(hover: none)').matches) return;
        if (entry.isIntersecting) {
          el.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          el.pause();
          el.currentTime = 0;
          setPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative group overflow-hidden rounded-2xl ${ASPECT_CLASSES[video.aspect] ?? ''}`}
      style={{ height: ASPECT_HEIGHTS[video.aspect] }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        src={`${BASE}${video.src}`}
        poster={`${BASE}${video.thumb}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        muted
        playsInline
        loop
        preload="metadata"
      />

      {/* Play button — shown until video starts playing */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

    </motion.div>
  );
}

export default function Gallery() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

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
          {VIDEOS.map((video, i) => (
            <VideoCard key={i} video={video} index={i} />
          ))}
        </div>
      </div>

    </section>
  );
}
