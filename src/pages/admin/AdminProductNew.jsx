import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { useProducts } from '../../context/ProductContext'

export default function AdminProductNew() {
  const navigate = useNavigate()
  const { categories, addProduct } = useProducts()

  return (
    <section className="admin-page admin-form-page">
      <div className="admin-page-heading"><div><p className="kicker">PRODUCT STUDIO / NUEVO DISEÑO</p><h1>Nuevo producto</h1><p>Crea un producto local y publícalo de inmediato en el catálogo.</p></div><Link className="text-button" to="/admin/productos">← Volver</Link></div>
      <ProductForm categories={categories} submitLabel="Publicar producto" onSubmit={(values) => { const result = addProduct(values); if (result.ok) navigate('/admin/productos'); return result }} />
    </section>
  )
}
