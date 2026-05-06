export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-900 overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

      {/* Subtle background */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-neon-blue/3 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-lg shadow-neon-blue/20">
                <span className="text-xl">⚽</span>
              </div>
              <div>
                <span className="font-orbitron font-black text-base text-white block leading-tight">eFOOTBALL '26</span>
                <span className="font-rajdhani text-[10px] text-neon-blue/70 uppercase tracking-widest">Championship</span>
              </div>
            </div>
            <p className="text-gray-500 font-rajdhani text-sm leading-relaxed">
              The ultimate eFootball tournament experience. Compete, conquer, and claim your glory. Built with passion for the Ethiopian gaming community.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://t.me/NULLDNF"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue hover:bg-neon-blue/20 hover:border-neon-blue/40 transition-all"
                aria-label="Telegram"
              >
                ✈️
              </a>
            </div>
          </div>

          {/* Tournament */}
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-neon-blue/50" />
              Tournament
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Tournament Rules', anchor: '#tournament-details' },
                { label: 'Prize Pool', anchor: '#tournament-details' },
                { label: 'Registration', anchor: '#' },
                { label: 'Winners', anchor: '#' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.anchor} className="text-gray-500 hover:text-neon-blue font-rajdhani text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-neon-blue transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-orbitron font-bold text-white text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-neon-purple/50" />
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-sm flex-shrink-0">✈️</div>
                <div>
                  <p className="text-gray-500 font-rajdhani text-xs uppercase tracking-wider">Telegram</p>
                  <a href="https://t.me/NULLDNF" target="_blank" rel="noopener noreferrer" className="text-neon-blue font-rajdhani font-semibold text-sm hover:underline">@NULLDNF</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-sm flex-shrink-0">💰</div>
                <div>
                  <p className="text-gray-500 font-rajdhani text-xs uppercase tracking-wider">Telebirr (Payment)</p>
                  <p className="text-white font-rajdhani font-semibold text-sm">0917630143</p>
                </div>
              </li>
            </ul>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="mt-6 flex items-center gap-2 text-gray-500 hover:text-neon-blue font-rajdhani text-sm transition-all duration-200 hover:gap-3 group"
            >
              <span className="w-6 h-6 rounded-full border border-gray-600 group-hover:border-neon-blue flex items-center justify-center text-xs transition-colors">↑</span>
              Back to top
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 font-rajdhani text-xs">
            © 2026 eFootball Championship. All rights reserved.
          </p>
          <p className="text-gray-600 font-rajdhani text-xs flex items-center gap-1.5">
            Built with <span className="text-neon-blue">⚡</span> for the gaming community
          </p>
        </div>
      </div>
    </footer>
  );
}
