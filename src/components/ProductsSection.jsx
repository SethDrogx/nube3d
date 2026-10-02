import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { reveal, stagger, viewport } from '../animation'

const MotionLink = motion.create(Link)

export default function ProductsSection({ products, onAdd, categoryView, onClearCategory }) {
  const categoryActive = categoryView?.active
  const emptyMessage = categoryActive && !categoryView.valid ? 'No encontramos esa categoría.' : categoryActive && !categoryView.products.length ? 'No hay diseños en esta categoría todavía.' : 'No encontramos productos con esa búsqueda.'
  return (
    <motion.section id="catalogo" className="section products-section" initial="hidden" whileInView="show" viewport={viewport}>
      <motion.div className="section-heading" variants={reveal}>
        <div>
          <p className="kicker">SELECCIÓN NUBE 3D</p>
          {categoryActive ? <><h2>{categoryView.valid ? categoryView.category : 'Categoría no encontrada'}</h2><p className="catalog-category-count">{products.length} {products.length === 1 ? 'diseño' : 'diseños'}</p></> : <h2>Diseños que hacen <em>match</em> contigo.</h2>}
        </div>
        {categoryActive ? <button className="text-button catalog-filter-clear" type="button" onClick={onClearCategory}>Ver todos <span aria-hidden="true">↗</span></button> : <MotionLink className="text-button" to="/catalogo" whileHover={{ x: 4 }}>Ver catálogo completo <span>↗</span></MotionLink>}
      </motion.div>
      {products.length ? (
        <motion.div className="product-grid" variants={stagger}>
          {products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}
        </motion.div>
      ) : (
        <motion.div className="catalog-empty" variants={reveal}><p>{emptyMessage}</p>{categoryActive && <button className="text-button catalog-filter-clear" type="button" onClick={onClearCategory}>Ver todos los productos <span aria-hidden="true">↗</span></button>}</motion.div>
      )}
    </motion.section>
  )
}
