import { products as seedProducts } from '../data/products.js'

export const CART_STORAGE_KEY = 'nube3d.cart.v1'

const catalogHas = (catalog, id) => catalog.some((product) => String(product.id) === String(id))

// Persist only references; the current runtime catalog remains the source for product details.
export function normalizeCart(value, catalog = seedProducts) {
  if (!Array.isArray(value)) return []

  return value.reduce((items, entry) => {
    if (!entry || !catalogHas(catalog, entry.id) || !Number.isSafeInteger(entry.quantity) || entry.quantity < 1) return items
    const existing = items.find((item) => String(item.id) === String(entry.id))
    if (existing) {
      if (Number.isSafeInteger(existing.quantity + entry.quantity)) existing.quantity += entry.quantity
    } else {
      items.push({ id: entry.id, quantity: entry.quantity })
    }
    return items
  }, [])
}

export function readCart(storage, catalog = seedProducts) {
  try {
    return normalizeCart(JSON.parse(storage.getItem(CART_STORAGE_KEY)), catalog)
  } catch {
    return []
  }
}

export function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const catalog = action.catalog ?? seedProducts
      if (!catalogHas(catalog, action.id)) return items
      return items.some((item) => String(item.id) === String(action.id))
        ? cartReducer(items, { type: 'increase', id: action.id })
        : [...items, { id: action.id, quantity: 1 }]
    }
    case 'increase':
      return items.map((item) => String(item.id) === String(action.id) && Number.isSafeInteger(item.quantity + 1)
        ? { ...item, quantity: item.quantity + 1 } : item)
    case 'decrease':
      return items.map((item) => String(item.id) === String(action.id)
        ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)
    case 'remove':
      return items.filter((item) => String(item.id) !== String(action.id))
    case 'prune': {
      const catalog = action.catalog ?? seedProducts
      return items.filter((item) => catalogHas(catalog, item.id))
    }
    case 'clear':
      return []
    default:
      return items
  }
}

export function getCartSummary(items, catalog = seedProducts) {
  const lookup = new Map(catalog.map((product) => [String(product.id), product]))
  const cartItems = items.flatMap((item) => {
    const product = lookup.get(String(item.id))
    return product ? [{ ...product, quantity: item.quantity }] : []
  })
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100
  const shipping = 0
  return { cartItems, totalQuantity, subtotal, shipping, total: subtotal + shipping }
}
