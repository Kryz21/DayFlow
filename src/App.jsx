import { useState } from 'react'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useDayFlow } from './context/DataContext'
import AuthScreen from './components/AuthScreen'
import Dock from './components/Dock'
import LoadingScreen from './components/LoadingScreen'
import SetupScreen from './components/SetupScreen'
import BackgroundOrbs from './components/BackgroundOrbs'
import TopBar from './components/TopBar'
import Dashboard from './sections/Dashboard'
import Timeline from './sections/Timeline'
import TaskManager from './sections/TaskManager'
import HabitTracker from './sections/HabitTracker'
import FocusMode from './sections/FocusMode'
import Settings from './sections/Settings'

const sections = {
  dashboard: Dashboard,
  timeline: Timeline,
  tasks: TaskManager,
  habits: HabitTracker,
  focus: FocusMode,
  settings: Settings
}

function DayFlowShell() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { loading, error } = useDayFlow()
  const ActiveSection = sections[activeSection]

  if (loading) return <LoadingScreen label="Polishing the glass panels" />

  return (
    <main className="app-noise min-h-screen overflow-x-hidden px-4 pb-32 pt-4 sm:px-6 lg:px-10">
      <BackgroundOrbs />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <TopBar activeSection={activeSection} />
        {error ? (
          <div className="glass-panel rounded-[2rem] p-6 text-sm text-red-100">{error}</div>
        ) : null}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ActiveSection setActiveSection={setActiveSection} />
        </motion.div>
      </div>
      <Dock activeSection={activeSection} setActiveSection={setActiveSection} />
    </main>
  )
}

function ProtectedApp() {
  const { user, loading, hasSupabaseEnv } = useAuth()

  if (!hasSupabaseEnv) return <SetupScreen />
  if (loading) return <LoadingScreen label="Opening DayFlow" />
  if (!user) return <AuthScreen />

  return (
    <DataProvider>
      <DayFlowShell />
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  )
}
