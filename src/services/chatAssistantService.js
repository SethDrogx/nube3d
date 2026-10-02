import { QUICK_ACTIONS, RESPONSES } from '../data/chatResponses.js'
import { QUOTE_STATUSES } from '../context/quoteState.js'

export const MAX_HISTORY = 30
export const STATES = { IDLE: 'IDLE', QUOTE: 'WAITING_FOR_QUOTE_FOLIO', SEARCH: 'WAITING_FOR_PRODUCT_SEARCH' }
export const normalizeText = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, ' ').trim()
const stopWords = new Set('quiero quisiera necesito busco buscar busca ver un una unos unas el la los las de del para por con en y mi me tu su algo cuanto cuesta cuestan vale precio precios consultar producto productos favor saber tienes tienen cual es son que hola'.split(' '))
function searchTerms(text) { return normalizeText(text).split(' ').filter((word) => word.length > 2 && !stopWords.has(word)) }

export function searchProducts(products, text) {
  const terms = searchTerms(text)
  if (!terms.length) return []
  return products.map((product, index) => {
    const searchable = normalizeText(`${product.name} ${product.category} ${product.description ?? ''}`)
    const score = terms.reduce((sum, word) => sum + Number(searchable.includes(word) || (word.endsWith('s') && searchable.includes(word.slice(0, -1)))), 0)
    return { product, score, index }
  }).filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).map(({ product }) => ({ id: product.id, name: product.name, price: product.price, status: product.stock === 0 ? 'Agotado' : 'Disponible' }))
}

export function detectIntent(text, products = []) {
  const value = normalizeText(text)
  if (/\b(eliminar|borrar|editar|actualizar|crear|cambiar)\b.*\b(productos?|roles?|estado|cotizacion)\b/.test(value)) return 'FALLBACK'
  if (/\b(cotizacion|cotizaciones|folio)\b|cot-\d{8}-\d{4}/.test(value)) return /\b(solicitar|nueva|hacer)\b/.test(value) ? 'CUSTOM' : 'QUOTE'
  if (/\b(personaliz\w*|impresion|imprimir)\b/.test(value)) return 'CUSTOM'
  if (/\b(carrito|carro)\b/.test(value)) return 'CART'
  if (/\b(pago|pagos|pagar|tarjeta|transferencia)\b/.test(value)) return 'PAYMENT'
  if (/\b(entrega|envio|tarda|tardan|demora|plazo)\b|tiempo de/.test(value)) return 'DELIVERY'
  if (/\b(persona|humano|contacto|asesor|soporte humano)\b/.test(value)) return 'CONTACT'
  if (/\b(precio|precios|cuesta|cuestan|vale)\b/.test(value)) return 'PRICES'
  if (/\b(catalogo|buscar|busco|producto|productos|soporte|audifonos|llavero|figura)\b/.test(value) || searchProducts(products, text).length) return 'SEARCH'
  return 'FALLBACK'
}

const link = (label, to) => ({ label, to })
const customLink = () => link('Solicitar cotización', '/personalizado')
const catalogLink = () => link('Ver catálogo', '/catalogo')
function reply(text, extra = {}, state = STATES.IDLE) { return { message: { role: 'bot', text, ...extra }, state } }

// Read-only dependencies: no administrative or cart mutation methods enter this service.
export function respondToMessage({ text, state = STATES.IDLE, intent, products = [], cart = {}, getPublicQuoteByFolio = () => null }) {
  if (!intent && (state === STATES.QUOTE || /^COT-\d{8}-\d{4}$/i.test(text.trim()))) {
    const quote = getPublicQuoteByFolio(text.trim())
    if (!quote) return reply(RESPONSES.missingQuote, { actions: [{ label: 'Intentar de nuevo', intent: 'QUOTE' }, link('Solicitar nueva cotización', '/personalizado')] })
    // Explicit output fields remain safe even if a future adapter returns extra data.
    return reply('Encontré tu cotización:', { quote: { folio: quote.folio, fechaCreacion: quote.fechaCreacion, estado: QUOTE_STATUSES[quote.estado] ?? quote.estado, descripcion: String(quote.descripcion).slice(0, 120) }, actions: [link('Consultar por folio', '/cotizacion')] })
  }
  const detected = intent ?? (state === STATES.SEARCH ? 'SEARCH' : detectIntent(text, products))
  switch (detected) {
    case 'SEARCH': {
      if (intent || !searchTerms(text).length) return reply(RESPONSES.search, {}, STATES.SEARCH)
      const results = searchProducts(products, text)
      return results.length ? reply('Estos productos pueden interesarte:', { products: results }) : reply(RESPONSES.missingProducts, { actions: [catalogLink()] })
    }
    case 'PRICES': {
      const results = intent ? [] : searchProducts(products, text)
      if (results.length) return reply('Estos son los precios actuales:', { products: results })
      if (!intent && searchTerms(text).length) return reply(RESPONSES.missingProducts, { actions: [catalogLink(), customLink()] })
      return reply(RESPONSES.prices, { actions: [catalogLink(), customLink()] })
    }
    case 'CUSTOM': return reply(RESPONSES.custom, { actions: [customLink()] })
    case 'QUOTE': return reply(RESPONSES.quote, { actions: [link('Consultar por folio', '/cotizacion')] }, STATES.QUOTE)
    case 'DELIVERY': return reply(RESPONSES.delivery, { actions: [customLink()] })
    case 'PAYMENT': return reply(RESPONSES.payment)
    case 'CONTACT': return reply(RESPONSES.contact, { actions: [customLink()] })
    case 'CART': return cart.totalQuantity > 0 ? reply(`Tienes ${cart.totalQuantity} productos en tu carrito.`, { cart: { quantity: cart.totalQuantity, total: cart.total }, actions: [link('Ver carrito', '/carrito')] }) : reply('Tu carrito está vacío.', { actions: [link('Explorar productos', '/catalogo')] })
    default: return reply(RESPONSES.fallback, { quickActions: QUICK_ACTIONS })
  }
}

export function initialConversation() {
  return { state: STATES.IDLE, messages: [{ id: 'greeting', role: 'bot', text: RESPONSES.greeting }] }
}
export function appendMessages(history, ...messages) { return [...history, ...messages].slice(-MAX_HISTORY) }
export function conversationReducer(current, action) {
  switch (action.type) {
    case 'reset': return initialConversation()
    case 'user': return { ...current, messages: appendMessages(current.messages, action.message) }
    case 'response': return { state: action.response.state, messages: appendMessages(current.messages, action.message) }
    default: return current
  }
}
