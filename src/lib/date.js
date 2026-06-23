export function getTodayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDateLong(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 22) return 'Good evening'
  return 'Still flowing tonight'
}

export function minutesToLabel(minutes) {
  if (!minutes) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m}m`
  return `${h}h ${m}m`
}

export function timeToMinutes(time = '00:00') {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function cleanTime(time = '09:00') {
  return time.slice(0, 5)
}
