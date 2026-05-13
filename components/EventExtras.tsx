'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Share2, MapPin, Cloud, Sun, Wind, Thermometer, Check } from 'lucide-react';

function WeatherWidget() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(6,182,212,0.3)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
          <Cloud size={14} style={{ color: '#06B6D4' }} />
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cyan-400/70">
          Forecast — 20 June 2026
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-5xl font-black text-white">22</span>
            <span className="text-2xl font-bold text-white/60 mb-1">°C</span>
          </div>
          <p className="text-sm text-white/50">Partly Cloudy — Perfect Night</p>
        </div>
        <Sun size={48} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.5))' }} />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
        {[
          { Icon: Wind, label: 'Wind', value: '12 km/h' },
          { Icon: Thermometer, label: 'Humidity', value: '58%' },
          { Icon: Cloud, label: 'Chance', value: '10%' },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={14} className="text-white/30" />
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
            <span className="text-xs font-bold text-white/70">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapWidget() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(236,72,153,0.3)',
      }}
    >
      <div className="p-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)' }}>
          <MapPin size={14} style={{ color: '#EC4899' }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Asgard Cottage</p>
          <p className="text-[10px] text-white/40">Upland Road, Laitumkhrah, Shillong</p>
        </div>
      </div>

      {/* Stylized map placeholder */}
      <div
        className="relative mx-4 mb-4 rounded-xl overflow-hidden h-40"
        style={{ background: '#0d1117' }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
          {/* Roads */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        </svg>

        {/* Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <MapPin size={24} style={{ color: '#EC4899', filter: 'drop-shadow(0 0 8px rgba(236,72,153,0.8))' }} />
          </motion.div>
          <div
            className="w-2 h-2 rounded-full mx-auto -mt-1"
            style={{ background: 'rgba(236,72,153,0.4)', boxShadow: '0 0 8px rgba(236,72,153,0.6)' }}
          />
        </div>

        {/* Label */}
        <div
          className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium text-white"
          style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          Asgard Cottage, Shillong
        </div>
      </div>
    </div>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NERP Birthday Bash 2026',
        text: "You're invited to the most exclusive party of 2026!",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2.5 relative overflow-hidden transition-all duration-200"
      style={{
        background: copied
          ? 'linear-gradient(135deg, #10B981, #059669)'
          : 'rgba(255,255,255,0.05)',
        border: copied
          ? '1px solid rgba(16,185,129,0.4)'
          : '1px solid rgba(255,255,255,0.12)',
        boxShadow: copied ? '0 0 30px rgba(16,185,129,0.3)' : 'none',
      }}
      whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span>Share this Invite</span>
        </>
      )}
    </motion.button>
  );
}

export default function EventExtras() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="info" className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={sectionRef}
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-4">
            <WeatherWidget />
            <ShareButton />
          </div>
          <MapWidget />
        </motion.div>
      </div>
    </section>
  );
}
