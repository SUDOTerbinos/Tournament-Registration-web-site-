import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import { getCountdownEndTime } from '../store';

interface HeroProps {
  slotsLeft: number;
  onRegisterClick: () => void;
}

export default function Hero({ slotsLeft, onRegisterClick }: HeroProps) {
  const [shouldStartCountdown, setShouldStartCountdown] = useState(() => {
    return getCountdownEndTime() !== null;
  });
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | null>(null);

  useEffect(() => {
    // Update countdown state based on global countdown
    const updateCountdownState = async () => {
      const endTime = await getCountdownEndTime();
      setShouldStartCountdown(endTime !== null);
      if (endTime) {
        setRegistrationDeadline(endTime);
      }
    };

    // Check every second for countdown state changes
    const interval = setInterval(updateCountdownState, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStartCommand = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        setShouldStartCountdown(true);
      }
    };
    
    const handleVoiceCommand = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (command.includes('start')) {
        setShouldStartCountdown(true);
      }
      if (command.includes('start time')) {
        setShouldStartCountdown(true);
      }
    };

    // Keyboard shortcut: Ctrl+S to start
    window.addEventListener('keydown', handleStartCommand);
    
    // Voice command support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = handleVoiceCommand;
      recognition.start();
    }

    return () => {
      window.removeEventListener('keydown', handleStartCommand);
    };
  }, []);

  useEffect(() => {
    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'efootball_tournament_players') {
        // Force re-render to update slots display
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient bg-grid overflow-hidden pt-16">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-neon-pink/5 rounded-full blur-3xl animate-float"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/20 mb-8 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
          <span className="text-neon-blue font-rajdhani font-semibold text-sm uppercase tracking-widest">
            🏆 eFootball Championship 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Tournament Registration
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg sm:text-xl font-rajdhani mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Join the ultimate eFootball tournament!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card rounded-2xl neon-border p-6 text-center">
            <div className="text-3xl sm:text-4xl font-orbitron font-bold text-neon-blue mb-2">
              {slotsLeft}
            </div>
            <p className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest">
              Slots Left
            </p>
          </div>
          <div className="glass-card rounded-2xl neon-border p-6 text-center">
            <div className="text-3xl sm:text-4xl font-orbitron font-bold text-neon-purple mb-2">
              32
            </div>
            <p className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest">
              Total Players
            </p>
          </div>
          <div className="glass-card rounded-2xl neon-border p-6 text-center">
            <div className="text-3xl sm:text-4xl font-orbitron font-bold text-neon-pink mb-2">
              🏆
            </div>
            <p className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest">
              Prize Pool
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-400 text-sm font-rajdhani font-semibold uppercase tracking-widest mb-4">
            ⏰ Registration Closes In
          </p>
          <CountdownTimer targetDate={registrationDeadline || new Date()} shouldStart={shouldStartCountdown} />
          {!shouldStartCountdown && (
            <div className="mt-4 text-center">
              <p className="text-yellow-400 text-sm font-rajdhani animate-pulse">
                Timer not started - Admin can start countdown from Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {slotsLeft > 0 ? (
            <button
              onClick={onRegisterClick}
              className="group relative px-10 py-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-orbitron font-bold text-white text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]"
            >
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ) : (
            <div className="glass-card rounded-2xl neon-border-red p-8">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="font-orbitron text-2xl font-bold text-red-400 mb-4">
                Registration Closed
              </h3>
              <p className="text-gray-300 font-rajdhani mb-6">
                All 32 slots have been filled. Tournament registration is now closed.
              </p>
              <p className="text-gray-400 text-sm font-rajdhani">
                Contact tournament organizers for more information.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
