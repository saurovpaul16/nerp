'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronUp } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const TRACKS = [
  { title: 'Song', artist: 'Yuno Miles', vibe: 'Party Banger', src: `${BASE}/song.mp3` },
  { title: 'Midnight Ritual', artist: 'NERP Collective', vibe: 'Lo-fi Chill', src: '' },
  { title: 'Neon Overflow', artist: 'Eric & The Blips', vibe: 'Ambient Wave', src: '' },
];

const BAR_DELAYS = [0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.08];

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {BAR_DELAYS.map((delay, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: 'linear-gradient(to top, #8B5CF6, #06B6D4)' }}
          animate={
            playing
              ? { height: ['4px', `${8 + (i * 3) % 12}px`, '4px'] }
              : { height: '4px' }
          }
          transition={{ repeat: Infinity, duration: 0.5 + delay, ease: 'easeInOut', delay }}
        />
      ))}
    </div>
  );
}

interface MusicPlayerProps {
  autoplay?: boolean;
}

export default function MusicPlayer({ autoplay = false }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = TRACKS[trackIndex];

  // Autoplay when splash screen is dismissed
  useEffect(() => {
    if (autoplay && track.src) {
      audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoplay, track.src]);

  // Sync play/pause with audio element
  useEffect(() => {
    if (!audioRef.current || !track.src) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, track.src]);

  // Sync mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.addEventListener('timeupdate', update);
    audio.addEventListener('ended', () => { setPlaying(false); setProgress(0); });
    return () => {
      audio.removeEventListener('timeupdate', update);
    };
  }, []);

  // Load new track when trackIndex changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.load();
    setProgress(0);
    if (playing && track.src) {
      audioRef.current.play().catch(() => setPlaying(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  const nextTrack = useCallback(() => {
    setTrackIndex(i => (i + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setTrackIndex(i => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[900]"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.6, type: 'spring' }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        {track.src && <source src={track.src} type="audio/mpeg" />}
      </audio>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(8,6,18,0.9)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 0 40px rgba(139,92,246,0.15), 0 20px 40px rgba(0,0,0,0.6)',
          width: expanded ? '280px' : 'auto',
        }}
      >
        {/* Collapsed header */}
        <div className="flex items-center gap-3 p-3">
          {/* Vinyl disc */}
          <motion.div
            className="relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: 'conic-gradient(from 0deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)',
            }}
            animate={playing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: '#0a0814', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </motion.div>

          {/* Track info + equalizer */}
          <div className="flex-1 min-w-0" style={{ maxWidth: expanded ? '160px' : '100px' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white text-xs font-semibold truncate">{track.title}</span>
              {playing && <Equalizer playing={playing} />}
            </div>
            <span className="text-white/40 text-[10px] truncate block">{track.vibe}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setMuted(m => !m)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <button
              onClick={() => setPlaying(p => !p)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronUp size={13} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3">
                {/* Progress bar */}
                <div className="mb-3">
                  <div
                    className="relative h-1 rounded-full overflow-hidden cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      setProgress(pct);
                      if (audioRef.current && audioRef.current.duration) {
                        audioRef.current.currentTime = pct * audioRef.current.duration;
                      }
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/30 mt-1">
                    <span>
                      {Math.floor((progress * (audioRef.current?.duration || 0)) / 60)}:
                      {String(Math.floor((progress * (audioRef.current?.duration || 0)) % 60)).padStart(2, '0')}
                    </span>
                    <span>
                      {audioRef.current?.duration
                        ? `${Math.floor(audioRef.current.duration / 60)}:${String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0')}`
                        : '--:--'}
                    </span>
                  </div>
                </div>

                {/* Extended controls */}
                <div className="flex items-center justify-between mb-3">
                  <button onClick={prevTrack} className="text-white/40 hover:text-white transition-colors">
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                      boxShadow: playing ? '0 0 20px rgba(139,92,246,0.6)' : 'none',
                    }}
                  >
                    {playing ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
                  </button>
                  <button onClick={nextTrack} className="text-white/40 hover:text-white transition-colors">
                    <SkipForward size={16} />
                  </button>
                </div>

                {/* Track list */}
                <div className="space-y-1.5">
                  {TRACKS.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => { setTrackIndex(i); setProgress(0); }}
                      className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg transition-colors"
                      style={{
                        background: i === trackIndex ? 'rgba(139,92,246,0.15)' : 'transparent',
                        border: `1px solid ${i === trackIndex ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                      }}
                    >
                      {i === trackIndex && playing ? (
                        <Equalizer playing={true} />
                      ) : (
                        <div className="w-[21px] h-5 flex items-center justify-center">
                          <span className="text-[10px] text-white/30">{i + 1}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-white truncate">{t.title}</p>
                        <p className="text-[9px] text-white/30 truncate">{t.vibe}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
