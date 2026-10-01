import test from 'node:test'
import assert from 'node:assert/strict'
import { QUOTE_STORAGE_KEY, QUOTE_SEQUENCE_STORAGE_KEY, createQuote, validateQuote, getQuoteByFolio, changeQuoteStatus, getQuoteMetrics, publicQuote, persistQuotes, readQuotes } from '../src/context/quoteState.js'
import { demoCatalog, persistProducts, persistCategories } from '../src/context/productState.js'

const input = { nombre: ' Ana ', email: 'ana@example.com', descripcion: 'Una maceta personalizada', cantidad: 2, telefono: '+52 555 123 4567', comentarios: 'privado' }
function storage() { const data = new Map(); return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) } }
test('crea solicitud completa, normalizada y nueva sin mutar la lista', () => {
  const original = []
  const result = createQuote(original, input)
  assert.equal(result.ok, true); assert.equal(original.length, 0)
  assert.equal(result.quote.nombre, 'Ana'); assert.equal(result.quote.estado, 'NUEVA')
  assert.equal(result.quote.cantidad, 2); assert.ok(result.quote.id)
  for (const field of ['folio', 'fechaCreacion', 'medidas', 'color', 'imagen', 'comentarios']) assert.ok(Object.hasOwn(result.quote, field))
})
test('valida obligatorios, correo, teléfono, cantidad e imagen', () => {
  assert.deepEqual(validateQuote(input), {})
  for (const changes of [{ nombre: ' ' }, { email: 'a@' }, { descripcion: '' }, { cantidad: 0 }, { cantidad: 1.5 }, { cantidad: '' }, { cantidad: Infinity }, { telefono: 'abc' }, { telefono: '123' }, { imagen: 'javascript:evil' }, { imagen: 'data:image/png;base64,' + 'A'.repeat(400001) }]) assert.equal(createQuote([], { ...input, ...changes }).ok, false)
})
test('folios legibles únicos incluso con la misma fecha', () => {
  let quotes = []
  for (let i = 0; i < 100; i++) quotes = createQuote(quotes, input, new Date(2026, 9, 1)).quotes
  assert.equal(new Set(quotes.map((q) => q.folio)).size, 100)
  assert.equal(quotes[0].folio, 'COT-20261001-0001')
})
test('persiste y restaura; tolera datos corruptos y almacenamiento bloqueado', () => {
  const local = storage(), quotes = createQuote([], input).quotes
  assert.equal(persistQuotes(local, quotes), true); assert.deepEqual(readQuotes(local), quotes)
  local.setItem(QUOTE_STORAGE_KEY, 'invalid'); assert.deepEqual(readQuotes(local), [])
  local.setItem(QUOTE_STORAGE_KEY, JSON.stringify([{}, null, ...quotes, ...quotes])); assert.deepEqual(readQuotes(local), quotes)
  assert.equal(persistQuotes(null, quotes), false); assert.deepEqual(readQuotes(null), [])
})
test('busca folio normalizado y maneja inexistentes', () => {
  const { quotes, quote } = createQuote([], input)
  assert.equal(getQuoteByFolio(quotes, ` ${quote.folio.toLowerCase()} `), quote)
  assert.equal(getQuoteByFolio(quotes, 'missing'), null)
})
test('cambia estado y lo conserva al recargar; rechaza estados e IDs inválidos', () => {
  const { quotes, quote } = createQuote([], input), local = storage()
  const result = changeQuoteStatus(quotes, quote.id, 'COTIZADA')
  assert.equal(result.ok, true); assert.equal(quotes[0].estado, 'NUEVA')
  persistQuotes(local, result.quotes); assert.equal(readQuotes(local)[0].estado, 'COTIZADA')
  assert.equal(changeQuoteStatus(quotes, quote.id, 'UNKNOWN').ok, false)
  assert.equal(changeQuoteStatus(quotes, 'missing', 'NUEVA').ok, false)
})
test('métricas reales según estados', () => {
  const { quotes, quote } = createQuote([], input)
  assert.deepEqual(getQuoteMetrics([]), { total: 0, nuevas: 0, enRevision: 0 })
  assert.deepEqual(getQuoteMetrics(quotes), { total: 1, nuevas: 1, enRevision: 0 })
  assert.deepEqual(getQuoteMetrics(changeQuoteStatus(quotes, quote.id, 'EN_REVISION').quotes), { total: 1, nuevas: 0, enRevision: 1 })
})
test('consulta pública expone solo campos permitidos y limita descripción', () => {
  const { quote } = createQuote([], { ...input, descripcion: 'x'.repeat(200) })
  const result = publicQuote(quote)
  assert.deepEqual(Object.keys(result).sort(), ['descripcion', 'estado', 'fechaCreacion', 'folio'])
  assert.equal(result.descripcion.length, 120); assert.equal(publicQuote(null), null)
  assert.ok(!JSON.stringify(result).includes(input.email)); assert.ok(!JSON.stringify(result).includes(input.telefono))
})
test('restaurar productos demo conserva cotizaciones', () => {
  const local = storage(), quotes = createQuote([], input).quotes
  persistQuotes(local, quotes)
  const demo = demoCatalog(); persistProducts(local, demo.products); persistCategories(local, demo.categories)
  assert.deepEqual(readQuotes(local), quotes)
})

