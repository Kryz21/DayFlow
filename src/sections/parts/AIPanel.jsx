import { useState } from 'react'
import { BrainCircuit, WandSparkles } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { useDayFlow } from '../../context/DataContext'

export default function AIPanel() {
  const { runAIPlanner, applyAIPlan } = useDayFlow()
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [error, setError] = useState('')

  async function generatePlan() {
    setLoading(true)
    setError('')
    try {
      const result = await runAIPlanner()
      setPlan(result)
    } catch (err) {
      setError(err.message || 'AI planner could not generate a plan.')
    } finally {
      setLoading(false)
    }
  }

  async function applyPlan() {
    try {
      await applyAIPlan(plan?.blocks ?? [])
      setPlan(null)
    } catch (err) {
      setError(err.message || 'Could not apply AI plan.')
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-muted">Gemini planner</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Generate today’s flow</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Turns tasks and habits into a clean timeline. If Gemini is not configured, it falls back to demo mode.</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
          <BrainCircuit />
        </div>
      </div>

      <button onClick={generatePlan} disabled={loading} className="apple-button mt-6 flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-semibold disabled:opacity-60">
        <WandSparkles size={18} /> {loading ? 'Generating...' : 'Generate AI plan'}
      </button>

      {error ? <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}

      {plan ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium">{plan.summary}</p>
          <div className="max-h-64 space-y-2 overflow-auto pr-1">
            {(plan.blocks ?? []).map((block, index) => (
              <div key={`${block.title}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{block.title}</span>
                  <span className="text-xs text-muted">{block.start_time || block.startTime} - {block.end_time || block.endTime}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{block.category} • {block.priority}</p>
              </div>
            ))}
          </div>
          <button onClick={applyPlan} className="ghost-button w-full px-4 py-3 text-sm font-semibold">Apply to timeline</button>
        </div>
      ) : null}
    </GlassCard>
  )
}
