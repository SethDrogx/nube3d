import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import { useQuotes } from '../../context/QuoteContext'
import AdminStatCard from '../../components/admin/AdminStatCard'
import ConfirmModal from '../../components/admin/ConfirmModal'

export default function AdminDashboard() {
  const { metrics, restoreDemoCatalog, products } = useProducts()
  const quoteMetrics = useQuotes().getQuoteMetrics()
  const [resetOpen, setResetOpen] = useState(false)
  const closeReset = useCallback(() => setResetOpen(false), [])

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div><p className="kicker">NUBE 3D · CONTROL</p><h1>Panel de administración</h1><p>Gestiona el catálogo local de demostración sin tocar la experiencia pública.</p></div>
        <Link className="primary-button" to="/admin/productos/nuevo">Nuevo producto <span>↗</span></Link>
      </div>
      <div className="admin-stat-grid">
        <AdminStatCard label="Total de productos" value={metrics.totalProducts} detail="En el catálogo actual" />
        <AdminStatCard label="Disponibles" value={metrics.availableProducts} detail="Con stock mayor a 0" />
        <AdminStatCard label="Agotados" value={metrics.outOfStockProducts} detail="Requieren reposición" />
        <AdminStatCard label="Categorías" value={metrics.totalCategories} detail="Organización del catálogo" />
      </div>
      <motion.div className="admin-dashboard-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <article className="admin-panel-card"><h2>Cotizaciones</h2><div className="admin-stat-grid quote-stat-grid"><AdminStatCard label="Cotizaciones totales" value={quoteMetrics.total} detail="Solicitudes locales" /><AdminStatCard label="Nuevas" value={quoteMetrics.nuevas} detail="Pendientes de revisar" /><AdminStatCard label="En revisión" value={quoteMetrics.enRevision} detail="En seguimiento" /></div><Link to="/admin/cotizaciones">Gestionar cotizaciones ↗</Link></article>
        <article className="admin-panel-card">
          <p className="kicker">ACCESOS RÁPIDOS</p>
          <h2>Catálogo</h2>
          <p>Edita productos, existencias, precios e imágenes. Los cambios se reflejan de inmediato en la tienda.</p>
          <div className="admin-card-links"><Link to="/admin/productos">Gestionar productos ↗</Link><Link to="/admin/categorias">Gestionar categorías ↗</Link></div>
        </article>
        <article className="admin-panel-card admin-reset-card">
          <p className="kicker">DESARROLLO LOCAL</p>
          <h2>Restaurar catálogo demo</h2>
          <p>Descarta los cambios locales y vuelve a los {products.length ? 'datos originales incluidos con el proyecto' : 'datos originales del proyecto'}.</p>
          <button className="admin-secondary-button" type="button" onClick={() => setResetOpen(true)}>Restaurar datos</button>
        </article>
      </motion.div>
      <ConfirmModal open={resetOpen} title="¿Restaurar el catálogo de demostración?" message="Se reemplazarán los productos y categorías guardados localmente por los datos originales del proyecto." confirmLabel="Restaurar catálogo" danger onCancel={closeReset} onConfirm={() => { restoreDemoCatalog(); setResetOpen(false) }} />
    </section>
  )
}
