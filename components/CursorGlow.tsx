'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring for the outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Trails
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);
  const frameRef = useRef<number>(0);
  const lastPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      // Spawn a trail spark
      const id = trailIdRef.current++;
      setTrails(prev => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id }]);
    };

    const hide = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', hide);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', hide);
      cancelAnimationFrame(frameRef.current);
    };
  }, [cursorX, cursorY]);

  // Clean up trails over time
  useEffect(() => {
    if (trails.length === 0) return;
    const timeout = setTimeout(() => {
      setTrails(prev => prev.slice(1));
    }, 120);
    return () => clearTimeout(timeout);
  }, [trails]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #fff 0%, #8B5CF6 60%, transparent 100%)',
            boxShadow: '0 0 12px 4px rgba(139,92,246,0.8)',
          }}
        />
      </motion.div>

      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 0.6 : 0,
        }}
      >
        <div
          className="w-8 h-8 rounded-full border"
          style={{
            borderColor: 'rgba(139,92,246,0.6)',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}
        />
      </motion.div>

      {/* Spark trails */}
      {trails.map((trail, i) => (
        <motion.div
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-screen"
          style={{
            x: trail.x,
            y: trail.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div
            className="rounded-full"
            style={{
              width: `${Math.max(2, 6 - i * 0.4)}px`,
              height: `${Math.max(2, 6 - i * 0.4)}px`,
              background: i % 2 === 0 ? '#8B5CF6' : '#06B6D4',
              boxShadow: `0 0 6px 2px ${i % 2 === 0 ? 'rgba(139,92,246,0.6)' : 'rgba(6,182,212,0.6)'}`,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
