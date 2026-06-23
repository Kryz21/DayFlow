import { useMemo, useState } from 'react'
import { Check, Filter, Plus, Search, Trash2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import EmptyState from '../components/EmptyState'
import { useDayFlow } from '../context/DataContext'
import { CATEGORIES, PRIORITIES } from '../lib/demoData'

const defaultTask = {
  title: '',
  notes: '',
  category: 'Study',
  priority: 'Medium'
}

export default function TaskManager() {
  const { tasks, createTask, updateTask, deleteTask } = useDayFlow()
  const [form, setForm] = useState(defaultTask)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('priority')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    await createTask({ ...form, title: form.title.trim() })
    setForm(defaultTask)
  }

  const visibleTasks = useMemo(() => {
    const priorityScore = { High: 3, Medium: 2, Low: 1 }
    return tasks
      .filter((task) => filter === 'All' || task.category === filter)
      .filter((task) => task.title.toLowerCase().includes(query.toLowerCase()) || task.notes?.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === 'priority') return priorityScore[b.priority] - priorityScore[a.priority]
        if (sort === 'status') return Number(a.completed) - Number(b.completed)
        return new Date(b.created_at) - new Date(a.created_at)
      })
  }, [filter, query, sort, tasks])

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-muted">Task manager</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Capture the work</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" />
          <textarea className="field min-h-28 resize-none" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" />
          <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
          <button className="apple-button flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold">
            <Plus size={18} /> Add task
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted">Command list</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Tasks</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={17} />
              <input className="field pl-11" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
            </label>
            <select className="field sm:w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
            <select className="field sm:w-40" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {visibleTasks.length === 0 ? (
          <EmptyState title="Nothing here" description="Your filtered view is empty. Add a task or loosen the filter net." action={<span className="inline-flex items-center gap-2 text-sm text-muted"><Filter size={16} /> Filtered empty state</span>} />
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task) => (
              <article key={task.id} className="rounded-[1.6rem] border border-white/10 bg-white/[0.07] p-4 transition hover:-translate-y-1 hover:bg-white/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>{task.category}</span>
                      <span>•</span>
                      <span>{task.priority}</span>
                    </div>
                    <h3 className={`text-lg font-semibold ${task.completed ? 'text-muted line-through' : ''}`}>{task.title}</h3>
                    {task.notes ? <p className="mt-2 text-sm leading-6 text-muted">{task.notes}</p> : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => updateTask(task.id, { completed: !task.completed })} className={`ghost-button grid h-10 w-10 place-items-center ${task.completed ? 'bg-white text-black' : ''}`} aria-label="Toggle task">
                      <Check size={18} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="ghost-button grid h-10 w-10 place-items-center text-red-100" aria-label="Delete task">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