test('crear, eliminar y recargar nunca reutiliza el folio eliminado', () => {
  const local = storage(), now = new Date(2026, 9, 1)
  const first = createQuote([], input, now, local)
  assert.equal(persistQuotes(local, first.quotes), true)
  assert.equal(persistQuotes(local, first.quotes.filter((q) => q.id !== first.quote.id)), true)
  const second = createQuote(readQuotes(local), input, now, local)
  assert.equal(second.ok, true)
  assert.notEqual(second.quote.folio, first.quote.folio)
  assert.equal(second.quote.folio, 'COT-20261001-0002')
  assert.equal(persistQuotes(local, second.quotes), true)
  assert.equal(createQuote(readQuotes(local), input, now, local).quote.folio, 'COT-20261001-0003')
})

test('migra folios existentes antes de eliminarlos sin modificar sus datos', () => {
  const local = storage(), now = new Date(2026, 9, 1)
  const existing = { ...createQuote([], input, now).quote, folio: 'COT-20261001-0042' }
  local.setItem(QUOTE_STORAGE_KEY, JSON.stringify([existing]))
  assert.equal(persistQuotes(local, []), true)
  assert.equal(createQuote(readQuotes(local), input, now, local).quote.folio, 'COT-20261001-0043')
  const another = storage()
  another.setItem(QUOTE_STORAGE_KEY, JSON.stringify([existing]))
  const created = createQuote(readQuotes(another), input, now, another)
  assert.deepEqual(created.quotes[0], existing)
  assert.equal(created.quote.folio, 'COT-20261001-0043')
})

test('la reserva persiste aunque falle guardar la solicitud; no reinicia datos corruptos', () => {
  const local = storage(), now = new Date(2026, 9, 1)
  const failing = { getItem: local.getItem, setItem: (key, value) => { if (key === QUOTE_STORAGE_KEY) throw new Error('quota'); local.setItem(key, value) } }
  const first = createQuote([], input, now, failing)
  assert.equal(persistQuotes(failing, first.quotes), false)
  assert.equal(createQuote([], input, now, local).quote.folio, 'COT-20261001-0002')
  local.setItem(QUOTE_SEQUENCE_STORAGE_KEY, 'corrupt')
  assert.equal(createQuote([], input, now, local).ok, false)
  assert.equal(persistQuotes(local, []), false)
  assert.equal(local.getItem(QUOTE_SEQUENCE_STORAGE_KEY), 'corrupt')
})

test('secuencia por fecha conserva historial al cambiar o retroceder el día', () => {
  const local = storage()
  assert.equal(createQuote([], input, new Date(2026, 9, 1), local).quote.folio, 'COT-20261001-0001')
  assert.equal(createQuote([], input, new Date(2026, 9, 2), local).quote.folio, 'COT-20261002-0001')
  assert.equal(createQuote([], input, new Date(2026, 9, 1), local).quote.folio, 'COT-20261001-0002')
  local.setItem(QUOTE_SEQUENCE_STORAGE_KEY, JSON.stringify({ '20261001': 9999 }))
  assert.equal(createQuote([], input, new Date(2026, 9, 1), local).ok, false)
})
