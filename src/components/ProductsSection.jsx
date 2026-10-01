import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { reveal, stagger, viewport } from '../animation'

const MotionLink = motion.create(Link)

export default function ProductsSection({ products, onAdd }) {
  return (
    <motion.section id="catalogo" className="section products-section" initial="hidden" whileInView="show" viewport={viewport}>
      <motion.div className="section-heading" variants={reveal}>
        <div>
          <p className="kicker">SELECCIÓN NUBE 3D</p>
          <h2>Diseños que hacen <em>match</em> contigo.</h2>
        </div>
        <MotionLink className="text-button" to="/catalogo" whileHover={{ x: 4 }}>Ver catálogo completo <span>↗</span></MotionLink>
      </motion.div>
      {products.length ? (
        <motion.div className="product-grid" variants={stagger}>
          {products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}
        </motion.div>
      ) : (
        <motion.div className="catalog-empty" variants={reveal}><p>No encontramos productos con esa búsqueda.</p></motion.div>
      )}
    </motion.section>
  )
}
