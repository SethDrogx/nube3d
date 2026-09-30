import { motion } from 'motion/react'
import { useCart } from '../context/CartContext'

export default function CartSummary() {
  const { subtotal, shipping, total, notify } = useCart()

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <p className="kicker">TODO LISTO PARA CREAR</p>
      <h2 id="cart-summary-title">Resumen de tu carrito</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
        <div><dt>Envío</dt><dd>${shipping.toFixed(2)}</dd></div>
        <div className="cart-total"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
      </dl>
      <motion.button
        className="primary-button"
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => notify('El proceso de compra se implementará próximamente.')}
      >
        Finalizar compra <span aria-hidden="true">↗</span>
      </motion.button>
      <p className="cart-summary-note">Hecho bajo pedido, con un toque tuyo.</p>
    </aside>
  )
}
