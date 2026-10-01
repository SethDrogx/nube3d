import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useQuotes } from '../../context/QuoteContext'
import { QUOTE_STATUSES } from '../../context/quoteState'

export default function AdminQuoteDetail() {
  const { id } = useParams()
  const { getQuoteById, updateQuoteStatus } = useQuotes()
  const quote = getQuoteById(id)
  const [error, setError] = useState('')
  if (!quote) return <section className="admin-page"><h1>Solicitud no encontrada</h1><Link to="/admin/cotizaciones">Volver a cotizaciones</Link></section>
  return <section className="admin-page"><div className="admin-page-heading"><div><p className="kicker">SOLICITUD PERSONALIZADA</p><h1>{quote.folio}</h1><p>{new Date(quote.fechaCreacion).toLocaleString('es-MX')}</p></div><Link to="/admin/cotizaciones">Volver a cotizaciones ↗</Link></div>
    <article className="admin-panel-card"><dl className="quote-detail">{[['nombre', 'Nombre'], ['email', 'Correo'], ['telefono', 'Teléfono'], ['descripcion', 'Descripción'], ['medidas', 'Medidas'], ['color', 'Color'], ['cantidad', 'Cantidad'], ['comentarios', 'Comentarios']].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{quote[key] || 'No proporcionado'}</dd></div>)}</dl>
      {quote.imagen && <div className="admin-image-preview"><span>Imagen de referencia</span><img src={quote.imagen} alt="Referencia del proyecto" /></div>}
      <label htmlFor="quote-status">Estado</label><select id="quote-status" value={quote.estado} onChange={(e) => { const result = updateQuoteStatus(id, e.target.value); setError(result.ok ? '' : result.message) }}>{Object.entries(QUOTE_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
      <motion.p key={quote.estado} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="quote-status">{QUOTE_STATUSES[quote.estado]}</motion.p>{error && <p role="alert" className="admin-form-error">{error}</p>}
    </article>
  </section>
}
