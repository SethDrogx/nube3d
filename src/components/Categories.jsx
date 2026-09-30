import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { categories } from '../data/products'
import { reveal, stagger, viewport } from '../animation'

const MotionLink = motion.create(Link)

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Categories() {
  return (
    <motion.section
      id="categorias"
      className="section categories-section"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.div className="section-heading" variants={reveal}>
        <div>
          <p className="kicker">EXPLORA POR CATEGORÍA</p>
          <h2>Encuentra tu próximo <em>favorito.</em></h2>
        </div>
        <MotionLink className="text-button" to="/catalogo" whileHover={{ x: 4 }}>
          Ver todas <span>↗</span>
        </MotionLink>
      </motion.div>
      <motion.div className="category-grid" variants={stagger}>
        {categories.map((category) => (
          <MotionLink
            className="category-card"
            to="/catalogo"
            key={category.name}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          >
            <img src={category.image} alt={category.name} />
            <div><h3>{category.name}</h3><span>{category.count} ↗</span></div>
          </MotionLink>
        ))}
      </motion.div>
    </motion.section>
  )
}
