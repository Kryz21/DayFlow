import { CalendarClock, LogOut, RefreshCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDayFlow } from '../context/DataContext'
import { formatDateLong } from '../lib/date'

const labels = {
  dashboard: 'Dashboard',
  timeline: 'Day timeline',
  tasks: 'Task manager',
  habits: 'Habit tracker',
  focus: 'Focus mode',
  settings: 'Settings'
}

export default function TopBar({ activeSection }) {
  const { signOut, user } = useAuth()
  const { fetchAll, settings } = useDayFlow()
  const name = settings?.display_name || user?.email?.split('@')[0] || 'DayFlow User'

  return (
    <header className="glass-panel flex flex-col justify-between gap-4 rounded-[2rem] p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
          <CalendarClock size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">DayFlow</p>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{labels[activeSection]}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <span>{formatDateLong()}</span>
        <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
        <span>{name}</span>
        <button onClick={fetchAll} className="ghost-button grid h-10 w-10 place-items-center" aria-label="Refresh data">
          <RefreshCcw size={17} />
        </button>
        <button onClick={signOut} className="ghost-button grid h-10 w-10 place-items-center" aria-label="Sign out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
