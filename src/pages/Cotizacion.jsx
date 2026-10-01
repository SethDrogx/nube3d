import { useState } from 'react'
import { motion } from 'motion/react'
import RouteShell from './RouteShell'
import { useQuotes } from '../context/QuoteContext'
import { QUOTE_STATUSES } from '../context/quoteState'

export default function Cotizacion() {
  const { getPublicQuoteByFolio } = useQuotes()
  const [folio, setFolio] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  return <RouteShell kicker="SIGUE TU IDEA" title="Consulta tu cotización">
    <form className="admin-product-form" onSubmit={(e) => { e.preventDefault(); setResult(getPublicQuoteByFolio(folio)); setSearched(true) }}>
      <label>Folio<input required value={folio} onChange={(e) => { setFolio(e.target.value); setSearched(false) }} placeholder="COT-20261001-0001" /></label><button className="primary-button" type="submit">Consultar ↗</button>
    </form>
    {searched && <motion.div className="admin-panel-card" role="status" key={result?.folio ?? 'empty'} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{result ? <><h2>{result.folio}</h2><p>Fecha: {new Date(result.fechaCreacion).toLocaleString('es-MX')}</p><p>Estado: {QUOTE_STATUSES[result.estado]}</p><p>{result.descripcion}</p></> : <p>No encontramos una solicitud con ese folio.</p>}</motion.div>}
    <p className="quote-local-note">Consulta de demostración disponible solo en el navegador donde se guardó la solicitud. La descripción resumida es pública: evita incluir datos personales en ella.</p>
  </RouteShell>
}
