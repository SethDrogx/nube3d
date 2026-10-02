import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { reveal, revealLeft, revealRight, stagger, viewport } from '../animation'

const MotionLink = motion.create(Link)

// custom-creative.jpg is a local copy of the photo already used by the Articulados demo category.

export default function CustomSection() {
  const [imageStatus, setImageStatus] = useState('loading')
  return (
    <motion.section
      id="personalizado"
      className="custom-section"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.div className="custom-image" variants={revealLeft}>
        {imageStatus !== 'ready' && <div className="custom-image-fallback" role="img" aria-label="Ilustración de una pieza personalizada"><svg viewBox="0 0 400 400" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="200" cy="200" r="135" opacity=".18" /><ellipse cx="200" cy="200" rx="92" ry="135" transform="rotate(35 200 200)" opacity=".35" /><ellipse cx="200" cy="200" rx="92" ry="135" transform="rotate(-35 200 200)" opacity=".35" /><path d="m200 120 70 40v80l-70 40-70-40v-80zm-70 40 70 40 70-40m-70 40v80" /><path d="m150 172 50 28 50-28m-100 20 50 28 50-28m-100 20 50 28 50-28" opacity=".45" /></g></svg></div>}
        {imageStatus !== 'failed' && <motion.img
          className={`custom-process-image ${imageStatus === 'loading' ? 'is-loading' : ''}`}
          src="/Impresión 3D de escultura espiral.png"
          alt="Proceso creativo para una pieza personalizada"
          aria-hidden={imageStatus === 'loading' ? true : undefined}
          onLoad={() => setImageStatus('ready')}
          onError={() => setImageStatus('failed')}
          whileHover={{ scale: 1.035 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />}
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
