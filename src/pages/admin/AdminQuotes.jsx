import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useQuotes } from '../../context/QuoteContext'
import { QUOTE_STATUSES } from '../../context/quoteState'

export default function AdminQuotes() {
  const { quotes } = useQuotes()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const filtered = quotes.filter((q) => (!status || q.estado === status) && [q.folio, q.nombre, q.email].some((v) => v.toLowerCase().includes(search.trim().toLowerCase()))).slice().reverse()
  return <section className="admin-page"><div className="admin-page-heading"><div><p className="kicker">NUBE 3D · COTIZACIONES</p><h1>Cotizaciones</h1><p>Consulta las ideas de tus clientes y actualiza su estado.</p></div></div>
    <div className="quote-filters"><label>Buscar por folio, nombre o correo<input value={search} onChange={(e) => setSearch(e.target.value)} /></label><label>Estado<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos</option>{Object.entries(QUOTE_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
    <div className="quote-list">{filtered.length ? filtered.map((q) => <motion.article className="admin-panel-card quote-row" key={q.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><div><h2>{q.folio}</h2><p>{new Date(q.fechaCreacion).toLocaleString('es-MX')}</p><strong>{q.nombre}</strong></div><p>{q.descripcion.slice(0, 120)}</p><div><p>Cantidad: {q.cantidad}</p><span className="quote-status">{QUOTE_STATUSES[q.estado]}</span></div><Link to={`/admin/cotizaciones/${q.id}`}>Ver ↗</Link></motion.article>) : <motion.p className="admin-panel-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{quotes.length ? 'No encontramos cotizaciones con estos filtros.' : 'No hay solicitudes de cotización todavía.'}</motion.p>}</div>
  </section>
}
