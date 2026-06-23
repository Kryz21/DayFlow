import { useEffect, useMemo, useState } from 'react'
import { Pause, Play, RotateCcw, TimerReset } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { useDayFlow } from '../context/DataContext'
import { minutesToLabel } from '../lib/date'

const FOCUS_MINUTES = 25

export default function FocusMode() {
  const { saveFocusSession, stats } = useDayFlow()
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          clearInterval(timer)
          setRunning(false)
          setSaving(true)
          saveFocusSession(FOCUS_MINUTES).finally(() => setSaving(false))
          return FOCUS_MINUTES * 60
        }
        return seconds - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [running, saveFocusSession])

  const progress = useMemo(() => Math.round(((FOCUS_MINUTES * 60 - secondsLeft) / (FOCUS_MINUTES * 60)) * 100), [secondsLeft])
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  function reset() {
    setRunning(false)
    setSecondsLeft(FOCUS_MINUTES * 60)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <GlassCard className="relative min-h-[570px] overflow-hidden p-6 sm:p-8">
        <div className={`pointer-events-none absolute inset-0 transition duration-700 ${running ? 'opacity-100' : 'opacity-[0.35]'}`}>
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-muted">Pomodoro</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Focus Mode</h2>
          <div className="timer-orb mt-10 grid h-72 w-72 place-items-center rounded-full border border-white/[0.15] shadow-glass sm:h-80 sm:w-80">
            <div>
              <p className="text-6xl font-bold tracking-[-0.08em] sm:text-7xl">{minutes}:{seconds}</p>
              <p className="mt-3 text-sm text-muted">{running ? 'Ambient focus running' : 'Ready when you are'}</p>
            </div>
          </div>
          <div className="mt-8 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => setRunning((value) => !value)} className="apple-button flex items-center gap-2 px-6 py-3 text-sm font-semibold">
              {running ? <Pause size={18} /> : <Play size={18} />} {running ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="ghost-button flex items-center gap-2 px-6 py-3 text-sm font-semibold">
              <RotateCcw size={18} /> Reset
            </button>
          </div>
          {saving ? <p className="mt-5 text-sm text-muted">Saving focus session...</p> : null}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
            <TimerReset />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Today’s focus</h3>
            <p className="text-sm text-muted">Measured in completed sessions</p>
          </div>
        </div>
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <p className="text-sm text-muted">Logged focus time</p>
          <h4 className="mt-2 text-5xl font-bold tracking-tight">{minutesToLabel(stats.focusMinutes)}</h4>
        </div>
        <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <p className="text-sm text-muted">Focus recipe</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <li>• Pick one task, not a task hydra.</li>
            <li>• Keep phone out of reach.</li>
            <li>• Start the timer and let the UI breathe.</li>
          </ul>
        </div>
      </GlassCard>
    </div>
  )
}
