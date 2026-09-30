import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { reveal, stagger } from '../animation'

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

      <motion.div
        className="hero-art"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="art-glow"
          animate={{ scale: [1, 1.07, 1], opacity: [0.58, 0.76, 0.58] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=1100&q=90"
          alt="Figura decorativa impresa en 3D"
          animate={{ y: [0, -10, 0], rotate: [0, 0.3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.025 }}
        />
        <motion.div
          className="floating-card"
          initial={{ opacity: 0, x: -18, y: 10 }}
          animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
          transition={{
            opacity: { duration: 0.55, delay: 0.7 },
            x: { duration: 0.55, delay: 0.7 },
            y: { duration: 3.4, delay: 1.25, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <motion.span
            className="floating-dot"
            animate={{ scale: [1, 1.45, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div><strong>Hecho para ti</strong><small>Personalización disponible</small></div>
        </motion.div>
      </motion.div>
    </section>
  )
}
