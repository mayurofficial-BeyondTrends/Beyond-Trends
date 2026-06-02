import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID,
}

const fallbackFirebaseConfig = {
  apiKey: firebaseConfig.apiKey || 'demo-api-key',
  authDomain: firebaseConfig.authDomain || 'demo-project.firebaseapp.com',
  projectId: firebaseConfig.projectId || 'demo-project',
  storageBucket: firebaseConfig.storageBucket || 'demo-project.appspot.com',
  messagingSenderId: firebaseConfig.messagingSenderId || '000000000000',
  appId: firebaseConfig.appId || '1:000000000000:web:demo',
}

const hasClientConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
const resolvedConfig = hasClientConfig ? firebaseConfig : fallbackFirebaseConfig

if (typeof window !== 'undefined' && !hasClientConfig) {
  throw new Error('Missing Firebase client configuration (NEXT_PUBLIC_FIREBASE_*)')
}

const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
