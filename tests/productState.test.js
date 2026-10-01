import test from 'node:test'
import assert from 'node:assert/strict'
import { categories as seedCategories, products as seedProducts } from '../src/data/products.js'
import {
  CATEGORIES_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  addCategoryToCatalog,
  addProductToCatalog,
  deleteCategoryFromCatalog,
  deleteProductFromCatalog,
  demoCatalog,
  getCatalogMetrics,
  persistCategories,
  persistProducts,
  readCategories,
  readProducts,
  renameCategoryInCatalog,
  updateProductInCatalog,
} from '../src/context/productState.js'

function memoryStorage() {
  const data = new Map()
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }
}

test('initializes products and categories from the demo seed when storage is empty', () => {
  const storage = memoryStorage()
  assert.deepEqual(readProducts(storage), seedProducts)
  assert.deepEqual(readCategories(storage, seedProducts).map(({ name }) => name), seedCategories.map(({ name }) => name))
})

test('creates a product with a unique id without mutating the previous catalog', () => {
  const original = [...seedProducts]
  const result = addProductToCatalog(original, { name: 'Maceta geométrica', category: 'Hogar', price: 29.9, stock: 4, image: '/placeholder.jpg' })
  assert.equal(result.ok, true)
  assert.equal(result.products.length, original.length + 1)
  assert.equal(original.length, seedProducts.length)
  assert.equal(result.product.name, 'Maceta geométrica')
})

test('updates an existing product while keeping its identifier', () => {
  const target = seedProducts[0]
  const result = updateProductInCatalog(seedProducts, target.id, { price: 99, stock: 0, name: 'Zorro edición especial' })
  assert.equal(result.ok, true)
  assert.equal(result.product.id, target.id)
  assert.equal(result.product.price, 99)
  assert.equal(result.product.stock, 0)
  assert.equal(result.products.find((p) => p.id === target.id).name, 'Zorro edición especial')
})

test('deletes a product and leaves the rest intact', () => {
  const result = deleteProductFromCatalog(seedProducts, seedProducts[1].id)
  assert.equal(result.ok, true)
  assert.equal(result.products.length, seedProducts.length - 1)
  assert.equal(result.products.some((p) => p.id === seedProducts[1].id), false)
})

test('products and categories persist and restore from local storage', () => {
  const storage = memoryStorage()
  const products = [...seedProducts, { id: 99, name: 'Prueba', category: 'Hogar', price: 1, stock: 2, image: '', tag: '', color: '#ffffff', description: '' }]
  const categories = [...seedCategories, { name: 'Pruebas', image: '/placeholder.jpg' }]
  assert.equal(persistProducts(storage, products), true)
  assert.equal(persistCategories(storage, categories), true)
  assert.ok(storage.getItem(PRODUCTS_STORAGE_KEY))
  assert.ok(storage.getItem(CATEGORIES_STORAGE_KEY))
  assert.deepEqual(readProducts(storage), products)
  assert.equal(readCategories(storage, products).some((c) => c.name === 'Pruebas'), true)
})

test('catalog metrics are calculated from real product stock and categories', () => {
  const metrics = getCatalogMetrics(seedProducts, seedCategories)
  assert.equal(metrics.totalProducts, seedProducts.length)
  assert.equal(metrics.availableProducts, seedProducts.filter((p) => p.stock > 0).length)
  assert.equal(metrics.outOfStockProducts, seedProducts.filter((p) => p.stock === 0).length)
  assert.equal(metrics.totalCategories, seedCategories.length)
})

test('a category with associated products cannot be deleted, while an empty one can', () => {
  const blocked = deleteCategoryFromCatalog(seedCategories, seedProducts, 'Hogar')
  assert.equal(blocked.ok, false)
  assert.match(blocked.message, /contiene productos/i)
  const withEmpty = addCategoryToCatalog(seedCategories, 'Decoración')
  assert.equal(withEmpty.ok, true)
  const removed = deleteCategoryFromCatalog(withEmpty.categories, seedProducts, 'Decoración')
  assert.equal(removed.ok, true)
  assert.equal(removed.categories.some((c) => c.name === 'Decoración'), false)
})

test('renaming a category also migrates its associated products', () => {
  const result = renameCategoryInCatalog(seedCategories, seedProducts, 'Gaming', 'Videojuegos')
  assert.equal(result.ok, true)
  assert.equal(result.categories.some((c) => c.name === 'Videojuegos'), true)
  assert.equal(result.products.filter((p) => p.category === 'Videojuegos').length, seedProducts.filter((p) => p.category === 'Gaming').length)
})

test('restoring the demo catalog returns fresh copies of the original seed', () => {
  const first = demoCatalog()
  first.products[0].name = 'Modificado'
  const second = demoCatalog()
  assert.equal(second.products[0].name, seedProducts[0].name)
  assert.deepEqual(second.categories, seedCategories)
})
