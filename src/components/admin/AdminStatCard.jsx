import { motion } from 'motion/react'

export default function AdminStatCard({ label, value, detail }) {
  return (
    <motion.article className="admin-stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ duration: 0.25 }}>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail && <span>{detail}</span>}
    </motion.article>
  )
}
