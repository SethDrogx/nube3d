import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Toast from '../components/Toast'
import { products } from '../data/products'
import { CART_STORAGE_KEY, cartReducer, getCartSummary, readCart } from './cartState'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      return readCart(window.localStorage)
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState(null)
  const toastId = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // The cart still works in memory when browser storage is unavailable.
    }
  }, [items])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify = useCallback((message) => {
    setToast({ id: ++toastId.current, message })
  }, [])
  const dismissToast = useCallback(() => setToast(null), [])
  const addProduct = useCallback((id) => {
    if (!products.some((product) => product.id === id)) return
    dispatch({ type: 'add', id })
    notify('Producto agregado al carrito')
  }, [notify])
  const removeProduct = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const increaseQuantity = useCallback((id) => dispatch({ type: 'increase', id }), [])
  const decreaseQuantity = useCallback((id) => dispatch({ type: 'decrease', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])
  const summary = useMemo(() => getCartSummary(items), [items])
  const value = useMemo(() => ({
    ...summary, addProduct, removeProduct, increaseQuantity, decreaseQuantity, clearCart, notify,
  }), [summary, addProduct, removeProduct, increaseQuantity, decreaseQuantity, clearCart, notify])

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast toast={toast} onDismiss={dismissToast} />
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
