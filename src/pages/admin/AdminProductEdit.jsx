import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { useProducts } from '../../context/ProductContext'

export default function AdminProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categories, getProductById, updateProduct } = useProducts()
  const product = getProductById(id)
  if (!product) return <Navigate to="/admin/productos" replace />

  return (
    <section className="admin-page admin-form-page">
      <div className="admin-page-heading"><div><p className="kicker">PRODUCT STUDIO / EDITAR DISEÑO</p><h1>Editar producto</h1><p>Los cambios se verán también en la tienda pública y en el carrito.</p></div><Link className="text-button" to="/admin/productos">← Volver</Link></div>
      <ProductForm initialProduct={product} categories={categories} submitLabel="Guardar cambios" onSubmit={(values) => { const result = updateProduct(product.id, values); if (result.ok) navigate('/admin/productos'); return result }} />
    </section>
  )
}
