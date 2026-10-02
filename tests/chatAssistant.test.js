import test from 'node:test'
import assert from 'node:assert/strict'
import { detectIntent, searchProducts, respondToMessage, STATES, initialConversation, conversationReducer, appendMessages, MAX_HISTORY } from '../src/services/chatAssistantService.js'
import { createQuote, publicQuote } from '../src/context/quoteState.js'

const products = [
  { id: 1, name: 'Soporte para audífonos', price: 27.45, category: 'Escritorio', description: 'Organiza tu mesa', stock: 3 },
  { id: 2, name: 'Soporte gamer', price: 30, category: 'Gaming', description: 'Para controles', stock: 0 },
  { id: 3, name: 'Llavero zorro', price: 11, category: 'Articulados', description: 'Figura flexible', stock: 4 },
  { id: 4, name: 'Soporte de móvil', price: 17, category: 'Escritorio', description: 'Para la mesa', stock: 5 },
  { id: 5, name: 'Soporte extra', price: 22, category: 'Hogar', description: 'Multiuso', stock: 1 },
]
const ask = (text, extra = {}) => respondToMessage({ text, products, ...extra })

test('detecta intents de texto libre con acentos y mayúsculas', () => {
  for (const [text, intent] of [['quiero un soporte para audífonos', 'SEARCH'], ['quiero algo personalizado', 'CUSTOM'], ['cuánto tarda', 'DELIVERY'], ['dónde está mi cotización', 'QUOTE'], ['quiero ver mi carrito', 'CART'], ['métodos de pago', 'PAYMENT'], ['hablar con una persona', 'CONTACT'], ['consultar precios', 'PRICES'], ['astronomía', 'FALLBACK']]) assert.equal(detectIntent(text, products), intent)
})
test('busca en nombre, categoría y descripción, prioriza coincidencias y limita a tres', () => {
  assert.equal(searchProducts(products, 'quiero un soporte para audifonos')[0].id, 1)
  assert.equal(searchProducts(products, 'gaming')[0].id, 2)
  assert.equal(searchProducts(products, 'flexible')[0].id, 3)
  assert.equal(searchProducts(products, 'soporte').length, 3)
  assert.deepEqual(searchProducts(products, 'un para el'), [])
})
test('búsqueda sin resultados ofrece catálogo y estado de búsqueda consume el siguiente mensaje', () => {
  const prompt = ask('Buscar un producto', { intent: 'SEARCH' })
  assert.equal(prompt.state, STATES.SEARCH)
  const result = ask('objeto inexistente', { state: prompt.state })
  assert.match(result.message.text, /No encontré productos/)
  assert.deepEqual(result.message.actions, [{ label: 'Ver catálogo', to: '/catalogo' }])
  assert.equal(result.state, STATES.IDLE)
})
test('precios provienen del catálogo vigente y agotados no ofrecen agregar al carrito', () => {
  assert.equal(ask('cuánto cuesta soporte audífonos').message.products[0].price, 27.45)
  assert.equal(ask('precio soporte audífonos', { products: [{ ...products[0], price: 99 }] }).message.products[0].price, 99)
  const result = ask('gaming')
  assert.equal(result.message.products[0].status, 'Agotado')
  assert.ok(!JSON.stringify(result).includes('Agregar'))
  assert.equal(ask('Consultar precios', { intent: 'PRICES' }).message.actions.length, 2)
})
test('flujo de folio usa solo la consulta pública e imprime cuatro campos', () => {
  const { quote } = createQuote([], { nombre: 'Privado', email: 'privado@example.com', telefono: '5551234567', descripcion: 'Proyecto', cantidad: 1, comentarios: 'interno', imagen: '' })
  const prompt = ask('Consultar mi cotización', { intent: 'QUOTE' })
  assert.equal(prompt.state, STATES.QUOTE)
  let called
  const result = ask(quote.folio, { state: prompt.state, getPublicQuoteByFolio: (folio) => { called = folio; return publicQuote(quote) } })
  assert.equal(called, quote.folio)
  assert.equal(result.message.quote.folio, quote.folio)
  assert.equal(result.message.quote.estado, 'Nueva')
  assert.deepEqual(Object.keys(result.message.quote).sort(), ['descripcion', 'estado', 'fechaCreacion', 'folio'])
  assert.ok(!JSON.stringify(result).includes(quote.email))
  assert.ok(!JSON.stringify(result).includes(quote.nombre))
  assert.ok(!JSON.stringify(result).includes(quote.telefono))
  const defensive = ask(quote.folio, { getPublicQuoteByFolio: () => quote })
  assert.ok(!JSON.stringify(defensive).includes('privado@example.com'))
})
test('folio inexistente ofrece reintento y nueva cotización', () => {
  const result = ask('COT-20261001-9999', { state: STATES.QUOTE })
  assert.match(result.message.text, /No encontré una cotización/)
  assert.equal(result.message.actions[0].intent, 'QUOTE')
  assert.equal(result.message.actions[1].to, '/personalizado')
})
test('carrito vacío y con productos utiliza cantidades y total reales', () => {
  const empty = ask('ver mi carrito', { cart: { totalQuantity: 0, total: 0 } })
  assert.equal(empty.message.text, 'Tu carrito está vacío.')
  assert.equal(empty.message.actions[0].to, '/catalogo')
  const full = ask('ver mi carrito', { cart: { totalQuantity: 4, total: 127.8 } })
  assert.equal(full.message.text, 'Tienes 4 productos en tu carrito.')
  assert.deepEqual(full.message.cart, { quantity: 4, total: 127.8 })
  assert.equal(full.message.actions[0].to, '/carrito')
})
test('fallback honesto, sin capacidades administrativas', () => {
  assert.match(ask('astronomía').message.text, /No estoy seguro/)
  assert.equal(ask('astronomía').message.quickActions.length, 8)
  for (const text of ['eliminar producto soporte', 'editar cotizacion', 'cambiar roles']) assert.equal(detectIntent(text, products), 'FALLBACK')
})
test('opciones rápidas reemplazan un flujo pendiente y solo enlazan a rutas públicas', () => {
  for (const intent of ['CUSTOM', 'PRICES', 'DELIVERY', 'PAYMENT', 'CART', 'CONTACT']) {
    const result = ask('opción', { intent, state: STATES.QUOTE })
    assert.equal(result.state, STATES.IDLE)
    for (const action of result.message.actions ?? []) assert.ok(!action.to?.startsWith('/admin'))
  }
  assert.match(ask('Métodos de pago', { intent: 'PAYMENT' }).message.text, /todavía no está habilitado/)
  assert.match(ask('Tiempo de entrega', { intent: 'DELIVERY' }).message.text, /no una garantía/)
})
test('reinicio limpia historial y estado sin modificar datos externos', () => {
  const external = { cart: [1], quotes: [2], products: [3] }, snapshot = structuredClone(external)
  const current = { state: STATES.QUOTE, messages: [{ role: 'user', text: 'folio' }] }
  assert.deepEqual(conversationReducer(current, { type: 'reset' }), initialConversation())
  assert.deepEqual(external, snapshot)
  assert.equal(current.state, STATES.QUOTE)
})
test('historial queda limitado a los últimos treinta mensajes', () => {
  const history = Array.from({ length: 50 }, (_, id) => ({ id, role: 'user', text: `Mensaje ${id}` }))
  const result = appendMessages([], ...history)
  assert.equal(result.length, MAX_HISTORY)
  assert.equal(result[0].id, 20)
  const next = conversationReducer({ state: STATES.IDLE, messages: result }, { type: 'user', message: { id: 50, role: 'user', text: 'nuevo' } })
  assert.equal(next.messages.length, 30)
  assert.equal(next.messages.at(-1).id, 50)
})
