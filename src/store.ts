/**
 * store.ts
 *
 * Data layer with two modes:
 *  • Firebase Firestore  — when VITE_FIREBASE_* env vars are set
 *    → All devices share the same data in real-time ✅
 *  • localStorage (fallback) — when Firebase is NOT configured
 *    → Data is local to each browser (dev / offline use)
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

import { db, isFirebaseConfigured } from './lib/firebase';
import { Player, Winner } from './types';

// ─── Constants ────────────────────────────────────────────
const MAX_PLAYERS = 32;

// localStorage keys (fallback mode)
const LS_PLAYERS   = 'efootball_tournament_players';
const LS_WINNER    = 'efootball_tournament_winner';
const LS_COUNTDOWN = 'countdown_start_time';

// Firestore collection / document names
const COL_PLAYERS  = 'players';
const DOC_SETTINGS = 'tournament_settings'; // single doc in 'settings' collection
const COL_SETTINGS = 'settings';

// ─── Helpers ──────────────────────────────────────────────

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('localStorage write error:', err);
  }
}

// ─── PLAYERS ──────────────────────────────────────────────

export async function getPlayers(): Promise<Player[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, COL_PLAYERS), orderBy('registeredAt', 'asc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
    } catch (err) {
      console.error('Firestore getPlayers error:', err);
      return [];
    }
  }
  // fallback
  return readLS<Player[]>(LS_PLAYERS, []);
}

export async function savePlayer(
  player: Player,
): Promise<{ success: boolean; message: string }> {
  // Always validate locally first (fast, no round-trip)
  const players = await getPlayers();

  if (players.length >= MAX_PLAYERS)
    return { success: false, message: 'Tournament is full! All 32 slots have been taken.' };

  if (players.some(p => p.username.toLowerCase() === player.username.toLowerCase()))
    return { success: false, message: 'This username is already registered.' };

  if (players.some(p => p.phone === player.phone))
    return { success: false, message: 'This phone number is already registered.' };

  if (isFirebaseConfigured && db) {
    try {
      // Firestore doesn't allow undefined values — strip them
      const { id: _id, ...data } = player;
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined) clean[k] = v;
      }
      await addDoc(collection(db, COL_PLAYERS), clean);
      return { success: true, message: 'Registration successful!' };
    } catch (err) {
      console.error('Firestore savePlayer error:', err);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  // fallback
  const updated = [...players, player];
  writeLS(LS_PLAYERS, updated);
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: LS_PLAYERS,
      newValue: JSON.stringify(updated),
      oldValue: JSON.stringify(players),
    }),
  );
  return { success: true, message: 'Registration successful!' };
}

export async function getSlotsLeft(): Promise<number> {
  const players = await getPlayers();
  return MAX_PLAYERS - players.length;
}

export async function isRegistrationOpen(): Promise<boolean> {
  const players = await getPlayers();
  return players.length < MAX_PLAYERS;
}

export async function updatePaymentStatus(
  playerId: string,
  status: Player['paymentStatus'],
): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, COL_PLAYERS, playerId), { paymentStatus: status });
    } catch (err) {
      console.error('Firestore updatePaymentStatus error:', err);
    }
    return;
  }

  // fallback
  const players = readLS<Player[]>(LS_PLAYERS, []);
  const idx = players.findIndex(p => p.id === playerId);
  if (idx === -1) return;
  const old = [...players];
  players[idx] = { ...players[idx], paymentStatus: status };
  writeLS(LS_PLAYERS, players);
  window.dispatchEvent(
    new StorageEvent('storage', { key: LS_PLAYERS, newValue: JSON.stringify(players), oldValue: JSON.stringify(old) }),
  );
}

export async function removePlayer(playerId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, COL_PLAYERS, playerId));
    } catch (err) {
      console.error('Firestore removePlayer error:', err);
    }
    return;
  }

  // fallback
  const players = readLS<Player[]>(LS_PLAYERS, []);
  const old = [...players];
  const updated = players.filter(p => p.id !== playerId);
  writeLS(LS_PLAYERS, updated);
  window.dispatchEvent(
    new StorageEvent('storage', { key: LS_PLAYERS, newValue: JSON.stringify(updated), oldValue: JSON.stringify(old) }),
  );
}

/**
 * Subscribe to live player count updates.
 * Returns an unsubscribe function.
 * Works only when Firebase is configured; otherwise calls callback once.
 */
export function subscribeToPlayerCount(
  callback: (count: number) => void,
): () => void {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, COL_PLAYERS));
    const unsub = onSnapshot(
      q,
      snap => callback(snap.size),
      err => console.error('onSnapshot error:', err),
    );
    return unsub;
  }
  // fallback — just call once, no real-time in localStorage mode
  const players = readLS<Player[]>(LS_PLAYERS, []);
  callback(players.length);
  return () => {};
}

// ─── WINNER ───────────────────────────────────────────────

async function getSettings(): Promise<Record<string, unknown>> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, COL_SETTINGS, DOC_SETTINGS));
      return snap.exists() ? (snap.data() as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

async function setSettings(data: Record<string, unknown>): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, COL_SETTINGS, DOC_SETTINGS), data, { merge: true });
  }
}

export async function getWinner(): Promise<Winner | null> {
  if (isFirebaseConfigured && db) {
    const settings = await getSettings();
    return (settings.winner as Winner) ?? null;
  }
  return readLS<Winner | null>(LS_WINNER, null);
}

export async function setWinner(
  username: string,
  tournamentName?: string,
): Promise<void> {
  const winner: Winner = {
    username,
    declaredAt: new Date().toISOString(),
    tournamentName: tournamentName ?? 'eFootball Championship 2026',
  };
  if (isFirebaseConfigured && db) {
    await setSettings({ winner });
    return;
  }
  writeLS(LS_WINNER, winner);
}

export async function clearWinner(): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setSettings({ winner: null });
    return;
  }
  localStorage.removeItem(LS_WINNER);
}

// ─── COUNTDOWN ────────────────────────────────────────────

export async function getCountdownStartTime(): Promise<string | null> {
  if (isFirebaseConfigured && db) {
    const settings = await getSettings();
    const val = settings.countdownStartTime;
    // Could be a Firestore Timestamp or an ISO string
    if (!val) return null;
    if (val instanceof Timestamp) return val.toDate().toISOString();
    return String(val);
  }
  return localStorage.getItem(LS_COUNTDOWN);
}

export async function setCountdownStartTime(): Promise<void> {
  const now = new Date().toISOString();
  if (isFirebaseConfigured && db) {
    await setSettings({ countdownStartTime: now });
    return;
  }
  localStorage.setItem(LS_COUNTDOWN, now);
}

export async function clearCountdownStartTime(): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setSettings({ countdownStartTime: null });
    return;
  }
  localStorage.removeItem(LS_COUNTDOWN);
}

export async function getCountdownEndTime(): Promise<Date | null> {
  const startTime = await getCountdownStartTime();
  if (!startTime) return null;
  const start = new Date(startTime);
  return new Date(start.getTime() + 10.5 * 24 * 60 * 60 * 1000);
}
