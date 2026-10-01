import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Toast from '../components/Toast'
import { changeQuoteStatus, createQuote, getQuoteByFolio, getQuoteMetrics, persistQuotes, publicQuote, readQuotes } from './quoteState'

const QuoteContext = createContext(null)
function storage() { try { return window.localStorage } catch { return null } }

export function QuoteProvider({ children }) {
  const [quotes, setQuotes] = useState(() => readQuotes(storage()))
  const current = useRef(quotes)
  const [toast, setToast] = useState(null)
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])
  function commit(result, message) {
    if (!result.ok) return result
    if (!persistQuotes(storage(), result.quotes)) return { ok: false, message: 'No se pudo guardar. El almacenamiento local está lleno o bloqueado. Conservamos tus datos para que puedas intentar de nuevo.' }
    current.current = result.quotes
    setQuotes(result.quotes)
    if (message) setToast({ id: Date.now(), message })
    return result
  }
  const value = {
    quotes,
    addQuote: (input) => {
      const local = storage()
      if (!local) return { ok: false, message: 'No se pudo guardar. El almacenamiento local está bloqueado.' }
      return commit(createQuote(current.current, input, new Date(), local))
    },
    getQuoteById: (id) => quotes.find((q) => q.id === id) ?? null,
    getQuoteByFolio: (folio) => getQuoteByFolio(quotes, folio),
    getPublicQuoteByFolio: (folio) => publicQuote(getQuoteByFolio(quotes, folio)),
    updateQuoteStatus: (id, status) => commit(changeQuoteStatus(current.current, id, status), 'Estado actualizado correctamente'),
    deleteQuote: (id) => current.current.some((q) => q.id === id) ? commit({ ok: true, quotes: current.current.filter((q) => q.id !== id) }, 'Solicitud eliminada correctamente') : { ok: false, message: 'Solicitud no encontrada.' },
    getQuoteMetrics: () => getQuoteMetrics(quotes),
  }
  return <QuoteContext.Provider value={value}>{children}<Toast toast={toast} onDismiss={() => setToast(null)} /></QuoteContext.Provider>
}
export function useQuotes() {
  const context = useContext(QuoteContext)
  if (!context) throw new Error('useQuotes debe usarse dentro de QuoteProvider')
  return context
}
