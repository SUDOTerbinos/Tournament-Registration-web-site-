export default function TournamentDetails() {
  const prizes = [
    {
      place: '1st Place',
      rank: 'Champion',
      emoji: '🥇',
      amount: '800',
      colorClass: 'prize-gold',
      border: 'border-yellow-500/40',
      bg: 'bg-yellow-500/5',
      glow: 'shadow-yellow-500/20',
      highlight: true,
    },
    {
      place: '2nd Place',
      rank: 'Runner-Up',
      emoji: '🥈',
      amount: '500',
      colorClass: 'prize-silver',
      border: 'border-gray-400/30',
      bg: 'bg-gray-400/5',
      glow: 'shadow-gray-400/10',
      highlight: false,
    },
  ];

  const details = [
    { icon: '👥', label: 'Total Players', value: '32', color: 'text-neon-blue' },
    { icon: '🎮', label: 'Game', value: 'eFootball 2026', color: 'text-neon-purple' },
    { icon: '⚔️', label: 'Format', value: 'Knockout', color: 'text-neon-pink' },
    { icon: '📅', label: 'Date', value: 'May 20, 2026', color: 'text-neon-yellow' },
  ];

  const rules = [
    { icon: '🎯', text: 'Single elimination knockout — one loss and you\'re out' },
    { icon: '⚙️', text: 'Match settings will be shared 24h before the tournament' },
    { icon: '⏰', text: 'Players must be available at scheduled match times' },
    { icon: '🚫', text: 'No cheating or bug exploiting — instant disqualification' },
    { icon: '✅', text: 'Results are final once confirmed by the admin' },
    { icon: '🤝', text: 'Respect all players — sportsmanship is mandatory' },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-dark-800" id="tournament-details">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900" />
      <div className="absolute inset-0 bg-grid opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-neon-blue font-rajdhani font-semibold text-sm uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-neon-blue/50" />
            Tournament Info
            <span className="w-8 h-px bg-neon-blue/50" />
          </span>
          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2 mb-4">
            Prize Pool &{' '}
            <span className="text-gradient">Details</span>
          </h2>
          <p className="text-gray-400 font-rajdhani text-lg max-w-xl mx-auto">
            Compete, conquer, and claim your share of the total 1,300 ETB prize pool.
          </p>
        </div>

        {/* Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
          {prizes.map((prize, index) => (
            <div
              key={prize.place}
              className={`relative rounded-3xl ${prize.bg} border ${prize.border} p-8 text-center transition-all duration-400 card-lift hover:shadow-xl ${prize.glow} ${
                prize.highlight ? 'md:-mt-6 md:mb-6 ring-1 ring-yellow-500/30' : ''
              }`}
              id={`prize-card-${index + 1}`}
            >
              {prize.highlight && (
                <>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full text-xs font-orbitron font-black text-black shadow-lg shadow-yellow-500/30">
                    CHAMPION
                  </div>
                  {/* Shimmer */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 shimmer opacity-30" />
                  </div>
                </>
              )}

              <div className="relative z-10">
                <div className="text-6xl sm:text-7xl mb-4 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {prize.emoji}
                </div>
                <p className="font-rajdhani font-semibold text-gray-400 uppercase tracking-widest text-xs mb-1">
                  {prize.rank}
                </p>
                <h3 className="font-rajdhani text-lg font-bold text-gray-200 mb-4">{prize.place}</h3>
                <div className={`font-orbitron text-5xl sm:text-6xl font-black ${prize.colorClass} mb-1`}>
                  {prize.amount}
                </div>
                <p className="text-gray-500 text-sm font-rajdhani font-semibold uppercase tracking-widest">ETB</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tournament Detail Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="glass-card rounded-2xl p-5 sm:p-6 text-center neon-border card-lift group"
            >
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {detail.icon}
              </div>
              <p className="text-gray-500 text-xs font-rajdhani font-semibold uppercase tracking-wider mb-1">
                {detail.label}
              </p>
              <p className={`font-orbitron font-bold text-base sm:text-lg ${detail.color}`}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="glass-card rounded-3xl neon-border-purple p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <h3 className="font-orbitron text-xl font-bold text-white">Tournament Rules</h3>
              <p className="text-gray-500 font-rajdhani text-sm">Know before you play</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] transition-colors duration-200">
                <span className="text-lg flex-shrink-0">{rule.icon}</span>
                <p className="text-gray-300 font-rajdhani text-sm font-medium leading-relaxed">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
