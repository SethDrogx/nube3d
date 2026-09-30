import { products } from '../data/products.js'

export const CART_STORAGE_KEY = 'nube3d.cart.v1'

const isProduct = (id) => products.some((product) => product.id === id)

// Persist only references; the catalog remains the source for product details.
export function normalizeCart(value) {
  if (!Array.isArray(value)) return []

  return value.reduce((items, entry) => {
    if (!entry || !isProduct(entry.id) || !Number.isSafeInteger(entry.quantity) || entry.quantity < 1) return items
    const existing = items.find((item) => item.id === entry.id)
    if (existing) {
      if (Number.isSafeInteger(existing.quantity + entry.quantity)) existing.quantity += entry.quantity
    } else {
      items.push({ id: entry.id, quantity: entry.quantity })
    }
    return items
  }, [])
}

export function readCart(storage) {
  try {
    return normalizeCart(JSON.parse(storage.getItem(CART_STORAGE_KEY)))
  } catch {
    return []
  }
}

export function cartReducer(items, action) {
  switch (action.type) {
    case 'add':
      if (!isProduct(action.id)) return items
      return items.some((item) => item.id === action.id)
        ? cartReducer(items, { type: 'increase', id: action.id })
        : [...items, { id: action.id, quantity: 1 }]
    case 'increase':
      return items.map((item) => item.id === action.id && Number.isSafeInteger(item.quantity + 1)
        ? { ...item, quantity: item.quantity + 1 } : item)
    case 'decrease':
      return items.map((item) => item.id === action.id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)
    case 'remove':
      return items.filter((item) => item.id !== action.id)
    case 'clear':
      return []
    default:
      return items
  }
}

export function getCartSummary(items) {
  const cartItems = items.map((item) => ({
    ...products.find((product) => product.id === item.id),
    quantity: item.quantity,
  }))
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  // Calculate in cents to avoid decimal rounding artifacts.
  const subtotal = cartItems.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100
  const shipping = 0
  return { cartItems, totalQuantity, subtotal, shipping, total: subtotal + shipping }
}
