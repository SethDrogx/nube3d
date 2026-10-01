import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'

export default function Producto() {
  const { id } = useParams()
  const { getProductById } = useProducts()
  const { addProduct } = useCart()
  const product = getProductById(id)

  if (!product) {
    return (
      <main>
        <Navbar />
        <section className="route-placeholder"><p className="kicker">PRODUCTO</p><h1>Producto no encontrado</h1><p className="route-placeholder-copy">Este diseño ya no está disponible en el catálogo.</p><Link className="primary-button" to="/catalogo">Volver al catálogo <span>↗</span></Link></section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />
      <motion.section className="product-detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="product-detail-image" style={{ background: product.color }}><img src={product.image || '/placeholder.jpg'} alt={product.name} /></div>
        <div className="product-detail-copy">
          <p className="kicker">{product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description || 'Diseño impreso en 3D bajo pedido.'}</p>
          <strong className="product-detail-price">${product.price.toFixed(2)}</strong>
          <p className={`stock-state ${product.stock === 0 ? 'out' : ''}`}>{product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}</p>
          <motion.button className="primary-button product-detail-add" type="button" disabled={product.stock === 0} onClick={() => addProduct(product.id)} whileTap={product.stock === 0 ? undefined : { scale: 0.98 }}>
            {product.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'} <span>↗</span>
          </motion.button>
          <Link className="text-button" to="/catalogo">← Seguir explorando</Link>
        </div>
      </motion.section>
      <Footer />
    </main>
  )
}
