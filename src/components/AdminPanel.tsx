import { useState, useEffect, useCallback } from 'react';
import { Player } from '../types';
import {
  getPlayers,
  updatePaymentStatus,
  removePlayer,
  getWinner,
  setWinner as setWinnerStore,
  clearWinner,
  getCountdownStartTime,
  setCountdownStartTime,
  clearCountdownStartTime,
} from '../store';
import type { Winner } from '../types';

export default function AdminPanel() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [winnerUsername, setWinnerUsername] = useState('');
  const [winnerError, setWinnerError] = useState('');
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'QWERTYUIOP123456';

  const refreshData = useCallback(async () => {
    const [ps, w, cd] = await Promise.all([
      getPlayers(),
      getWinner(),
      getCountdownStartTime(),
    ]);
    setPlayers(ps);
    setWinner(w);
    setCountdownStarted(cd !== null);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'efootball_tournament_players' && isAuthenticated) {
        getPlayers().then(setPlayers);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleStatusChange = async (playerId: string, status: Player['paymentStatus']) => {
    setActionLoading(`status-${playerId}`);
    await updatePaymentStatus(playerId, status);
    const ps = await getPlayers();
    setPlayers(ps);
    setActionLoading(null);
  };

  const handleRemove = async (playerId: string, playerName: string) => {
    if (window.confirm(`Remove ${playerName} from the tournament? This cannot be undone.`)) {
      setActionLoading(`remove-${playerId}`);
      await removePlayer(playerId);
      const ps = await getPlayers();
      setPlayers(ps);
      setActionLoading(null);
    }
  };

  const handleDeclareWinner = async () => {
    if (!winnerUsername.trim()) {
      setWinnerError('Please enter a winner username');
      return;
    }
    await setWinnerStore(winnerUsername.trim());
    const w = await getWinner();
    setWinner(w);
    setWinnerUsername('');
    setWinnerError('');
  };

  const handleClearWinner = async () => {
    if (window.confirm('Clear the current winner declaration?')) {
      await clearWinner();
      setWinner(null);
    }
  };

  const handleStartCountdown = async () => {
    await setCountdownStartTime();
    setCountdownStarted(true);
  };

  const handleClearCountdown = async () => {
    await clearCountdownStartTime();
    setCountdownStarted(false);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Full Name', 'Username', 'Phone', 'Telegram', 'Transaction ID', 'Status', 'Registered At'];
    const rows = players.map((p, i) => [
      i + 1, p.fullName, p.username, p.phone, p.telegram, p.transactionId, p.paymentStatus,
      new Date(p.registeredAt).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `efootball-players-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPlayers = players.filter(player => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || player.fullName.toLowerCase().includes(q) ||
      player.username.toLowerCase().includes(q) ||
      player.phone.includes(q) ||
      player.telegram.toLowerCase().includes(q) ||
      player.transactionId.toLowerCase().includes(q);
    const matchesFilter = filterStatus === 'all' || player.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: players.length,
    pending: players.filter(p => p.paymentStatus === 'pending').length,
    confirmed: players.filter(p => p.paymentStatus === 'confirmed').length,
    rejected: players.filter(p => p.paymentStatus === 'rejected').length,
    slotsLeft: 32 - players.length,
  };

  // Auth Screen
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 hero-gradient bg-grid">
        <div className="glass-card rounded-3xl neon-border-purple p-8 max-w-md w-full animate-slide-up shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center mx-auto mb-4 animate-glow-pulse-purple">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="font-orbitron text-2xl font-bold text-white">Admin Access</h2>
            <p className="text-gray-500 font-rajdhani text-sm mt-2">Enter password to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthError(''); }}
              placeholder="Admin password"
              autoComplete="current-password"
              className="w-full px-4 py-3.5 bg-dark-700 border border-white/8 rounded-xl text-white placeholder-gray-600 font-rajdhani focus:outline-none focus:border-neon-purple/50 input-glow-purple transition-all"
            />
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 font-rajdhani text-sm">
                ⚠️ {authError}
              </div>
            )}
            <button
              id="admin-login-btn"
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl font-orbitron font-bold text-white text-sm transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] btn-glow"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pt-24 pb-16 hero-gradient bg-grid">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-orbitron text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center text-sm">🔐</span>
              Admin Dashboard
            </h2>
            <p className="text-gray-500 font-rajdhani text-sm mt-1">Manage tournament registrations and settings</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green font-rajdhani font-semibold text-sm hover:bg-neon-green/20 transition-all flex items-center gap-2"
            >
              📊 Export CSV
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue font-rajdhani font-semibold text-sm hover:bg-neon-blue/20 transition-all flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', border: 'neon-border' },
            { label: 'Pending', value: stats.pending, color: 'text-neon-yellow', border: 'border border-yellow-500/20' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-neon-green', border: 'border border-green-500/20' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-400', border: 'border border-red-500/20' },
            { label: 'Slots Left', value: stats.slotsLeft, color: 'text-neon-blue', border: 'border border-neon-blue/20' },
          ].map(stat => (
            <div key={stat.label} className={`glass-card rounded-2xl p-4 ${stat.border}`}>
              <p className="text-gray-500 font-rajdhani text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`font-orbitron text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Countdown Control */}
          <div className="glass-card rounded-2xl neon-border p-6">
            <h3 className="font-orbitron text-lg font-bold text-neon-blue mb-4 flex items-center gap-2">
              <span>⏰</span> Countdown Control
            </h3>
            <p className="text-gray-400 font-rajdhani text-sm mb-4">Registration countdown timer (10 days 12 hours)</p>
            <div className="flex gap-3">
              <button
                onClick={handleStartCountdown}
                disabled={countdownStarted}
                className={`flex-1 py-2.5 rounded-xl font-orbitron font-bold text-sm transition-all ${
                  countdownStarted
                    ? 'bg-neon-green/20 border border-neon-green/30 text-neon-green cursor-not-allowed'
                    : 'bg-gradient-to-r from-neon-blue to-neon-purple hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] text-white'
                }`}
              >
                {countdownStarted ? '✓ Timer Active' : '▶ Start Timer'}
              </button>
              {countdownStarted && (
                <button
                  onClick={handleClearCountdown}
                  className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-rajdhani font-semibold text-sm hover:bg-red-500/20 transition-all"
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          {/* Winner Management */}
          <div className="glass-card rounded-2xl neon-border-yellow p-6">
            <h3 className="font-orbitron text-lg font-bold text-neon-yellow mb-4 flex items-center gap-2">
              <span>🏆</span> Winner Management
            </h3>
            {winner ? (
              <div className="space-y-3">
                <div className="bg-neon-yellow/10 rounded-xl p-4 border border-neon-yellow/20">
                  <p className="text-neon-yellow font-rajdhani font-semibold text-xs uppercase tracking-wider mb-1">Current Champion</p>
                  <p className="text-white text-2xl font-orbitron font-black">{winner.username}</p>
                  <p className="text-gray-400 text-xs font-rajdhani mt-1">
                    Declared {new Date(winner.declaredAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={handleClearWinner}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-rajdhani font-semibold text-sm hover:bg-red-500/20 transition-all"
                >
                  🗑️ Clear Winner
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 font-rajdhani text-sm">No winner declared yet.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter winner username"
                    value={winnerUsername}
                    onChange={e => setWinnerUsername(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-dark-700 border border-white/8 rounded-lg text-white placeholder-gray-600 font-rajdhani focus:outline-none focus:border-neon-yellow/50 transition-all text-sm"
                  />
                  <button
                    onClick={handleDeclareWinner}
                    className="px-4 py-2.5 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg text-neon-yellow font-rajdhani font-semibold text-sm hover:bg-neon-yellow/20 transition-all whitespace-nowrap"
                  >
                    🏆 Declare
                  </button>
                </div>
                {winnerError && <p className="text-red-400 text-xs font-rajdhani">⚠️ {winnerError}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, phone, telegram..."
              className="w-full pl-10 pr-10 py-3 bg-dark-700 border border-white/8 rounded-xl text-white placeholder-gray-600 font-rajdhani focus:outline-none focus:border-neon-blue/50 input-glow transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-dark-700 border border-white/8 rounded-xl text-white font-rajdhani focus:outline-none focus:border-neon-blue/50 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Players Table */}
        {filteredPlayers.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center neon-border">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 font-rajdhani text-lg">
              {players.length === 0 ? 'No registrations yet' : 'No players match your search'}
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden neon-border">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    {['#', 'Player', 'Phone', 'Telegram', 'Transaction ID', 'Screenshot', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-gray-500 font-rajdhani text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr key={player.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-orbitron text-sm text-gray-500">{index + 1}</td>
                      <td className="px-5 py-4">
                        <p className="text-white font-rajdhani font-semibold">{player.fullName}</p>
                        <p className="text-neon-blue font-rajdhani text-sm">{player.username}</p>
                        <p className="text-gray-600 font-rajdhani text-xs">{new Date(player.registeredAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-rajdhani text-sm">{player.phone}</td>
                      <td className="px-5 py-4">
                        <a href={`https://t.me/${player.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-neon-blue font-rajdhani text-sm hover:underline">
                          @{player.telegram.replace('@', '')}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs max-w-[120px] truncate" title={player.transactionId}>
                        {player.transactionId}
                      </td>
                      <td className="px-5 py-4">
                        {player.screenshotData ? (
                          <button
                            onClick={() => { setSelectedScreenshot(player.screenshotData || null); setShowScreenshotModal(true); }}
                            className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-lg text-neon-blue text-xs font-rajdhani font-semibold hover:bg-neon-blue/20 transition-all"
                          >
                            📸 View
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs font-rajdhani">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-rajdhani font-semibold ${
                          player.paymentStatus === 'confirmed' ? 'status-confirmed' :
                          player.paymentStatus === 'rejected' ? 'status-rejected' :
                          'status-pending'
                        }`}>
                          {player.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {player.paymentStatus !== 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(player.id, 'confirmed')}
                              disabled={actionLoading === `status-${player.id}`}
                              className="px-2.5 py-1 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green text-xs font-rajdhani font-semibold hover:bg-neon-green/20 transition-all disabled:opacity-50"
                              title="Confirm payment"
                            >
                              ✓
                            </button>
                          )}
                          {player.paymentStatus !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(player.id, 'rejected')}
                              disabled={actionLoading === `status-${player.id}`}
                              className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-rajdhani font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50"
                              title="Reject payment"
                            >
                              ✗
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(player.id, player.fullName)}
                            disabled={actionLoading === `remove-${player.id}`}
                            className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/30 rounded-lg text-gray-400 text-xs font-rajdhani font-semibold hover:bg-gray-500/20 transition-all disabled:opacity-50"
                            title="Remove player"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-white/5">
              {filteredPlayers.map((player, index) => (
                <div key={player.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center">
                        <span className="font-orbitron text-xs text-neon-blue font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-rajdhani font-semibold text-sm">{player.fullName}</p>
                        <p className="text-neon-blue font-rajdhani text-xs">{player.username}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-rajdhani font-semibold ${
                      player.paymentStatus === 'confirmed' ? 'status-confirmed' :
                      player.paymentStatus === 'rejected' ? 'status-rejected' :
                      'status-pending'
                    }`}>
                      {player.paymentStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-rajdhani pl-11">
                    <div className="text-gray-500">Phone: <span className="text-gray-300">{player.phone}</span></div>
                    <div className="text-gray-500">TG: <span className="text-neon-blue">@{player.telegram.replace('@', '')}</span></div>
                    <div className="col-span-2 text-gray-500">TXN: <span className="text-gray-300 font-mono">{player.transactionId}</span></div>
                  </div>
                  <div className="flex items-center gap-2 pl-11">
                    {player.paymentStatus !== 'confirmed' && (
                      <button onClick={() => handleStatusChange(player.id, 'confirmed')} className="px-3 py-1.5 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green text-xs font-rajdhani font-semibold hover:bg-neon-green/20 transition-all">✓ Confirm</button>
                    )}
                    {player.paymentStatus !== 'rejected' && (
                      <button onClick={() => handleStatusChange(player.id, 'rejected')} className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-rajdhani font-semibold hover:bg-red-500/20 transition-all">✗ Reject</button>
                    )}
                    <button onClick={() => handleRemove(player.id, player.fullName)} className="px-3 py-1.5 bg-gray-500/10 border border-gray-500/30 rounded-lg text-gray-400 text-xs font-rajdhani font-semibold hover:bg-gray-500/20 transition-all">🗑 Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot Modal */}
        {showScreenshotModal && selectedScreenshot && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => { setShowScreenshotModal(false); setSelectedScreenshot(null); }}>
            <div className="glass-card rounded-2xl neon-border max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="font-orbitron text-lg font-bold text-white">Payment Screenshot</h3>
                <button onClick={() => { setShowScreenshotModal(false); setSelectedScreenshot(null); }} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">✕</button>
              </div>
              <div className="p-5 overflow-auto max-h-[75vh]">
                <img src={selectedScreenshot} alt="Payment Screenshot" className="w-full h-auto rounded-xl" />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
