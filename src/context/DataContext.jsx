import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getDemoHabits, getDemoTasks, getDemoTimelineBlocks } from '../lib/demoData'
import { getTodayISO } from '../lib/date'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

const defaultSettings = {
  theme: 'dark',
  accent: 'silver',
  display_name: 'DayFlow User'
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [timelineBlocks, setTimelineBlocks] = useState([])
  const [habits, setHabits] = useState([])
  const [habitLogs, setHabitLogs] = useState([])
  const [focusSessions, setFocusSessions] = useState([])
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const today = getTodayISO()

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
  }, [])

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')

    try {
      const [tasksRes, timelineRes, habitsRes, logsRes, focusRes, settingsRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('completed', { ascending: true })
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true }),
        supabase
          .from('timeline_blocks')
          .select('*')
          .eq('user_id', user.id)
          .eq('block_date', today)
          .order('start_time', { ascending: true }),
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .eq('active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('log_date', today),
        supabase
          .from('focus_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('completed_at', `${today}T00:00:00`)
          .order('completed_at', { ascending: false }),
        supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
      ])

      const responses = [tasksRes, timelineRes, habitsRes, logsRes, focusRes, settingsRes]
      const firstError = responses.find((res) => res.error)?.error
      if (firstError) throw firstError

      setTasks(tasksRes.data ?? [])
      setTimelineBlocks(timelineRes.data ?? [])
      setHabits(habitsRes.data ?? [])
      setHabitLogs(logsRes.data ?? [])
      setFocusSessions(focusRes.data ?? [])

      const loadedSettings = settingsRes.data ?? {
        ...defaultSettings,
        user_id: user.id,
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'DayFlow User'
      }
      setSettings(loadedSettings)
      applyTheme(loadedSettings.theme)
    } catch (err) {
      setError(err.message || 'Could not load DayFlow data.')
    } finally {
      setLoading(false)
    }
  }, [applyTheme, today, user])

  useEffect(() => {
    if (user) fetchAll()
  }, [fetchAll, user])

  async function createTask(payload) {
    const row = {
      user_id: user.id,
      due_date: today,
      completed: false,
      sort_order: tasks.length + 1,
      ...payload
    }
    const { data, error: err } = await supabase.from('tasks').insert(row).select().single()
    if (err) throw err
    setTasks((prev) => [data, ...prev])
    return data
  }

  async function updateTask(id, updates) {
    const { data, error: err } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
    if (err) throw err
    setTasks((prev) => prev.map((task) => (task.id === id ? data : task)))
    return data
  }

  async function deleteTask(id) {
    const { error: err } = await supabase.from('tasks').delete().eq('id', id)
    if (err) throw err
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  async function createTimelineBlock(payload) {
    const row = {
      user_id: user.id,
      block_date: today,
      completed: false,
      sort_order: timelineBlocks.length + 1,
      ...payload
    }
    const { data, error: err } = await supabase.from('timeline_blocks').insert(row).select().single()
    if (err) throw err
    setTimelineBlocks((prev) => [...prev, data].sort((a, b) => a.start_time.localeCompare(b.start_time)))
    return data
  }

  async function updateTimelineBlock(id, updates) {
    const { data, error: err } = await supabase.from('timeline_blocks').update(updates).eq('id', id).select().single()
    if (err) throw err
    setTimelineBlocks((prev) =>
      prev.map((block) => (block.id === id ? data : block)).sort((a, b) => a.start_time.localeCompare(b.start_time))
    )
    return data
  }

  async function deleteTimelineBlock(id) {
    const { error: err } = await supabase.from('timeline_blocks').delete().eq('id', id)
    if (err) throw err
    setTimelineBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  async function createHabit(payload) {
    const row = {
      user_id: user.id,
      active: true,
      sort_order: habits.length + 1,
      target_per_week: 7,
      icon: 'Sparkles',
      ...payload
    }
    const { data, error: err } = await supabase.from('habits').insert(row).select().single()
    if (err) throw err
    setHabits((prev) => [...prev, data])
    return data
  }

  async function deleteHabit(id) {
    const { data, error: err } = await supabase.from('habits').update({ active: false }).eq('id', id).select().single()
    if (err) throw err
    setHabits((prev) => prev.filter((habit) => habit.id !== data.id))
  }

  async function toggleHabit(habit) {
    const existing = habitLogs.find((log) => log.habit_id === habit.id)
    if (existing) {
      const { error: err } = await supabase.from('habit_logs').delete().eq('id', existing.id)
      if (err) throw err
      setHabitLogs((prev) => prev.filter((log) => log.id !== existing.id))
      return null
    }

    const { data, error: err } = await supabase
      .from('habit_logs')
      .insert({ user_id: user.id, habit_id: habit.id, log_date: today, completed: true })
      .select()
      .single()
    if (err) throw err
    setHabitLogs((prev) => [...prev, data])
    return data
  }

  async function saveFocusSession(durationMinutes) {
    const { data, error: err } = await supabase
      .from('focus_sessions')
      .insert({ user_id: user.id, duration_minutes: durationMinutes })
      .select()
      .single()
    if (err) throw err
    setFocusSessions((prev) => [data, ...prev])
    return data
  }

  async function updateSettings(updates) {
    const next = { ...settings, ...updates, user_id: user.id }
    const { data, error: err } = await supabase
      .from('user_settings')
      .upsert(next, { onConflict: 'user_id' })
      .select()
      .single()
    if (err) throw err
    setSettings(data)
    applyTheme(data.theme)
    return data
  }

  async function resetDemoData() {
    await supabase.from('habit_logs').delete().eq('user_id', user.id)
    await supabase.from('focus_sessions').delete().eq('user_id', user.id)
    await supabase.from('timeline_blocks').delete().eq('user_id', user.id)
    await supabase.from('tasks').delete().eq('user_id', user.id)
    await supabase.from('habits').delete().eq('user_id', user.id)

    const demoTasks = getDemoTasks().map((item) => ({ ...item, user_id: user.id }))
    const demoBlocks = getDemoTimelineBlocks().map((item) => ({ ...item, user_id: user.id }))
    const demoHabits = getDemoHabits().map((item) => ({ ...item, user_id: user.id }))

    await Promise.all([
      supabase.from('tasks').insert(demoTasks),
      supabase.from('timeline_blocks').insert(demoBlocks),
      supabase.from('habits').insert(demoHabits)
    ])

    await fetchAll()
  }

  async function runAIPlanner() {
    const { data, error: err } = await supabase.functions.invoke('generate-day-plan', {
      body: {
        date: today,
        tasks: tasks.map(({ title, category, priority, notes, completed }) => ({ title, category, priority, notes, completed })),
        habits: habits.map(({ title, target_per_week }) => ({ title, target_per_week }))
      }
    })
    if (err) throw err
    return data
  }

  async function applyAIPlan(blocks = []) {
    if (!blocks.length) return
    const payload = blocks.map((block, index) => ({
      user_id: user.id,
      block_date: today,
      title: block.title || 'Focus block',
      start_time: block.start_time || block.startTime || '09:00',
      end_time: block.end_time || block.endTime || '10:00',
      category: block.category || 'Other',
      priority: block.priority || 'Medium',
      completed: false,
      sort_order: index + timelineBlocks.length + 1
    }))

    const { data, error: err } = await supabase.from('timeline_blocks').insert(payload).select()
    if (err) throw err
    setTimelineBlocks((prev) => [...prev, ...(data ?? [])].sort((a, b) => a.start_time.localeCompare(b.start_time)))
  }

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed).length
    const pendingTasks = tasks.filter((task) => !task.completed).length
    const completedHabits = habitLogs.length
    const focusMinutes = focusSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0)
    const totalItems = tasks.length + timelineBlocks.length + habits.length
    const doneItems = completedTasks + timelineBlocks.filter((block) => block.completed).length + completedHabits

    return {
      completedTasks,
      pendingTasks,
      completedHabits,
      focusMinutes,
      dayProgress: totalItems ? Math.round((doneItems / totalItems) * 100) : 0
    }
  }, [focusSessions, habitLogs.length, habits.length, tasks, timelineBlocks])

  const value = useMemo(
    () => ({
      tasks,
      timelineBlocks,
      habits,
      habitLogs,
      focusSessions,
      settings,
      stats,
      loading,
      error,
      today,
      fetchAll,
      createTask,
      updateTask,
      deleteTask,
      createTimelineBlock,
      updateTimelineBlock,
      deleteTimelineBlock,
      createHabit,
      deleteHabit,
      toggleHabit,
      saveFocusSession,
      updateSettings,
      resetDemoData,
      runAIPlanner,
      applyAIPlan
    }),
    [tasks, timelineBlocks, habits, habitLogs, focusSessions, settings, stats, loading, error, today]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useDayFlow() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useDayFlow must be used inside DataProvider')
  return ctx
}
