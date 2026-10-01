import { isValidImageSource } from '../utils/imageUpload.js'

export const QUOTE_STORAGE_KEY = 'nube3d_quotes'
export const QUOTE_SEQUENCE_STORAGE_KEY = 'nube3d_quote_sequence'
export const QUOTE_STATUSES = { NUEVA: 'Nueva', EN_REVISION: 'En revisión', COTIZADA: 'Cotizada', ACEPTADA: 'Aceptada', RECHAZADA: 'Rechazada' }
export const EMPTY_QUOTE = { nombre: '', email: '', telefono: '', descripcion: '', medidas: '', color: '', cantidad: 1, imagen: '', comentarios: '' }

export function validateQuote(input = {}) {
  const errors = {}
  if (!String(input.nombre ?? '').trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email ?? '').trim())) errors.email = 'Ingresa un correo electrónico válido.'
  if (!String(input.descripcion ?? '').trim()) errors.descripcion = 'La descripción es obligatoria.'
  if (!Number.isSafeInteger(Number(input.cantidad)) || Number(input.cantidad) < 1) errors.cantidad = 'La cantidad debe ser un entero mayor o igual a 1.'
  const phone = String(input.telefono ?? '').trim()
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15)) errors.telefono = 'Ingresa un teléfono válido de 7 a 15 dígitos.'
  const image = String(input.imagen ?? '').trim()
  if (!isValidImageSource(image) || image.length > 400000) errors.imagen = 'Usa una imagen válida y optimizada.'
  return errors
}

// Keep a high-water mark per date, including dates from existing legacy quotes.
// Invalid sequence data must fail closed rather than restart numbering.
function readQuoteSequences(storage, quotes) {
  const raw = storage.getItem(QUOTE_SEQUENCE_STORAGE_KEY)
  const sequences = raw === null ? {} : JSON.parse(raw)
  if (!sequences || typeof sequences !== 'object' || Array.isArray(sequences) || Object.entries(sequences).some(([day, value]) => !/^\d{8}$/.test(day) || !Number.isSafeInteger(value) || value < 0)) throw new Error('Secuencia de folios inválida.')
  for (const quote of [...readQuotes(storage), ...quotes]) {
    const match = /^COT-(\d{8})-(\d{4,})$/.exec(quote.folio)
    if (match) {
      const value = Number(match[2])
      if (!Number.isSafeInteger(value)) throw new Error('Secuencia de folios inválida.')
      sequences[match[1]] = Math.max(sequences[match[1]] ?? 0, value)
    }
  }
  return sequences
}

export function createQuote(quotes, input, now = new Date(), storage) {
  const errors = validateQuote(input)
  if (Object.keys(errors).length) return { ok: false, errors }
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  let sequence
  try {
    const sequences = readQuoteSequences(storage ?? { getItem: () => null }, quotes)
    sequence = (sequences[day] ?? 0) + 1
    if (sequence > 9999) return { ok: false, message: 'Se agotaron los folios disponibles para esta fecha.' }
    // Reserve before saving the quote. A failed save can leave a gap, never reuse.
    if (storage) storage.setItem(QUOTE_SEQUENCE_STORAGE_KEY, JSON.stringify({ ...sequences, [day]: sequence }))
  } catch {
    return { ok: false, message: 'No se pudo reservar un folio. Revisa el almacenamiento local antes de intentar de nuevo.' }
  }
  const folio = `COT-${day}-${String(sequence).padStart(4, '0')}`
  const quote = { id: globalThis.crypto.randomUUID(), folio, fechaCreacion: now.toISOString(), estado: 'NUEVA' }
  for (const key of Object.keys(EMPTY_QUOTE)) quote[key] = key === 'cantidad' ? Number(input[key]) : String(input[key] ?? '').trim()
  return { ok: true, quote, quotes: [...quotes, quote] }
}

export function getQuoteByFolio(quotes, folio) {
  return quotes.find((quote) => quote.folio === String(folio).trim().toUpperCase()) ?? null
}

export function changeQuoteStatus(quotes, id, estado) {
  if (!Object.hasOwn(QUOTE_STATUSES, estado) || !quotes.some((quote) => quote.id === id)) return { ok: false, message: 'La solicitud o el estado no es válido.' }
  return { ok: true, quotes: quotes.map((quote) => quote.id === id ? { ...quote, estado } : quote) }
}

export function getQuoteMetrics(quotes) {
  return { total: quotes.length, nuevas: quotes.filter((q) => q.estado === 'NUEVA').length, enRevision: quotes.filter((q) => q.estado === 'EN_REVISION').length }
}

export function publicQuote(quote) {
  if (!quote) return null
  return { folio: quote.folio, fechaCreacion: quote.fechaCreacion, estado: quote.estado, descripcion: quote.descripcion.slice(0, 120) }
}

export function persistQuotes(storage, quotes) {
  try {
    // Migrate/reserve legacy folios before deletion or any replacement of the list.
    const sequences = readQuoteSequences(storage, quotes)
    storage.setItem(QUOTE_SEQUENCE_STORAGE_KEY, JSON.stringify(sequences))
    storage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quotes))
    return true
  } catch { return false }
}

export function readQuotes(storage) {
  try {
    const quotes = JSON.parse(storage.getItem(QUOTE_STORAGE_KEY) ?? '[]')
    if (!Array.isArray(quotes)) return []
    const ids = new Set(), folios = new Set()
    return quotes.filter((q) => {
      if (!q || typeof q.id !== 'string' || typeof q.folio !== 'string' || Object.keys(EMPTY_QUOTE).some((key) => key !== 'cantidad' && typeof q[key] !== 'string') || !/^COT-\d{8}-\d{4,}$/.test(q.folio) || !Number.isFinite(Date.parse(q.fechaCreacion)) || !Object.hasOwn(QUOTE_STATUSES, q.estado) || Object.keys(validateQuote(q)).length || ids.has(q.id) || folios.has(q.folio)) return false
      ids.add(q.id); folios.add(q.folio); return true
    })
  } catch { return [] }
}
