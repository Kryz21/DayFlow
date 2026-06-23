import { getTodayISO } from './date'

export const CATEGORIES = ['Study', 'Fitness', 'Personal', 'Work', 'Creative', 'Other']
export const PRIORITIES = ['Low', 'Medium', 'High']

export function getDemoTasks() {
  const today = getTodayISO()
  return [
    {
      title: 'Revise electrostatics numericals',
      notes: 'Focus on Gaussian surface and flux questions.',
      category: 'Study',
      priority: 'High',
      due_date: today,
      completed: false,
      sort_order: 1
    },
    {
      title: '30 minute workout',
      notes: 'Push day with clean form. No heroic chaos.',
      category: 'Fitness',
      priority: 'Medium',
      due_date: today,
      completed: false,
      sort_order: 2
    },
    {
      title: 'Ship DayFlow landing polish',
      notes: 'Check mobile nav and loading states.',
      category: 'Creative',
      priority: 'High',
      due_date: today,
      completed: true,
      sort_order: 3
    }
  ]
}

export function getDemoTimelineBlocks() {
  const today = getTodayISO()
  return [
    {
      title: 'Deep study block',
      block_date: today,
      start_time: '08:30',
      end_time: '10:00',
      category: 'Study',
      priority: 'High',
      completed: false,
      sort_order: 1
    },
    {
      title: 'Build UI sprint',
      block_date: today,
      start_time: '12:00',
      end_time: '13:30',
      category: 'Creative',
      priority: 'High',
      completed: false,
      sort_order: 2
    },
    {
      title: 'Workout + reset',
      block_date: today,
      start_time: '18:00',
      end_time: '19:00',
      category: 'Fitness',
      priority: 'Medium',
      completed: false,
      sort_order: 3
    }
  ]
}

export function getDemoHabits() {
  return [
    { title: 'Hydration', icon: 'Droplet', target_per_week: 7, active: true, sort_order: 1 },
    { title: 'No-scroll study start', icon: 'BookOpen', target_per_week: 5, active: true, sort_order: 2 },
    { title: 'Evening reflection', icon: 'Moon', target_per_week: 4, active: true, sort_order: 3 }
  ]
}
