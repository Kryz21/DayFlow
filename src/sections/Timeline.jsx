import { useState } from 'react'
import { Clock, Plus, Trash2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import EmptyState from '../components/EmptyState'
import { useDayFlow } from '../context/DataContext'
import { CATEGORIES, PRIORITIES } from '../lib/demoData'

const emptyBlock = {
  title: '',
  start_time: '09:00',
  end_time: '10:00',
  category: 'Study',
  priority: 'Medium'
}

export default function Timeline() {
  const { timelineBlocks, createTimelineBlock, updateTimelineBlock, deleteTimelineBlock, stats } = useDayFlow()
  const [form, setForm] = useState(emptyBlock)
  const [saving, setSaving] = useState(false)
  const [draggedId, setDraggedId] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    await createTimelineBlock({ ...form, title: form.title.trim() })
    setForm(emptyBlock)
    setSaving(false)
  }

  async function swapTimes(targetId) {
    if (!draggedId || draggedId === targetId) return
    const dragged = timelineBlocks.find((block) => block.id === draggedId)
    const target = timelineBlocks.find((block) => block.id === targetId)
    if (!dragged || !target) return
    await Promise.all([
      updateTimelineBlock(dragged.id, { start_time: target.start_time, end_time: target.end_time }),
      updateTimelineBlock(target.id, { start_time: dragged.start_time, end_time: dragged.end_time })
    ])
    setDraggedId(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Timeline builder</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Add a time block</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Block title" />
          <div className="grid grid-cols-2 gap-3">
            <input className="field" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            <input className="field" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
          </div>
          <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
          <button className="apple-button flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold" disabled={saving}>
            <Plus size={18} /> {saving ? 'Adding...' : 'Add block'}
          </button>
        </form>
        <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <p className="text-sm text-muted">Animated day progress</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${stats.dayProgress}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">{stats.dayProgress}% complete</p>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Today</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Vertical flow</h2>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
            <Clock />
          </div>
        </div>

        {timelineBlocks.length === 0 ? (
          <EmptyState title="No blocks yet" description="Add your first block, or use the AI planner from the dashboard to assemble a clean day sequence." />
        ) : (
          <div className="relative ml-3 space-y-4 border-l border-white/[0.14] pl-7">
            {timelineBlocks.map((block) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => setDraggedId(block.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => swapTimes(block.id)}
                className="group relative rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-4 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <span className="absolute -left-[2.22rem] top-6 h-4 w-4 rounded-full border-2 border-white bg-black shadow-[0_0_0_6px_rgba(255,255,255,0.08)]" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>{block.start_time} - {block.end_time}</span>
                      <span>•</span>
                      <span>{block.category}</span>
                      <span>•</span>
                      <span>{block.priority}</span>
                    </div>
                    <h3 className={`mt-2 text-lg font-semibold ${block.completed ? 'text-muted line-through' : ''}`}>{block.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateTimelineBlock(block.id, { completed: !block.completed })} className={`ghost-button px-4 py-2 text-sm ${block.completed ? 'bg-white text-black' : ''}`}>
                      {block.completed ? 'Done' : 'Mark done'}
                    </button>
                    <button onClick={() => deleteTimelineBlock(block.id)} className="ghost-button grid h-10 w-10 place-items-center text-red-100" aria-label="Delete block">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
