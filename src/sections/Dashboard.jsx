import { motion } from 'framer-motion'
import { BrainCircuit, CheckCircle2, Clock3, ListTodo, Sparkles } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import ProgressRing from '../components/ProgressRing'
import CalendarCube from '../components/three/CalendarCube'
import { useDayFlow } from '../context/DataContext'
import { formatDateLong, greetingForNow, minutesToLabel } from '../lib/date'
import AIPanel from './parts/AIPanel'

function StatCard({ icon: Icon, label, value, hint, delay }) {
  return (
    <GlassCard delay={delay} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight">{value}</h3>
          <p className="mt-2 text-xs text-muted">{hint}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
          <Icon size={21} />
        </div>
      </div>
    </GlassCard>
  )
}

export default function Dashboard({ setActiveSection }) {
  const { stats, timelineBlocks, tasks } = useDayFlow()
  const nextBlock = timelineBlocks.find((block) => !block.completed)
  const nextTask = tasks.find((task) => !task.completed)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="space-y-6">
        <GlassCard className="hero-panel min-h-[360px] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-muted">{formatDateLong()}</p>
              <h2 className="mt-4 text-5xl font-bold tracking-[-0.06em] sm:text-6xl">
                {greetingForNow()}.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
                Today is not a checklist. It is a sequence. Arrange it cleanly, then glide through it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setActiveSection('timeline')} className="apple-button px-5 py-3 text-sm font-semibold">
                  Open timeline
                </button>
                <button onClick={() => setActiveSection('focus')} className="ghost-button px-5 py-3 text-sm font-semibold">
                  Start focus
                </button>
              </div>
            </div>
            <div className="h-[300px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <CalendarCube />
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CheckCircle2} label="Tasks completed" value={stats.completedTasks} hint="Clean wins stacked" delay={0.05} />
          <StatCard icon={ListTodo} label="Pending tasks" value={stats.pendingTasks} hint="Still in orbit" delay={0.1} />
          <StatCard icon={Clock3} label="Focus time" value={minutesToLabel(stats.focusMinutes)} hint="Tracked today" delay={0.15} />
          <StatCard icon={Sparkles} label="Habits completed" value={stats.completedHabits} hint="Daily rituals" delay={0.2} />
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted">Day progress</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">{stats.dayProgress}% sequence complete</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Progress combines completed tasks, finished timeline blocks, and habits.</p>
            </div>
            <ProgressRing value={stats.dayProgress} label="Day progress" />
          </div>
        </GlassCard>
      </section>

      <aside className="space-y-6">
        <AIPanel />
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Next in flow</h3>
              <p className="text-sm text-muted">Tiny runway view</p>
            </div>
          </div>
          <div className="space-y-3">
            <motion.div whileHover={{ x: 4 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Timeline</p>
              <h4 className="mt-2 font-semibold">{nextBlock?.title || 'No timeline block queued'}</h4>
              <p className="mt-1 text-sm text-muted">{nextBlock ? `${nextBlock.start_time} - ${nextBlock.end_time}` : 'Add a block to give your day rails.'}</p>
            </motion.div>
            <motion.div whileHover={{ x: 4 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Task</p>
              <h4 className="mt-2 font-semibold">{nextTask?.title || 'No pending task'}</h4>
              <p className="mt-1 text-sm text-muted">{nextTask ? `${nextTask.category} • ${nextTask.priority}` : 'Suspiciously peaceful.'}</p>
            </motion.div>
          </div>
        </GlassCard>
      </aside>
    </div>
  )
}
