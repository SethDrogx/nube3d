import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Toast from '../components/Toast'
import { CART_STORAGE_KEY, cartReducer, getCartSummary, readCart } from './cartState'
import { useProducts } from './ProductContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { products } = useProducts()
  const [items, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      return readCart(window.localStorage, products)
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState(null)
  const toastId = useRef(0)

  useEffect(() => {
    dispatch({ type: 'prune', catalog: products })
  }, [products])

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
    const product = products.find((item) => String(item.id) === String(id))
    if (!product) return
    if (product.stock === 0) {
      notify('Este producto está agotado')
      return
    }
    dispatch({ type: 'add', id, catalog: products })
    notify('Producto agregado al carrito')
  }, [notify, products])
  const removeProduct = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const increaseQuantity = useCallback((id) => dispatch({ type: 'increase', id }), [])
  const decreaseQuantity = useCallback((id) => dispatch({ type: 'decrease', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])
  const summary = useMemo(() => getCartSummary(items, products), [items, products])
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
