import { motion } from 'motion/react'
import { reveal, stagger, viewport } from '../animation'

export default function QuoteSection() {
  return (
    <motion.section
      id="nosotros"
      className="quote-section"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.p className="kicker" variants={reveal}>HECHO CON INTENCIÓN</motion.p>
      <motion.blockquote variants={reveal}>“Los objetos cotidianos también pueden contar una historia.”</motion.blockquote>
      <motion.span variants={reveal}>— Equipo Nube 3D</motion.span>
    </motion.section>
  )
}
