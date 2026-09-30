import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'

export default function CartItem({ product }) {
  const { increaseQuantity, decreaseQuantity, removeProduct } = useCart()

  return (
    <motion.li
      layout="position"
      className="cart-item"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
    >
      <img className="cart-item-image" src={product.image} alt={product.name} style={{ background: product.color }} />
      <div className="cart-item-info">
        <p className="cart-category">{product.category}</p>
        <h2>{product.name}</h2>
        <p className="cart-unit-price">${product.price.toFixed(2)} por unidad</p>
        <button className="cart-remove" type="button" onClick={() => removeProduct(product.id)} aria-label={`Eliminar ${product.name}`}>Eliminar</button>
      </div>
      <div className="cart-quantity" role="group" aria-label={`Cantidad de ${product.name}`}>
        <motion.button type="button" whileTap={{ scale: 0.92 }} disabled={product.quantity === 1} onClick={() => decreaseQuantity(product.id)} aria-label={`Disminuir cantidad de ${product.name}`}>−</motion.button>
        <span aria-live="polite" aria-atomic="true">{product.quantity}</span>
        <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => increaseQuantity(product.id)} aria-label={`Aumentar cantidad de ${product.name}`}>+</motion.button>
      </div>
      <strong className="cart-line-total">${(Math.round(product.price * 100) * product.quantity / 100).toFixed(2)}</strong>
    </motion.li>
  )
}
