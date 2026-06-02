'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, updateProfile, User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore/lite'
import { auth, db } from '@/lib/firebase'
import type { User } from '@/types'

interface AuthContextType {
  user: FirebaseUser | null
  profile: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const ensureUserDoc = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const snap = await getDoc(userRef)

    if (snap.exists()) return snap

    const newProfile = {
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      role: 'customer' as const,
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(userRef, newProfile)
    return await getDoc(userRef)
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const fallbackProfile: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          phone: firebaseUser.phoneNumber || undefined,
          role: 'customer',
          addresses: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        try {
          // Ensure auth token is fresh before Firestore rules evaluation.
          await firebaseUser.getIdToken(true)

          const snap = await ensureUserDoc(firebaseUser)
          if (snap.exists()) {
            setProfile({ id: snap.id, ...snap.data() } as User)
          } else {
            setProfile(fallbackProfile)
          }
        } catch (err) {
          console.warn('Profile sync skipped (Firestore permission issue):', err)
          setProfile(fallbackProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    try {
      await ensureUserDoc(cred.user)
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && err?.code !== 'firestore/permission-denied') {
        throw err
      }
    }
  }

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider())
    try {
      await ensureUserDoc(cred.user)
    } catch (err: any) {
      if (err?.code !== 'permission-denied' && err?.code !== 'firestore/permission-denied') {
        throw err
      }
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
