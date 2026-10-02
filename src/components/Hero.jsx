import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { reveal, stagger } from '../animation'
import HeroVisual from './HeroVisual'

const MotionLink = motion.create(Link)

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <motion.div
        className="hero-copy"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p className="kicker" variants={reveal}>DISEÑO QUE COBRA VIDA</motion.p>
        <motion.h1 variants={reveal}>Imprimimos tus <em>ideas</em> en 3D.</motion.h1>
        <motion.p className="hero-subtitle" variants={reveal}>
          Figuras, accesorios, soportes y objetos únicos hechos especialmente para ti.
        </motion.p>
        <motion.div className="hero-buttons" variants={reveal}>
          <MotionLink
            className="primary-button"
            to="/catalogo"
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            Ver productos <span>↗</span>
          </MotionLink>
          <MotionLink
            className="text-button"
            to="/personalizado"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            Solicitar diseño personalizado <span>↗</span>
          </MotionLink>
        </motion.div>
        <motion.div className="hero-meta" variants={reveal}>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 320 }}>
            <strong>+120</strong><span>diseños disponibles</span>
          </motion.div>
          <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 320 }}>
            <strong>4.9/5</strong><span>reseñas de clientes</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <HeroVisual />
    </section>
  )
}
