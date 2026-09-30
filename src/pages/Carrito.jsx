import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import { useCart } from '../context/CartContext'

export default function Carrito() {
  const { cartItems, totalQuantity, clearCart } = useCart()

  return (
    <main>
      <Navbar />
      <section className="cart-page" aria-labelledby="cart-title">
        <p className="kicker">TU SELECCIÓN NUBE 3D</p>
        <h1 id="cart-title">Tu carrito</h1>
        <AnimatePresence mode="wait">
          {cartItems.length ? (
            <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div className="cart-toolbar">
                <p>{totalQuantity} {totalQuantity === 1 ? 'producto' : 'productos'} en tu carrito</p>
                <button type="button" className="cart-remove" onClick={clearCart}>Vaciar carrito</button>
              </div>
              <div className="cart-layout">
                <div>
                  <ul className="cart-items" aria-label="Productos en tu carrito">
                    <AnimatePresence initial={true}>
                      {cartItems.map((product) => <CartItem key={product.id} product={product} />)}
                    </AnimatePresence>
                  </ul>
                  <Link className="text-button cart-continue" to="/catalogo">Continuar comprando <span aria-hidden="true">↗</span></Link>
                </div>
                <CartSummary />
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="cart-empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <div className="cart-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16h24l3 26H9l3-26Z" /><path d="M18 19V12a6 6 0 0 1 12 0v7" /></svg>
              </div>
              <h2>Tu carrito está vacío</h2>
              <p>Encuentra ese diseño que hace match contigo.</p>
              <Link className="primary-button" to="/catalogo">Explorar productos <span aria-hidden="true">↗</span></Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <Footer />
    </main>
  )
}
