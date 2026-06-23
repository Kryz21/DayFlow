import { BarChart3, CalendarDays, CheckSquare, Clock3, Settings, Sparkles } from 'lucide-react'
import ReactBitsDock from './reactbits/Dock'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'timeline', label: 'Timeline', icon: CalendarDays },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'habits', label: 'Habits', icon: Sparkles },
  { id: 'focus', label: 'Focus', icon: Clock3 },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function Dock({ activeSection, setActiveSection }) {
  const items = navItems.map(({ id, label, icon: Icon }) => ({
    label,
    icon: <Icon size={23} strokeWidth={activeSection === id ? 2.65 : 2.15} />,
    onClick: () => setActiveSection(id),
    className: activeSection === id ? 'dock-item-active' : ''
  }))

  return (
    <ReactBitsDock
      items={items}
      className="dayflow-dock"
      panelHeight={78}
      baseItemSize={54}
      magnification={86}
      distance={230}
      dockHeight={210}
      spring={{ mass: 0.09, stiffness: 175, damping: 11 }}
    />
  )
}