import { motion } from 'framer-motion'
import BackgroundOrbs from './BackgroundOrbs'

export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <main className="app-noise grid min-h-screen place-items-center px-6">
      <BackgroundOrbs />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel relative z-10 flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center"
      >
        <div className="timer-orb mb-5 grid h-20 w-20 place-items-center rounded-full border border-white/20 shadow-glass">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
        <h1 className="text-xl font-semibold">DayFlow</h1>
        <p className="mt-2 text-sm text-muted">{label}</p>
      </motion.div>
    </main>
  )
}
