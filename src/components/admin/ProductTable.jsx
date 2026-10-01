import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

export default function ProductTable({ products, onDelete }) {
  if (!products.length) return <div className="admin-empty"><h2>No hay productos</h2><p>Crea el primer producto para verlo aquí y en la tienda.</p><Link className="primary-button" to="/admin/productos/nuevo">Nuevo producto <span>↗</span></Link></div>

  return (
    <div className="admin-product-list">
      <div className="admin-product-row admin-product-head" aria-hidden="true"><span>Producto</span><span>Categoría</span><span>Precio</span><span>Stock</span><span>Estado</span><span>Acciones</span></div>
      {products.map((product) => (
        <motion.article className="admin-product-row" key={product.id} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-product-cell admin-product-identity"><img src={product.image || '/placeholder.jpg'} alt="" /><div><strong>{product.name}</strong><small>ID {product.id}</small></div></div>
          <div className="admin-product-cell" data-label="Categoría">{product.category}</div>
          <div className="admin-product-cell" data-label="Precio">${product.price.toFixed(2)}</div>
          <div className="admin-product-cell" data-label="Stock">{product.stock}</div>
          <div className="admin-product-cell" data-label="Estado"><span className={`admin-status ${product.stock === 0 ? 'out' : ''}`}>{product.stock === 0 ? 'Agotado' : 'Disponible'}</span></div>
          <div className="admin-product-cell admin-row-actions" data-label="Acciones"><Link to={`/admin/productos/${product.id}/editar`}>Editar</Link><button type="button" onClick={() => onDelete(product)}>Eliminar</button></div>
        </motion.article>
      ))}
    </div>
  )
}
