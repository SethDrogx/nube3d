import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useQuotes } from '../context/QuoteContext'
import { QUOTE_STATUSES } from '../context/quoteState'

export default function Cotizacion() {
  const { getPublicQuoteByFolio } = useQuotes()
  const [folio, setFolio] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  return <main className="quote-lookup-page"><Navbar /><section className="quote-lookup-shell">
    <header className="quote-lookup-heading"><p className="kicker">SIGUE TU IDEA · CONSULTA POR FOLIO</p><h1>Tu próxima pieza,<br /><em>cada vez más cerca.</em></h1><p>Consulta tu cotización y encuentra el estado de tu solicitud.</p></header>
    <div className="quote-lookup-grid">
      <div className="quote-lookup-entry"><span className="quote-editorial-number" aria-hidden="true">01 / CONSULTA</span><h2>Todo empieza<br />con tu folio.</h2><p>Lo recibiste al enviar tu idea. Escríbelo aquí para consultar los detalles.</p>
        <form className="quote-lookup-form" onSubmit={(e) => { e.preventDefault(); setResult(getPublicQuoteByFolio(folio)); setSearched(true) }}>
          <label htmlFor="lookup-folio">Folio de cotización</label><input id="lookup-folio" required value={folio} onChange={(e) => { setFolio(e.target.value); setSearched(false) }} placeholder="COT-20261001-0001" />
          <button className="primary-button" type="submit">Consultar <span aria-hidden="true">↗</span></button>
        </form>
      </div>
      <AnimatePresence mode="wait" initial={false}><motion.div className={`quote-result-card ${searched && result ? 'has-result' : ''}`} role="status" key={!searched ? 'initial' : result?.folio ?? 'empty'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .2 }}>
        {searched && result ? <><div className="quote-result-top"><p className="kicker">TU SOLICITUD</p><span className="quote-status">{QUOTE_STATUSES[result.estado]}</span></div><h2>{result.folio}</h2><dl><div><dt>Fecha de solicitud</dt><dd>{new Date(result.fechaCreacion).toLocaleString('es-MX')}</dd></div><div><dt>Descripción</dt><dd className="quote-result-description">{result.descripcion}</dd></div></dl><span className="quote-result-bottom" aria-hidden="true">NUBE 3D / DE LA IDEA A LA FORMA</span></> : <><span className="quote-empty-symbol" aria-hidden="true">{searched ? '—' : '↗'}</span><p className="kicker">{searched ? 'REVISA TU FOLIO' : 'UNA IDEA EN CAMINO'}</p><h2>{searched ? 'Aún no encontramos tu solicitud.' : 'Aquí comienza el seguimiento.'}</h2><p>{searched ? 'No encontramos una solicitud con ese folio.' : 'Al consultar, verás el folio, la fecha, el estado y la descripción de tu cotización.'}</p></>}
      </motion.div></AnimatePresence>
    </div>
    <p className="quote-local-note">Consulta de demostración disponible solo en el navegador donde se guardó la solicitud. La descripción resumida es pública: evita incluir datos personales en ella.</p>
    <Link className="text-button" to="/">Volver al inicio ↗</Link>
  </section><Footer /></main>
}
