import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
  TimerReset
} from 'lucide-react'
import CalendarCube from './three/CalendarCube'

const featureCards = [
  {
    icon: CalendarDays,
    eyebrow: 'Timeline',
    title: 'Your day becomes a cinematic sequence.',
    body: 'Time blocks stack into a clean route instead of a scattered task pile.'
  },
  {
    icon: BrainCircuit,
    eyebrow: 'AI Planner',
    title: 'Messy thoughts become a structured day.',
    body: 'Gemini can turn tasks, priorities, and focus goals into a realistic plan.'
  },
  {
    icon: TimerReset,
    eyebrow: 'Focus',
    title: 'A quiet command center for deep work.',
    body: 'Pomodoro sessions feel calm, intentional, and visually satisfying.'
  }
]

function MiniTask({ title, time, done }) {
  return (
    <div className="mac-mini-task">
      <span className={done ? 'mac-mini-check done' : 'mac-mini-check'}>
        {done ? <CheckCircle2 size={13} /> : null}
      </span>
      <div>
        <p>{title}</p>
        <small>{time}</small>
      </div>
    </div>
  )
}

export default function MacbookScrollShowcase() {
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start']
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.22
  })

  const deviceY = useTransform(smooth, [0, 0.25, 0.7, 1], [180, 0, -80, -170])
  const deviceScale = useTransform(smooth, [0, 0.24, 0.68, 1], [0.82, 1, 1.08, 0.92])
  const deviceRotateX = useTransform(smooth, [0, 0.25, 0.65, 1], [18, 0, -4, -12])
  const deviceRotateY = useTransform(smooth, [0, 0.38, 0.72, 1], [-18, 0, 7, 16])
  const cubeY = useTransform(smooth, [0, 0.5, 1], [100, -25, -120])
  const cubeScale = useTransform(smooth, [0, 0.5, 1], [0.72, 1.08, 0.86])
  const headingY = useTransform(smooth, [0, 0.35, 1], [70, 0, -80])
  const progressWidth = useTransform(smooth, [0.12, 0.82], ['8%', '100%'])

  return (
    <section ref={targetRef} className="mac-scroll-section">
      <div className="mac-scroll-sticky">
        <motion.div style={{ y: headingY }} className="mac-scroll-copy">
          <p className="premium-kicker">MacBook-style flow</p>
          <h2>
            Scroll through your day like a product launch.
          </h2>
          <p>
            DayFlow should not feel like a plain to-do list. This section adds depth, sticky motion,
            parallax layers, and 3D movement so the app feels alive without turning into a neon carnival.
          </p>

          <div className="mac-progress-shell">
            <motion.div style={{ width: progressWidth }} className="mac-progress-fill" />
          </div>

          <div className="mac-feature-stack">
            {featureCards.map((card, index) => {
              const Icon = card.icon
              const start = 0.18 + index * 0.16
              const end = start + 0.22
              const opacity = useTransform(smooth, [start, end], [0.35, 1])
              const y = useTransform(smooth, [start, end], [26, 0])

              return (
                <motion.article style={{ opacity, y }} className="mac-feature-card" key={card.title}>
                  <div className="mac-feature-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span>{card.eyebrow}</span>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </motion.div>

        <div className="mac-device-stage">
          <motion.div
            style={{
              y: deviceY,
              scale: deviceScale,
              rotateX: deviceRotateX,
              rotateY: deviceRotateY
            }}
            className="mac-device"
          >
            <div className="mac-device-topbar">
              <div className="mac-traffic">
                <span />
                <span />
                <span />
              </div>
              <p>DayFlow Command Center</p>
            </div>

            <div className="mac-device-screen">
              <div className="mac-screen-left">
                <p className="premium-kicker">Today</p>
                <h3>Orchestrated in glass.</h3>

                <MiniTask title="Physics revision sprint" time="08:30 - 09:15" done />
                <MiniTask title="Build DayFlow dock polish" time="11:45 - 12:30" done />
                <MiniTask title="Focus block: AI planner" time="15:00 - 16:00" />

                <div className="mac-pill-row">
                  <span>Study</span>
                  <span>Creative</span>
                  <span>Focus</span>
                </div>
              </div>

              <div className="mac-screen-right">
                <motion.div style={{ y: cubeY, scale: cubeScale }} className="mac-cube-shell">
                  <CalendarCube />
                </motion.div>

                <div className="mac-orbit-card card-a">
                  <Sparkles size={15} />
                  <span>4 habits</span>
                </div>

                <div className="mac-orbit-card card-b">
                  <Clock3 size={15} />
                  <span>2h focus</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{
              y: useTransform(smooth, [0, 1], [80, -130]),
              scale: useTransform(smooth, [0, 1], [0.8, 1.15])
            }}
            className="mac-floating-slab slab-one"
          />

          <motion.div
            style={{
              y: useTransform(smooth, [0, 1], [-40, 160]),
              scale: useTransform(smooth, [0, 1], [1.1, 0.76])
            }}
            className="mac-floating-slab slab-two"
          />
        </div>
      </div>
    </section>
  )
}