import { useState, useEffect } from 'react';
import { getWinner } from '../store';
import type { Winner } from '../types';

interface Confetto {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

function ConfettiPiece({ confetto }: { confetto: Confetto }) {
  return (
    <div
      className="confetti-particle"
      style={{
        left: `${confetto.x}%`,
        top: '-20px',
        width: `${confetto.size}px`,
        height: `${confetto.size * 1.5}px`,
        backgroundColor: confetto.color,
        animationDuration: `${confetto.duration}s`,
        animationDelay: `${confetto.delay}s`,
      }}
    />
  );
}

export default function WinnerDashboard() {
  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState<Confetto[]>([]);

  useEffect(() => {
    getWinner().then(w => {
      setWinner(w);
      setLoading(false);
      if (w) {
        setTimeout(() => setRevealed(true), 300);
        // Generate confetti
        const colors = ['#00d4ff', '#a855f7', '#ec4899', '#facc15', '#22c55e', '#f97316'];
        setConfetti(
          Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
            size: 6 + Math.floor(Math.random() * 8),
          }))
        );
      }
    });
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center hero-gradient bg-grid pt-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-neon-blue/30 border-t-neon-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-rajdhani">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient bg-grid overflow-hidden pt-16 pb-10">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-neon-yellow/8 rounded-full blur-[100px] animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-yellow/5 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-neon-purple/8 rounded-full blur-[60px] animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Confetti */}
      {winner && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confetti.map(c => <ConfettiPiece key={c.id} confetto={c} />)}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center w-full">
        {!winner ? (
          <div className={`glass-card rounded-3xl neon-border p-12 max-w-2xl mx-auto transition-all duration-700 ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-20 h-20 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏆</span>
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-bold text-white mb-4">
              Tournament Results
            </h1>
            <p className="text-gray-400 text-lg font-rajdhani mb-8">
              The winner has not been announced yet.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500 font-rajdhani text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
              Stay tuned for the announcement!
            </div>
          </div>
        ) : (
          <div className={`space-y-8 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neon-yellow/10 border border-neon-yellow/30 animate-glow-pulse-yellow">
              <div className="w-3 h-3 rounded-full bg-neon-yellow animate-pulse" />
              <span className="text-neon-yellow text-sm font-rajdhani font-bold tracking-widest uppercase">
                🎊 Tournament Champion Announced 🎊
              </span>
            </div>

            {/* Trophy */}
            <div className="text-8xl sm:text-9xl animate-float">🏆</div>

            {/* Winner Card */}
            <div className={`glass-card rounded-3xl neon-border-yellow p-10 sm:p-14 max-w-2xl mx-auto shadow-2xl shadow-neon-yellow/10 ${revealed ? 'animate-winner-reveal' : ''}`}>
              {/* Crown */}
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '0.5s' }}>👑</div>

              <p className="text-gray-400 font-rajdhani uppercase tracking-widest text-sm mb-3">
                Champion of
              </p>
              <p className="text-neon-yellow font-rajdhani font-bold text-base mb-6">
                {winner.tournamentName}
              </p>

              {/* Winner Name */}
              <h1 className="font-orbitron font-black prize-gold leading-none mb-8"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
                {winner.username}
              </h1>

              {/* Victory message */}
              <div className="relative rounded-2xl overflow-hidden border border-neon-yellow/20 bg-gradient-to-br from-neon-yellow/8 to-transparent p-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-yellow/60 to-transparent" />
                <p className="text-neon-yellow text-xl font-rajdhani font-bold mb-2">
                  🎉 Congratulations! 🎉
                </p>
                <p className="text-gray-300 font-rajdhani">
                  You have proven yourself as the ultimate eFootball champion!
                  Your name will be remembered in the halls of glory.
                </p>
              </div>

              {/* Date */}
              <p className="text-gray-500 text-sm font-rajdhani mt-6">
                Declared on{' '}
                {new Date(winner.declaredAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Prize reminder */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { emoji: '🥇', place: '1st', prize: '800 ETB' },
                { emoji: '🥈', place: '2nd', prize: '500 ETB' },
              ].map((p, i) => (
                <div key={i} className={`glass-card rounded-2xl px-5 py-3 border text-center ${
                  i === 0 ? 'border-yellow-500/40' : 'border-gray-400/30'
                }`}>
                  <span className="text-2xl">{p.emoji}</span>
                  <p className={`font-rajdhani text-xs mt-1 ${i === 0 ? 'prize-gold' : 'prize-silver'}`}>
                    {p.place} Place — {p.prize}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
