import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Toast from '../components/Toast'
import {
  addCategoryToCatalog,
  addProductToCatalog,
  deleteCategoryFromCatalog,
  deleteProductFromCatalog,
  demoCatalog,
  ensureProductCategories,
  getCatalogMetrics,
  persistCategories,
  persistProducts,
  readCategories,
  readProducts,
  renameCategoryInCatalog,
  updateProductInCatalog,
} from './productState'

const ProductContext = createContext(null)

function browserStorage() {
  try { return window.localStorage } catch { return null }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readProducts(browserStorage()))
  const [categories, setCategories] = useState(() => {
    const productList = readProducts(browserStorage())
    return readCategories(browserStorage(), productList)
  })
  const [toast, setToast] = useState(null)
  const toastId = useRef(0)

  useEffect(() => { persistProducts(browserStorage(), products) }, [products])
  useEffect(() => { persistCategories(browserStorage(), categories) }, [categories])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify = useCallback((message) => setToast({ id: ++toastId.current, message }), [])
  const dismissToast = useCallback(() => setToast(null), [])

  const addProduct = useCallback((input) => {
    const response = addProductToCatalog(products, input)
    if (response.ok) {
      setProducts(response.products)
      setCategories((current) => ensureProductCategories(current, response.products))
      notify('Producto creado correctamente')
    }
    return response
  }, [products, notify])

  const updateProduct = useCallback((id, changes) => {
    const response = updateProductInCatalog(products, id, changes)
    if (response.ok) {
      setProducts(response.products)
      setCategories((current) => ensureProductCategories(current, response.products))
      notify('Producto actualizado correctamente')
    }
    return response
  }, [products, notify])

  const deleteProduct = useCallback((id) => {
    const response = deleteProductFromCatalog(products, id)
    if (response.ok) {
      setProducts(response.products)
      notify('Producto eliminado correctamente')
    }
    return response
  }, [products, notify])

  const addCategory = useCallback((name) => {
    const response = addCategoryToCatalog(categories, name)
    if (response.ok) {
      setCategories(response.categories)
      notify('Categoría creada correctamente')
    }
    return response
  }, [categories, notify])

  const renameCategory = useCallback((oldName, newName) => {
    const response = renameCategoryInCatalog(categories, products, oldName, newName)
    if (response.ok) {
      setCategories(response.categories)
      setProducts(response.products)
      notify('Categoría actualizada correctamente')
    }
    return response
  }, [categories, products, notify])

  const deleteCategory = useCallback((name) => {
    const response = deleteCategoryFromCatalog(categories, products, name)
    if (response.ok) {
      setCategories(response.categories)
      notify('Categoría eliminada correctamente')
    }
    return response
  }, [categories, products, notify])

  const restoreDemoCatalog = useCallback(() => {
    const demo = demoCatalog()
    setProducts(demo.products)
    setCategories(demo.categories)
    notify('Catálogo de demostración restaurado')
    return demo
  }, [notify])

  const getProductById = useCallback((id) => products.find((product) => String(product.id) === String(id)) ?? null, [products])
  const metrics = useMemo(() => getCatalogMetrics(products, categories), [products, categories])

  const value = useMemo(() => ({
    products,
    categories,
    metrics,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    renameCategory,
    deleteCategory,
    restoreDemoCatalog,
    notify,
  }), [products, categories, metrics, getProductById, addProduct, updateProduct, deleteProduct, addCategory, renameCategory, deleteCategory, restoreDemoCatalog, notify])

  return (
    <ProductContext.Provider value={value}>
      {children}
      <Toast toast={toast} onDismiss={dismissToast} />
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts debe usarse dentro de ProductProvider')
  return context
}
