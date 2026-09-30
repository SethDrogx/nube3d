import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { reveal, revealLeft, revealRight, stagger, viewport } from '../animation'

const MotionLink = motion.create(Link)

export default function CustomSection() {
  return (
    <motion.section
      id="personalizado"
      className="custom-section"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.div className="custom-image" variants={revealLeft}>
        <motion.img
          src="https://images.unsplash.com/photo-1631541909061-71e349d1f2f5?auto=format&fit=crop&w=1000&q=90"
          alt="Proceso creativo para una pieza personalizada"
          whileHover={{ scale: 1.035 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        <span>01 — 03</span>
      </motion.div>
      <motion.div className="custom-copy" variants={revealRight}>
        <motion.div variants={stagger}>
          <motion.p className="kicker" variants={reveal}>TU IDEA, NUESTRA TÉCNICA</motion.p>
          <motion.h2 variants={reveal}>¿Lo imaginaste?<br /><em>Lo imprimimos.</em></motion.h2>
          <motion.p variants={reveal}>
            Cuéntanos qué tienes en mente y lo convertimos en una pieza real. Desde un regalo con significado hasta ese accesorio que no encuentras en ningún otro lugar.
          </motion.p>
          <motion.div variants={reveal}>
            <MotionLink
              className="primary-button dark"
              to="/personalizado"
              whileHover={{ y: -3, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
            >
              Solicitar cotización <span>↗</span>
            </MotionLink>
          </motion.div>
          <motion.div className="steps" variants={stagger}>
            {[
              ['01', 'Cuéntanos tu idea'],
              ['02', 'Validamos el diseño'],
              ['03', 'Lo hacemos realidad'],
            ].map(([number, text]) => (
              <motion.div key={number} variants={reveal} whileHover={{ y: -4 }}>
                <b>{number}</b><span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
