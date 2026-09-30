import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import { useCart } from '../context/CartContext'

function BagIcon() {
  return <span aria-hidden="true" className="bag-icon">⌂</span>
}

export default function Navbar({ query = '', onQueryChange = () => {} }) {
  const { totalQuantity: cartCount } = useCart()
  return (
    <>
      <motion.div
        className="announcement"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        Envío gratis en compras mayores a $50 <span>·</span> Hecho bajo pedido en México
      </motion.div>
      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }}>
          <Brand />
        </motion.div>
        <nav>
          <Link to="/catalogo">Productos</Link>
          <a href="/#categorias">Categorías</a>
          <Link to="/personalizado">Personaliza</Link>
          <a href="/#nosotros">Nosotros</a>
        </nav>
        <div className="header-actions">
          <label className="search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar productos"
              aria-label="Buscar productos"
            />
          </label>
          <Link className="login" to="/login">Iniciar sesión</Link>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            <Link className="cart" to="/carrito" aria-label={`Carrito con ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}>
              <BagIcon />
              <motion.b
                key={cartCount}
                initial={{ scale: 0.85, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {cartCount}
              </motion.b>
            </Link>
          </motion.div>
        </div>
      </motion.header>
    </>
  )
}
