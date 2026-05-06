import { useState, useEffect } from 'react';
import { subscribeToPlayerCount } from '../store';

interface HeroProps {
  slotsLeft: number;
  onRegisterClick: () => void;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flip-card">
        <span className="font-orbitron font-black text-2xl sm:text-3xl text-neon-blue">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-gray-500 font-rajdhani text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function Hero({ slotsLeft, onRegisterClick }: HeroProps) {
  const [registeredCount, setRegisteredCount] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [visible, setVisible] = useState(false);

  // Tournament date — May 20, 2026
  const TOURNAMENT_DATE = new Date('2026-05-20T18:00:00+03:00').getTime();

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    // subscribeToPlayerCount uses Firestore onSnapshot when Firebase is configured
    // → instantly updates on ALL devices when anyone registers
    const unsubscribe = subscribeToPlayerCount(count => {
      setRegisteredCount(count);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = TOURNAMENT_DATE - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fillPercent = Math.round((registeredCount / 32) * 100);

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient bg-grid overflow-hidden pt-16">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] bg-neon-pink/4 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">

        {/* Live badge */}
        <div
          className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-neon-blue/10 border border-neon-blue/25 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          id="hero-badge"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-neon-blue" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-neon-blue animate-ping opacity-60" />
          </div>
          <span className="text-neon-blue font-rajdhani font-semibold text-sm uppercase tracking-widest">
            Registration Open — eFootball Championship 2026
          </span>
        </div>

        {/* Main Title */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h1 className="font-orbitron font-black text-white leading-tight">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient animate-gradient">
              TOURNAMENT
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-1">
              REGISTRATION
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className={`text-gray-300 text-lg sm:text-xl font-rajdhani max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Compete for glory and claim your share of the{' '}
          <span className="text-neon-yellow font-bold">1,300 ETB</span> prize pool.{' '}
          Only <span className="text-neon-pink font-bold">32 warriors</span> may enter.
        </p>

        {/* Countdown */}
        <div className={`mb-10 transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-500 font-rajdhani text-xs uppercase tracking-widest mb-4">
            Tournament Starts In
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="font-orbitron text-2xl text-neon-blue/50 mb-4">:</span>
            <CountdownUnit value={countdown.hours} label="Hours" />
            <span className="font-orbitron text-2xl text-neon-blue/50 mb-4">:</span>
            <CountdownUnit value={countdown.minutes} label="Minutes" />
            <span className="font-orbitron text-2xl text-neon-blue/50 mb-4">:</span>
            <CountdownUnit value={countdown.seconds} label="Seconds" />
          </div>
        </div>

        {/* Stats Row */}
        <div className={`grid grid-cols-3 gap-3 sm:gap-4 mb-10 transition-all duration-700 delay-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="glass-card rounded-2xl neon-border p-4 sm:p-6 text-center card-lift">
            <div className="text-2xl sm:text-4xl font-orbitron font-black text-neon-blue mb-1 sm:mb-2 animate-count-pulse">
              {slotsLeft}
            </div>
            <p className="text-gray-400 font-rajdhani text-[10px] sm:text-xs uppercase tracking-widest">Slots Left</p>
          </div>
          <div className="glass-card rounded-2xl neon-border-purple p-4 sm:p-6 text-center card-lift">
            <div className="text-2xl sm:text-4xl font-orbitron font-black text-neon-purple mb-1 sm:mb-2">
              32
            </div>
            <p className="text-gray-400 font-rajdhani text-[10px] sm:text-xs uppercase tracking-widest">Max Players</p>
          </div>
          <div className="glass-card rounded-2xl neon-border-yellow p-4 sm:p-6 text-center card-lift">
            <div className="text-2xl sm:text-4xl font-orbitron font-black text-neon-yellow mb-1 sm:mb-2">
              1.3K
            </div>
            <p className="text-gray-400 font-rajdhani text-[10px] sm:text-xs uppercase tracking-widest">Prize ETB</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`glass-card rounded-2xl neon-border p-5 sm:p-6 mb-10 text-left transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-gray-300 font-rajdhani font-semibold text-sm">Registration Status</span>
            </div>
            <span className="font-orbitron text-sm font-bold text-neon-blue">
              {registeredCount} / 32
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="progress-bar h-2.5 rounded-full"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-neon-green font-rajdhani text-xs font-semibold">{registeredCount} registered</span>
            <span className="text-gray-500 font-rajdhani text-xs">{fillPercent}% full</span>
          </div>
        </div>

        {/* CTA */}
        <div className={`transition-all duration-700 delay-600 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
          {slotsLeft > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-register-btn"
                onClick={onRegisterClick}
                className="group relative px-10 py-4 rounded-xl font-orbitron font-black text-white text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(0,212,255,0.4)] bg-gradient-to-r from-neon-blue to-neon-purple btn-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🎮 Register Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <a
                href="https://t.me/NULLDNF"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl font-rajdhani font-bold text-neon-blue text-base border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
              >
                💬 Join Telegram
              </a>
            </div>
          ) : (
            <div className="glass-card rounded-2xl neon-border-red p-8 max-w-md mx-auto">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-orbitron text-xl font-bold text-red-400 mb-2">Registration Closed</h3>
              <p className="text-gray-400 font-rajdhani">All 32 slots have been filled. Stay tuned for the next tournament!</p>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="text-gray-500 font-rajdhani text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-neon-blue/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
