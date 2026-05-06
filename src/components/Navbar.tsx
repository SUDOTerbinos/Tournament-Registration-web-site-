import { useState, useEffect } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  slotsLeft: number;
}

export default function Navbar({ currentPage, setCurrentPage, slotsLeft }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'register', label: 'Register', icon: '📝' },
    { id: 'winner', label: 'Winner', icon: '🏆' },
    { id: 'admin', label: 'Admin', icon: '🔐' },
  ];

  const handleNav = (page: Page) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-nav shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              id="nav-logo"
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/20 group-hover:shadow-neon-blue/40 transition-all duration-300 group-hover:scale-110">
                <span className="text-lg">⚽</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-orbitron font-black text-sm sm:text-base text-white group-hover:text-neon-blue transition-colors duration-300 leading-tight">
                  eFOOTBALL
                </span>
                <span className="font-rajdhani font-semibold text-[10px] text-neon-blue/70 tracking-widest uppercase leading-tight">
                  Championship '26
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-rajdhani font-semibold transition-all duration-300 ${
                    currentPage === item.id
                      ? item.id === 'winner'
                        ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30'
                        : item.id === 'admin'
                        ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/30'
                        : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="hidden lg:inline mr-1">{item.icon}</span>
                  {item.label}
                  {currentPage === item.id && (
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      item.id === 'winner' ? 'bg-neon-yellow' : item.id === 'admin' ? 'bg-neon-purple' : 'bg-neon-blue'
                    }`} />
                  )}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Slots Badge */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                slotsLeft > 5
                  ? 'bg-neon-green/10 border-neon-green/30'
                  : slotsLeft > 0
                  ? 'bg-neon-yellow/10 border-neon-yellow/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  slotsLeft > 5 ? 'bg-neon-green' : slotsLeft > 0 ? 'bg-neon-yellow' : 'bg-red-400'
                }`} />
                <span className={`text-xs font-semibold font-rajdhani ${
                  slotsLeft > 5 ? 'text-neon-green' : slotsLeft > 0 ? 'text-neon-yellow' : 'text-red-400'
                }`}>
                  {slotsLeft > 0 ? `${slotsLeft} slots left` : 'FULL'}
                </span>
              </div>

              {/* Register CTA */}
              {currentPage !== 'register' && slotsLeft > 0 && (
                <button
                  id="nav-register-cta"
                  onClick={() => handleNav('register')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron font-bold text-xs text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-lg hover:shadow-neon-blue/20 hover:scale-105 transition-all duration-300"
                >
                  Register Now
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                id="nav-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-16 right-0 left-0 glass-nav border-b border-white/5 px-4 pb-6 pt-4 transition-all duration-300 ${mobileOpen ? 'translate-y-0' : '-translate-y-4'}`}>
          <div className="flex flex-col gap-2 mb-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-rajdhani font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border w-fit ${
            slotsLeft > 0 ? 'bg-neon-green/10 border-neon-green/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${slotsLeft > 0 ? 'bg-neon-green' : 'bg-red-400'}`} />
            <span className={`text-sm font-semibold font-rajdhani ${slotsLeft > 0 ? 'text-neon-green' : 'text-red-400'}`}>
              {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Tournament Full'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
