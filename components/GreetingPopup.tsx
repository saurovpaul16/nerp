'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const MESSAGES = [
  { text: 'NERP is expecting you', emoji: '👀' },
  { text: 'Your presence is required', emoji: '🫵' },
  { text: 'The party begins soon', emoji: '🎉' },
  { text: 'Dress to impress', emoji: '✨' },
];

export default function GreetingPopup() {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      startTyping(MESSAGES[0].text);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const startTyping = (text: string) => {
    setTyped('');
    setTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 45);
  };

  const handleNext = () => {
    const next = (msgIndex + 1) % MESSAGES.length;
    setMsgIndex(next);
    startTyping(MESSAGES[next].text);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-[999] max-w-xs w-full"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: 'rgba(10,8,20,0.85)',
              backdropFilter: 'blur(32px)',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow:
                '0 0 40px rgba(139,92,246,0.25), 0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Animated top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #8B5CF6, #06B6D4, #8B5CF6, transparent)',
                animation: 'shimmer 3s linear infinite',
                backgroundSize: '200% auto',
              }}
            />

            {/* Close button */}
            <button
              onClick={() => setVisible(false)}
              className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
            >
              <X size={14} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.4)',
                  color: '#8B5CF6',
                }}
              >
                <Sparkles size={10} />
                <span>NERP AI</span>
              </div>
              <div className="flex gap-1 ml-auto mr-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-purple-400"
                    animate={{ scale: typing ? [1, 1.4, 1] : 1, opacity: typing ? [0.5, 1, 0.5] : 0.3 }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>

            {/* Message */}
            <p className="text-white font-medium text-sm leading-relaxed min-h-[1.5em]">
              {typed}
              {typing && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-text-bottom"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              )}
              {!typing && (
                <span className="ml-2 text-lg">{MESSAGES[msgIndex].emoji}</span>
              )}
            </p>

            {/* Footer action */}
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={handleNext}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Next message →
              </button>
              <span className="text-xs text-white/30">
                {msgIndex + 1} / {MESSAGES.length}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
