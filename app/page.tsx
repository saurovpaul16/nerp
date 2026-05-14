'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import Hero from '@/components/Hero';
import InvitationCard from '@/components/InvitationCard';
import HostShowcase from '@/components/HostShowcase';
import PartyTimeline from '@/components/PartyTimeline';
import Gallery from '@/components/Gallery';
import RSVPSection from '@/components/RSVPSection';
import MusicPlayer from '@/components/MusicPlayer';
import GreetingPopup from '@/components/GreetingPopup';
import EventExtras from '@/components/EventExtras';
import SideCharacter from '@/components/SideCharacter';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/CursorGlow'), { ssr: false });

export default function Home() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Cinematic splash screen — blocks page until user clicks Enter */}
      {!entered && <SplashScreen onEnter={() => setEntered(true)} />}

      <ParticleBackground />
      <CursorGlow />
      <GreetingPopup />

      {/* Music player — autoplays once splash is dismissed */}
      <MusicPlayer autoplay={entered} />

      <nav
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(5,5,8,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <span
          className="text-xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 60%, #67e8f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          NERP
        </span>
        <div className="hidden md:flex items-center gap-8">
          {['#hosts', '#timeline', '#gallery', '#rsvp'].map(href => (
            <a
              key={href}
              href={href}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 hover:text-white/80 transition-colors"
            >
              {href.slice(1)}
            </a>
          ))}
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            boxShadow: '0 0 20px rgba(139,92,246,0.3)',
          }}
        >
          Open Invite
        </button>
      </nav>

      <Hero onOpenInvite={() => setInviteOpen(true)} />
      <HostShowcase />
      <SideCharacter />
      <PartyTimeline />
      <Gallery />
      <EventExtras />
      <RSVPSection />
      <Footer />

      <InvitationCard open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </main>
  );
}
