'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Send, Check, User, Users, Music, MessageSquare } from 'lucide-react';

const FIELD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1, duration: 0.5 } }),
};

function Input({
  label,
  icon: Icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  index,
}: {
  label: string;
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  index: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div custom={index} variants={FIELD_VARIANTS} initial="hidden" animate="visible">
      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-2">
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#8B5CF6' : 'rgba(255,255,255,0.2)' }}
        >
          <Icon size={16} />
        </div>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium placeholder:text-white/20 text-white outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

function Textarea({
  label,
  icon: Icon,
  placeholder,
  value,
  onChange,
  index,
}: {
  label: string;
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  index: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div custom={index} variants={FIELD_VARIANTS} initial="hidden" animate="visible">
      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-2">
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3 top-3.5 pointer-events-none transition-colors duration-200"
          style={{ color: focused ? '#8B5CF6' : 'rgba(255,255,255,0.2)' }}
        >
          <Icon size={16} />
        </div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={3}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium placeholder:text-white/20 text-white outline-none transition-all duration-200 resize-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

function DeclineButton() {
  const btnRef = useRef<HTMLDivElement>(null);
  // Start off-screen until we know the viewport size
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const initialized = useRef(false);

  // Place button at a sensible default once mounted
  useEffect(() => {
    if (!initialized.current) {
      setPos({ x: window.innerWidth / 2 + 80, y: window.innerHeight * 0.8 });
      initialized.current = true;
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPos(p => {
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 110) return p;
      const angle = Math.atan2(dy, dx);
      const nx = p.x - Math.cos(angle) * 130;
      const ny = p.y - Math.sin(angle) * 130;
      return {
        x: Math.max(40, Math.min(window.innerWidth - 80, nx)),
        y: Math.max(40, Math.min(window.innerHeight - 40, ny)),
      };
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={btnRef}
      className="fixed z-[800] pointer-events-none"
      animate={{ x: pos.x - 40, y: pos.y - 16 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
    >
      <button
        className="px-6 py-2 rounded-xl text-xs font-semibold cursor-default select-none"
        style={{
          background: 'rgba(8,6,18,0.7)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        Decline
      </button>
    </motion.div>
  );
}

function fireSuccessConfetti() {
  const end = Date.now() + 2500;
  const colors = ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#ffffff'];
  const frame = () => {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export default function RSVPSection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', guests: '1', song: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    fireSuccessConfetti();
  };

  return (
    <section id="rsvp" className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-purple-400/70 mb-3">
            Secure Your Spot
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
            RSVP
          </h2>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top strip */}
          <div
            className="h-1 w-full"
            style={{
              background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899)',
              backgroundSize: '200% auto',
              animation: 'shimmer 3s linear infinite',
            }}
          />

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Input
                    label="Your Name"
                    icon={User}
                    placeholder="What do they call you?"
                    value={form.name}
                    onChange={v => setForm(f => ({ ...f, name: v }))}
                    index={0}
                  />
                  <Input
                    label="Number of Guests"
                    icon={Users}
                    placeholder="Just you, or bringing the squad?"
                    type="number"
                    value={form.guests}
                    onChange={v => setForm(f => ({ ...f, guests: v }))}
                    index={1}
                  />
                  <Input
                    label="Song Request"
                    icon={Music}
                    placeholder="What must the DJ play?"
                    value={form.song}
                    onChange={v => setForm(f => ({ ...f, song: v }))}
                    index={2}
                  />
                  <Textarea
                    label="Message to NERP"
                    icon={MessageSquare}
                    placeholder="Say something legendary…"
                    value={form.message}
                    onChange={v => setForm(f => ({ ...f, message: v }))}
                    index={3}
                  />

                  <motion.button
                    type="submit"
                    disabled={submitting || !form.name}
                    className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                      boxShadow: '0 0 30px rgba(139,92,246,0.4)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    custom={4}
                    variants={FIELD_VARIANTS}
                    initial="hidden"
                    animate="visible"
                  >
                    {submitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        />
                        <span>Sending RSVP…</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Confirm Attendance</span>
                      </>
                    )}
                  </motion.button>

                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="py-12 text-center"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                      boxShadow: '0 0 40px rgba(139,92,246,0.6)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  >
                    <Check size={28} className="text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    You&apos;re on the list, {form.name}! 🎉
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    NERP has been notified. See you on June 27th.
                    <br />
                    Don&apos;t be late.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Decline button lives outside the card so it can escape freely */}
        {<DeclineButton />}
      </div>
    </section>
  );
}
