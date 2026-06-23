import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Lock, Mail, Sparkles, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CalendarCube from './three/CalendarCube'
import BackgroundOrbs from './BackgroundOrbs'

export default function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, displayName)
    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (mode === 'signup') {
      setMessage('Account created. If email confirmation is enabled, check your inbox before signing in.')
    }
  }

  return (
    <main className="app-noise min-h-screen overflow-hidden px-5 py-8">
      <BackgroundOrbs />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-[2.5rem] p-7 sm:p-10 lg:p-12"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-sm text-muted">
            <Sparkles size={16} /> Apple glass productivity cockpit
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            DayFlow
          </h1>
          <p className="mt-4 max-w-2xl text-xl leading-8 text-muted">Your day, orchestrated in glass.</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Plan your timeline, tame your tasks, track habits, enter focus mode, and let Gemini draft a daily plan from the fog.
          </p>
          <div className="mt-10 h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
            <CalendarCube />
          </div>
        </motion.section>

        <motion.form
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2.5rem] p-7 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
              <CalendarDays />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
              <p className="text-sm text-muted">Supabase Auth keeps your command center synced.</p>
            </div>
          </div>

          <div className="mt-8 flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === 'signin' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-4 py-2 text-sm transition ${mode === 'signup' ? 'bg-white text-black' : 'text-muted hover:text-white'}`}
            >
              Sign up
            </button>
          </div>

          <div className="mt-7 space-y-4">
            {mode === 'signup' ? (
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-muted"><UserRound size={16} /> Name</span>
                <input className="field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tanish" required />
              </label>
            ) : null}
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-muted"><Mail size={16} /> Email</span>
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-muted"><Lock size={16} /> Password</span>
              <input className="field" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required />
            </label>
          </div>

          {error ? <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
          {message ? <p className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</p> : null}

          <button disabled={loading} className="apple-button mt-7 w-full px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Working...' : mode === 'signin' ? 'Enter DayFlow' : 'Create DayFlow account'}
          </button>
        </motion.form>
      </div>
    </main>
  )
}
