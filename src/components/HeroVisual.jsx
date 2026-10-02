import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

export default function HeroVisual() {
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0), pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 90, damping: 24 })
  const y = useSpring(pointerY, { stiffness: 90, damping: 24 })
  const rotateY = useTransform(x, [-1, 1], [-4, 4])
  const rotateX = useTransform(y, [-1, 1], [3, -3])
  const circleX = useTransform(x, [-1, 1], [-10, 10])
  const circleY = useTransform(y, [-1, 1], [-8, 8])
  const imageX = useTransform(x, [-1, 1], [-18, 18])
  const imageY = useTransform(y, [-1, 1], [-12, 12])
  const lightX = useTransform(x, [-1, 1], ['25%', '75%'])
  const lightY = useTransform(y, [-1, 1], ['25%', '75%'])
  const reset = () => { pointerX.set(0); pointerY.set(0) }
  function move(event) {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)))
    pointerY.set(Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)))
  }
  return <motion.div className="hero-art hero-visual" onPointerMove={move} onPointerLeave={reset} initial={reduced ? { opacity: 0 } : { opacity: 0, scale: .97, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .9, ease: 'easeOut' }}>
    <motion.div className="hero-depth" style={reduced ? undefined : { rotateX, rotateY }}>
      <motion.div className="hero-grid-backdrop" aria-hidden="true" style={reduced ? undefined : { x: circleX, y: circleY, z: -40 }} />
      <motion.div className="art-glow" aria-hidden="true" style={reduced ? undefined : { x: circleX, y: circleY, z: -15 }} />
      <motion.div className="hero-statue-layer" style={reduced ? undefined : { x: imageX, y: imageY, z: 24 }}>
        <motion.img src="https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=1100&q=90" alt="Figura decorativa impresa en 3D" animate={reduced ? { y: 0 } : { y: [0, -6, 0] }} transition={{ duration: 8, repeat: reduced ? 0 : Infinity, ease: 'easeInOut' }} />
      </motion.div>
      <motion.div className="hero-reflection" aria-hidden="true" style={reduced ? undefined : { '--light-x': lightX, '--light-y': lightY }} />
      <span className="hero-visual-caption" aria-hidden="true">NUBE 3D / OBJETOS CON INTENCIÓN</span>
    </motion.div>
  </motion.div>
}
