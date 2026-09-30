import { motion } from 'motion/react'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
}

const imageVariants = {
  hidden: { scale: 1 },
  show: { scale: 1 },
  hover: { scale: 1.055 },
}

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.article
      className="product-card"
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <motion.div
        className="product-card-lift"
        variants={{ hidden: { y: 0 }, show: { y: 0 }, hover: { y: -8 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <div className="product-image" style={{ background: product.color }}>
          <motion.img
            src={product.image}
            alt={product.name}
            variants={imageVariants}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="product-tag"
            variants={{ hidden: { y: 0 }, show: { y: 0 }, hover: { y: -2 } }}
          >
            {product.tag}
          </motion.span>
          <motion.button
            className="heart-button"
            aria-label={`Guardar ${product.name}`}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.86 }}
          >
            ♡
          </motion.button>
        </div>
        <div className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h3>{product.name}</h3>
          <div className="product-footer">
            <strong>${product.price.toFixed(2)}</strong>
            <motion.button
              className="add-button"
              onClick={() => onAdd(product.id)}
              aria-label={`Agregar al carrito: ${product.name}`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.94 }}
            >
              Agregar <motion.span whileHover={{ rotate: 90 }}>+</motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}
