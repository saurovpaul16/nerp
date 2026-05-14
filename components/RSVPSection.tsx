'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Send, Check, User, Users, Music, MessageSquare, Download, X } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  const dodge = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const btnWidth = 90;
    const pointerX = clientX - rect.left;
    const center = rect.width / 2;
    const maxShift = rect.width / 2 - btnWidth / 2 - 8;
    if (Math.abs(pointerX - (center + x)) < 80) {
      const dir = pointerX < center + x ? 1 : -1;
      setX(prev => Math.max(-maxShift, Math.min(maxShift, prev + dir * 100)));
    }
  }, [x]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    dodge(e.clientX);
  }, [dodge]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    dodge(e.touches[0].clientX);
  }, [dodge]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex justify-center mt-3 h-10 overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <motion.button
        className="absolute cursor-default select-none px-6 py-2 rounded-xl text-xs font-semibold"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.25)',
        }}
        animate={{ x }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        Decline
      </motion.button>
    </div>
  );
}

function generateInvite(name: string) {
  const W = 1000, H = 580;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background ──────────────────────────────────────────────
  ctx.fillStyle = '#06040f';
  ctx.fillRect(0, 0, W, H);

  // Glow blobs
  const blobs: [number, number, number, string][] = [
    [200, 200, 320, 'rgba(139,92,246,0.22)'],
    [800, 420, 260, 'rgba(6,182,212,0.16)'],
    [500, 560, 200, 'rgba(236,72,153,0.12)'],
  ];
  blobs.forEach(([x, y, r, color]) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // Scanlines
  ctx.fillStyle = 'rgba(255,255,255,0.012)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);

  // ── Border & strips ─────────────────────────────────────────
  const rainbow = ctx.createLinearGradient(0, 0, W, 0);
  rainbow.addColorStop(0, '#8B5CF6');
  rainbow.addColorStop(0.4, '#06B6D4');
  rainbow.addColorStop(0.7, '#EC4899');
  rainbow.addColorStop(1, '#8B5CF6');

  ctx.fillStyle = rainbow;
  ctx.fillRect(0, 0, W, 5);
  ctx.fillRect(0, H - 5, W, 5);

  ctx.strokeStyle = 'rgba(139,92,246,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Inner border inset
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  // Corner decorations
  const corners: [number, number, number, number][] = [
    [14, 14, 30, 0], [W - 14, 14, W - 44, 0],
    [14, H - 14, 30, H], [W - 14, H - 14, W - 44, H],
  ];
  ctx.strokeStyle = 'rgba(139,92,246,0.6)';
  ctx.lineWidth = 2;
  corners.forEach(([x, y, ex, ey]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, ey > y ? y + 16 : y - 16); ctx.stroke();
  });

  // ── Left panel: NERP + hosts ─────────────────────────────────
  const nerp = ctx.createLinearGradient(50, 80, 50, 220);
  nerp.addColorStop(0, '#ffffff');
  nerp.addColorStop(0.35, '#c4b5fd');
  nerp.addColorStop(0.8, '#8B5CF6');
  nerp.addColorStop(1, '#06B6D4');
  ctx.font = '900 72px Arial Black, Arial, sans-serif';
  ctx.fillStyle = nerp;
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(139,92,246,0.7)';
  ctx.shadowBlur = 20;
  ctx.fillText('NERP', 52, 180);
  ctx.shadowBlur = 0;

  ctx.font = '700 12px Arial, sans-serif';
  ctx.fillStyle = 'rgba(139,92,246,0.75)';
  ctx.fillText('B I R T H D A Y   B A S H   2 0 2 6', 54, 238);

  // Thin horizontal rule under subtitle
  const lhr = ctx.createLinearGradient(52, 0, 320, 0);
  lhr.addColorStop(0, 'rgba(139,92,246,0.7)');
  lhr.addColorStop(1, 'transparent');
  ctx.fillStyle = lhr;
  ctx.fillRect(52, 250, 270, 1);

  // Hosted by
  ctx.font = '500 11px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('HOSTED BY', 52, 280);
  ctx.font = '700 15px Arial, sans-serif';
  ctx.fillStyle = 'rgba(196,181,253,0.85)';
  ctx.fillText('Neil  •  Eric  •  Ryan  •  Paul', 52, 302);

  // ── Vertical divider ─────────────────────────────────────────
  const vd = ctx.createLinearGradient(0, 60, 0, H - 60);
  vd.addColorStop(0, 'transparent');
  vd.addColorStop(0.2, 'rgba(139,92,246,0.5)');
  vd.addColorStop(0.8, 'rgba(6,182,212,0.4)');
  vd.addColorStop(1, 'transparent');
  ctx.fillStyle = vd;
  ctx.fillRect(370, 40, 1, H - 80);

  // ── Right panel ───────────────────────────────────────────────
  const RX = 400;

  // "EXCLUSIVE INVITATION"
  ctx.font = '700 10px Arial, sans-serif';
  ctx.fillStyle = 'rgba(236,72,153,0.7)';
  ctx.fillText('✦  E X C L U S I V E   I N V I T A T I O N  ✦', RX, 70);

  // "You're invited,"
  ctx.font = '400 18px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText("You're invited,", RX, 120);

  // Guest name — auto-size
  let fs = 68;
  ctx.font = `900 ${fs}px Arial Black, Arial, sans-serif`;
  while (ctx.measureText(name).width > W - RX - 50 && fs > 28) {
    fs -= 2;
    ctx.font = `900 ${fs}px Arial Black, Arial, sans-serif`;
  }
  const nameGrad = ctx.createLinearGradient(RX, 130, RX, 130 + fs);
  nameGrad.addColorStop(0, '#ffffff');
  nameGrad.addColorStop(0.5, '#c4b5fd');
  nameGrad.addColorStop(1, '#67e8f9');
  ctx.fillStyle = nameGrad;
  ctx.shadowColor = 'rgba(139,92,246,0.5)';
  ctx.shadowBlur = 20;
  ctx.fillText(name, RX, 130 + fs);
  ctx.shadowBlur = 0;

  // Rule under name
  const nhr = ctx.createLinearGradient(RX, 0, W - 40, 0);
  nhr.addColorStop(0, 'rgba(139,92,246,0.7)');
  nhr.addColorStop(0.6, 'rgba(6,182,212,0.4)');
  nhr.addColorStop(1, 'transparent');
  const nameBottom = 130 + fs + 14;
  ctx.fillStyle = nhr;
  ctx.fillRect(RX, nameBottom, W - RX - 40, 1);

  // Event details grid
  const details = [
    { label: 'DATE', value: 'Saturday, 27 June 2026' },
    { label: 'TIME', value: '7:00 PM — Late' },
    { label: 'VENUE', value: 'To be announced soon' },
  ];
  const detailY = nameBottom + 28;
  details.forEach(({ label, value }, i) => {
    const col = i < 2 ? RX : RX;
    const row = i < 2 ? detailY + i * 58 : detailY + 116;
    ctx.font = '700 9px Arial, sans-serif';
    ctx.fillStyle = 'rgba(139,92,246,0.75)';
    ctx.fillText(label, col, row);
    ctx.font = '600 15px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillText(value, col, row + 20);
  });

  // ── Code word box ─────────────────────────────────────────────
  const codeY = H - 108;
  const codeX = RX;
  const codeW = W - RX - 40;
  const codeH = 62;

  // Box background
  ctx.fillStyle = 'rgba(139,92,246,0.08)';
  roundRect(ctx, codeX, codeY, codeW, codeH, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(139,92,246,0.35)';
  ctx.lineWidth = 1;
  roundRect(ctx, codeX, codeY, codeW, codeH, 10);
  ctx.stroke();

  ctx.font = '700 9px Arial, sans-serif';
  ctx.fillStyle = 'rgba(139,92,246,0.7)';
  ctx.fillText('🔐  SECRET ENTRY CODE', codeX + 14, codeY + 20);

  ctx.font = '900 20px Arial Black, Arial, sans-serif';
  const codeGrad = ctx.createLinearGradient(codeX, 0, codeX + codeW, 0);
  codeGrad.addColorStop(0, '#c4b5fd');
  codeGrad.addColorStop(0.5, '#67e8f9');
  codeGrad.addColorStop(1, '#f9a8d4');
  ctx.fillStyle = codeGrad;
  ctx.fillText('SKIBIDI NERP', codeX + 14, codeY + 48);

  // ── Footer ────────────────────────────────────────────────────
  ctx.font = '500 10px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.textAlign = 'left';
  ctx.fillText('This invite is personal and non-transferable.', 52, H - 20);
  ctx.fillStyle = 'rgba(139,92,246,0.45)';
  ctx.textAlign = 'right';
  ctx.fillText('nerp2026.party', W - 40, H - 20);

  return canvas.toDataURL('image/jpeg', 0.95);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
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
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

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
                        <span>Get Your Invite</span>
                      </>
                    )}
                  </motion.button>
                  <DeclineButton />
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
                  <p className="text-white/50 text-sm leading-relaxed mb-8">
                    NERP has been notified. See you on June 27th.
                    <br />
                    Don&apos;t be late.
                  </p>
                  <motion.button
                    onClick={() => setInviteUrl(generateInvite(form.name))}
                    className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-bold text-sm text-white"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                      boxShadow: '0 0 24px rgba(139,92,246,0.4)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ✦ Show Your Invite
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Invite preview modal */}
      <AnimatePresence>
        {inviteUrl && (
          <motion.div
            className="fixed inset-0 z-[600] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}
              onClick={() => setInviteUrl(null)}
            />
            <motion.div
              className="relative z-10 flex flex-col items-center gap-5 w-full max-w-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              {/* Close */}
              <button
                onClick={() => setInviteUrl(null)}
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X size={16} />
              </button>

              {/* Invite image */}
              <img
                src={inviteUrl}
                alt="Your NERP Invite"
                className="w-full rounded-2xl"
                style={{ boxShadow: '0 0 60px rgba(139,92,246,0.4), 0 30px 60px rgba(0,0,0,0.7)' }}
              />

              {/* Download button */}
              <a
                href={inviteUrl}
                download={`NERP-invite-${form.name.replace(/\s+/g, '-')}.jpg`}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  boxShadow: '0 0 24px rgba(139,92,246,0.4)',
                }}
              >
                <Download size={16} />
                Download Invite
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
