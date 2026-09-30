import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { reveal, stagger } from '../animation'

const MotionLink = motion.create(Link)

export default function RouteShell({ kicker, title, children }) {
  return (
    <main>
      <Navbar />
      <motion.section
        className="route-placeholder"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p className="kicker" variants={reveal}>{kicker}</motion.p>
        <motion.h1 variants={reveal}>{title}</motion.h1>
        <motion.div className="route-placeholder-copy" variants={reveal}>{children}</motion.div>
        <motion.div variants={reveal}>
          <MotionLink className="primary-button" to="/" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            Volver al inicio <span>↗</span>
          </MotionLink>
        </motion.div>
      </motion.section>
      <Footer />
    </main>
  )
}
