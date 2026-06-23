import BackgroundOrbs from './BackgroundOrbs'

export default function SetupScreen() {
  return (
    <main className="app-noise grid min-h-screen place-items-center px-6 py-10">
      <BackgroundOrbs />
      <section className="glass-panel relative z-10 w-full max-w-2xl rounded-[2.5rem] p-8 sm:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted">Setup needed</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">DayFlow</h1>
        <p className="mt-3 text-lg text-muted">Your day, orchestrated in glass.</p>
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-muted">
          <p>Create a <code>.env</code> file in the project root:</p>
          <pre className="mt-4 overflow-auto rounded-2xl bg-black/40 p-4 text-left text-xs text-white/90">
{`VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`}
          </pre>
          <p className="mt-4">Then run the Supabase SQL migration from <code>supabase/migrations/0001_dayflow_schema.sql</code>.</p>
        </div>
      </section>
    </main>
  )
}
