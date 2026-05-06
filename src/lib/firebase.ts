import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// These are set via Vercel environment variables (VITE_ prefix = accessible in browser)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase is "configured" only when both key env vars are present
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId);

// Initialize Firebase once (guard against hot-reload double-init)
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];
  db = getFirestore(app);
}

export { db };
