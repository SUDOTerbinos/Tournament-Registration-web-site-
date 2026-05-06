import { useState, useEffect } from 'react';
import { Page } from './types';
import { getSlotsLeft, subscribeToPlayerCount } from './store';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TournamentDetails from './components/TournamentDetails';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';
import WinnerDashboard from './components/WinnerDashboard';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [slotsLeft, setSlotsLeft] = useState<number>(32);

  const loadSlotsLeft = async () => {
    try {
      const slots = await getSlotsLeft();
      setSlotsLeft(slots);
    } catch (error) {
      console.error('Failed to load slots:', error);
    }
  };

  // Subscribe to live player count — updates instantly across all devices
  useEffect(() => {
    const unsubscribe = subscribeToPlayerCount(count => {
      setSlotsLeft(32 - count);
    });
    return () => unsubscribe();
  }, []);

  const handleRegisterClick = () => {
    setCurrentPage('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationComplete = async () => {
    await loadSlotsLeft();
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-200 relative">
      <ParticleBackground />

      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        slotsLeft={slotsLeft}
      />

      {currentPage === 'home' && (
        <>
          <Hero slotsLeft={slotsLeft} onRegisterClick={handleRegisterClick} />
          <TournamentDetails />

          {/* Registration Steps Section */}
          <section className="relative py-24 px-4 sm:px-6 bg-dark-900">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <span className="inline-flex items-center gap-2 text-neon-purple font-rajdhani font-semibold text-sm uppercase tracking-widest mb-3">
                  <span className="w-6 h-px bg-neon-purple/50" />
                  How to Join
                  <span className="w-6 h-px bg-neon-purple/50" />
                </span>
                <h2 className="font-orbitron text-3xl sm:text-4xl font-black text-white mt-2">
                  Registration{' '}
                  <span className="text-gradient">Steps</span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-neon-purple to-neon-pink mx-auto mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: '01', title: 'Fill Form', desc: 'Enter your personal details and game username', icon: '📝', color: 'neon-blue' },
                  { step: '02', title: 'Make Payment', desc: 'Pay via Telebirr to 0917630143', icon: '💳', color: 'neon-green' },
                  { step: '03', title: 'Submit Proof', desc: 'Enter transaction ID and upload screenshot', icon: '📸', color: 'neon-purple' },
                  { step: '04', title: 'Get Confirmed', desc: 'Report on TG @NULLDNF and await confirmation', icon: '✅', color: 'neon-pink' },
                ].map((item, idx) => (
                  <div key={item.step} className="relative glass-card rounded-2xl p-6 text-center neon-border group card-lift">
                    {/* Step number watermark */}
                    <div className="absolute -top-2 -right-2 font-orbitron text-5xl font-black text-white/[0.04] group-hover:text-neon-blue/8 transition-colors select-none">
                      {item.step}
                    </div>

                    {/* Connector line */}
                    {idx < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-neon-blue/30 to-transparent z-10" />
                    )}

                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl bg-${item.color}/10 border border-${item.color}/20 group-hover:scale-110 transition-transform duration-300`}>
                        {item.icon}
                      </div>
                      <h3 className="font-orbitron text-sm font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-500 font-rajdhani text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                {slotsLeft > 0 ? (
                  <button
                    id="steps-register-btn"
                    onClick={handleRegisterClick}
                    className="px-10 py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl font-orbitron font-bold text-white text-base transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] btn-glow"
                  >
                    🎮 Secure Your Spot Now
                  </button>
                ) : (
                  <div className="px-10 py-4 bg-dark-700 rounded-xl font-orbitron font-bold text-red-400 text-base border border-red-500/30 inline-block">
                    🔒 All Slots Filled
                  </div>
                )}
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}

      {currentPage === 'register' && (
        <>
          <RegistrationForm
            onRegistrationComplete={handleRegistrationComplete}
            slotsLeft={slotsLeft}
          />
          <Footer />
        </>
      )}

      {currentPage === 'admin' && (
        <>
          <AdminPanel />
          <Footer />
        </>
      )}

      {currentPage === 'winner' && (
        <WinnerDashboard />
      )}
    </div>
  );
}
