import { Sparkles } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="grid place-items-center rounded-[1.8rem] border border-dashed border-white/[0.15] bg-white/5 p-8 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.15] bg-white/10">
        <Sparkles size={22} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
