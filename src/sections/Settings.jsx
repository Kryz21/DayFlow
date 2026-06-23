import { Moon, RotateCcw, Save, Sun } from 'lucide-react'
import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import { useAuth } from '../context/AuthContext'
import { useDayFlow } from '../context/DataContext'

export default function Settings() {
  const { user } = useAuth()
  const { settings, updateSettings, resetDemoData } = useDayFlow()
  const [displayName, setDisplayName] = useState(settings.display_name || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    await updateSettings({ display_name: displayName })
    setSaving(false)
    setMessage('Settings saved.')
  }

  async function setTheme(theme) {
    await updateSettings({ theme })
  }

  async function resetData() {
    const ok = confirm('Reset your DayFlow data and load demo data?')
    if (!ok) return
    await resetDemoData()
    setMessage('Demo data loaded.')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Preferences</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Glass controls</h2>
        <div className="mt-7 space-y-4">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-medium">Theme</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => setTheme('dark')} className={`rounded-2xl border px-4 py-4 text-left transition ${settings.theme === 'dark' ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.06]'}`}>
                <Moon className="mb-3" size={20} /> Dark
              </button>
              <button onClick={() => setTheme('light')} className={`rounded-2xl border px-4 py-4 text-left transition ${settings.theme === 'light' ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.06]'}`}>
                <Sun className="mb-3" size={20} /> Light
              </button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-medium">Accent</p>
            <p className="mt-2 text-sm text-muted">Silver / white is active for the Apple glass direction.</p>
            <div className="mt-4 h-12 rounded-2xl border border-white/20 bg-gradient-to-r from-white via-slate-300 to-slate-500" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Account</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Profile card</h2>
        <form onSubmit={saveProfile} className="mt-7 space-y-4">
          <label className="block text-sm text-muted">
            Display name
            <input className="field mt-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
          </label>
          <label className="block text-sm text-muted">
            Email
            <input className="field mt-2 opacity-70" value={user?.email || ''} disabled />
          </label>
          <button className="apple-button flex items-center gap-2 px-5 py-3 text-sm font-semibold" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save settings'}
          </button>
        </form>

        <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.06] p-5">
          <h3 className="text-lg font-semibold">Demo reset</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Loads realistic demo tasks, habits, and timeline blocks. Useful for portfolio screenshots.</p>
          <button onClick={resetData} className="ghost-button mt-4 flex items-center gap-2 px-5 py-3 text-sm font-semibold">
            <RotateCcw size={18} /> Reset demo data
          </button>
        </div>
        {message ? <p className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">{message}</p> : null}
      </GlassCard>
    </div>
  )
}
