'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Chrome } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

function AuthPageContent() {
  const params = useSearchParams()
  const [tab, setTab] = useState<'signin' | 'signup'>(params.get('tab') === 'signup' ? 'signup' : 'signin')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<{
    email: string; password: string; name?: string
  }>()

  const onSubmit = async (data: { email: string; password: string; name?: string }) => {
    setLoading(true)
    try {
      if (tab === 'signin') {
        await signIn(data.email, data.password)
        toast.success('Welcome back!')
      } else {
        await signUp(data.email, data.password, data.name || '')
        toast.success('Account created!')
      }
      router.push('/')
    } catch (err: any) {
      const msg = err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/user-not-found' ? 'No account found'
        : err.code === 'auth/email-already-in-use' ? 'Email already registered'
        : 'Authentication failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google!')
      router.push('/')
    } catch (err: any) {
      const msg = err?.code === 'auth/popup-closed-by-user' ? 'Google sign-in popup was closed'
        : err?.code === 'auth/popup-blocked' ? 'Popup blocked by browser. Allow popups and try again.'
        : err?.code === 'auth/operation-not-allowed' ? 'Google sign-in is not enabled in Firebase Auth.'
        : err?.code === 'auth/unauthorized-domain' ? 'This domain is not authorized for Firebase Auth.'
        : err?.code === 'auth/invalid-api-key' ? 'Invalid Firebase API key configuration.'
        : 'Google sign-in failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex mb-6" aria-label="Beyond Trends home">
            <img src="/Logo.png" alt="Beyond Trends" className="h-16 w-auto max-w-[260px] object-contain" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-neutral-900">
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {tab === 'signin' ? 'Sign in to your account' : 'Join Beyond Trends shoppers'}
          </p>
        </div>

        <div className="card p-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 mb-6">
            {(['signin', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === t ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} className="btn-outline w-full mb-4 gap-3">
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input {...register('name', { required: 'Name is required' })} className="input" placeholder="John Doe" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className="input" type="email" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} className="input pr-10" type={showPw ? 'text' : 'password'} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
              {loading ? 'Please wait...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-6">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-brand-500 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-brand-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50" />}>
      <AuthPageContent />
    </Suspense>
  )
}
