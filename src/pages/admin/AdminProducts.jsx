import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductTable from '../../components/admin/ProductTable'
import ConfirmModal from '../../components/admin/ConfirmModal'
import { useProducts } from '../../context/ProductContext'

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts()
  const [target, setTarget] = useState(null)
  const closeModal = useCallback(() => setTarget(null), [])

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div><p className="kicker">CATÁLOGO</p><h1>Productos</h1><p>{products.length} {products.length === 1 ? 'producto administrado' : 'productos administrados'}.</p></div>
        <Link className="primary-button" to="/admin/productos/nuevo">Nuevo producto <span>↗</span></Link>
      </div>
      <ProductTable products={products} onDelete={setTarget} />
      <ConfirmModal open={Boolean(target)} title="¿Eliminar este producto?" message={target ? `“${target.name}” desaparecerá del catálogo público y del carrito si estaba agregado.` : ''} confirmLabel="Eliminar producto" danger onCancel={closeModal} onConfirm={() => { if (target) deleteProduct(target.id); setTarget(null) }} />
    </section>
  )
}
