import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', delay = 0, as = 'div' }) {
  const Component = motion[as] || motion.div
  return (
    <Component
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-panel rounded-[2rem] ${className}`}
    >
      {children}
    </Component>
  )
}
