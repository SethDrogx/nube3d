import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
}

const imageVariants = { hidden: { scale: 1 }, show: { scale: 1 }, hover: { scale: 1.055 } }

export default function ProductCard({ product, onAdd, preview = false }) {
  const soldOut = product.stock === 0
  const badge = soldOut ? 'Agotado' : product.tag
  const CardLink = preview ? 'div' : Link
  return (
    <motion.article className="product-card" variants={cardVariants} whileHover="hover" whileTap={{ scale: 0.995 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
      <motion.div className="product-card-lift" variants={{ hidden: { y: 0 }, show: { y: 0 }, hover: { y: -8 } }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
        <CardLink {...(preview ? {} : { to: `/producto/${product.id}`, 'aria-label': `Ver ${product.name}` })} className="product-card-link">
          <div className="product-image" style={{ background: product.color }}>
            <motion.img src={product.image || '/placeholder.jpg'} alt={product.name} variants={imageVariants} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }} />
            {badge && <motion.span className="product-tag" variants={{ hidden: { y: 0 }, show: { y: 0 }, hover: { y: -2 } }}>{badge}</motion.span>}
            <motion.span className="heart-button" aria-hidden="true" whileHover={{ scale: 1.12 }}>♡</motion.span>
          </div>
          <div className="product-info">
            <p className="eyebrow">{product.category}</p>
            <h3>{product.name}</h3>
          </div>
        </CardLink>
        <div className="product-footer product-footer-separate">
          <strong>${product.price.toFixed(2)}</strong>
          {preview ? <span className={`studio-stock ${soldOut ? 'is-empty' : ''}`}>{soldOut ? 'Agotado' : 'Disponible'}</span> : <motion.button className="add-button" disabled={soldOut} onClick={() => onAdd(product.id)} aria-label={`${soldOut ? 'Agotado' : 'Agregar al carrito'}: ${product.name}`} whileHover={soldOut ? undefined : { x: 2 }} whileTap={soldOut ? undefined : { scale: 0.94 }}>
            {soldOut ? 'Agotado' : <>Agregar <span>+</span></>}
          </motion.button>}
        </div>
      </motion.div>
    </motion.article>
  )
}
