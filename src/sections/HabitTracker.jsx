import { useMemo, useState } from 'react'
import { Flame, Plus, Trash2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import EmptyState from '../components/EmptyState'
import ProgressRing from '../components/ProgressRing'
import { useDayFlow } from '../context/DataContext'

export default function HabitTracker() {
  const { habits, habitLogs, createHabit, deleteHabit, toggleHabit } = useDayFlow()
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState(7)
  const completedIds = useMemo(() => new Set(habitLogs.map((log) => log.habit_id)), [habitLogs])
  const completion = habits.length ? Math.round((habitLogs.length / habits.length) * 100) : 0

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await createHabit({ title: title.trim(), target_per_week: Number(target) })
    setTitle('')
    setTarget(7)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Habit tracker</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Daily rituals</h2>
        <div className="mt-7 grid place-items-center rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
          <ProgressRing value={completion} size={150} label="Habit completion" />
          <p className="mt-4 text-sm text-muted">{habitLogs.length} of {habits.length} habits complete today</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New habit" />
          <label className="block text-sm text-muted">
            Target per week
            <input className="field mt-2" type="number" min="1" max="7" value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
          <button className="apple-button flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold">
            <Plus size={18} /> Add habit
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Today</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Habit rings</h2>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
            <Flame />
          </div>
        </div>

        {habits.length === 0 ? (
          <EmptyState title="No rituals yet" description="Add a daily habit. The tracker starts clean and gets satisfying very quickly." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => {
              const done = completedIds.has(habit.id)
              return (
                <article key={habit.id} className="rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-5 transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{habit.title}</h3>
                      <p className="mt-1 text-sm text-muted">Target: {habit.target_per_week}/week</p>
                    </div>
                    <button onClick={() => deleteHabit(habit.id)} className="ghost-button grid h-10 w-10 place-items-center text-red-100" aria-label="Delete habit">
                      <Trash2 size={17} />
                    </button>
                  </div>
                  <button onClick={() => toggleHabit(habit)} className={`mt-5 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${done ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]'}`}>
                    {done ? 'Completed today' : 'Mark complete'}
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
