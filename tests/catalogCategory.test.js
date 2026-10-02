import test from 'node:test'
import assert from 'node:assert/strict'
import { categories, products } from '../src/data/products.js'
import { addProductToCatalog } from '../src/context/productState.js'
import { categoryCatalogUrl, clearCategorySearch, getCatalogCategoryView, getCategoryProducts } from '../src/utils/catalogCategory.js'

test('Hogar selecciona únicamente productos de la categoría real', () => {
  const view = getCatalogCategoryView(products, categories, 'Hogar')
  assert.equal(view.category, 'Hogar')
  assert.equal(view.valid, true)
  assert.deepEqual(view.products.map((product) => product.id), [2])
})
test('Gaming tolera mayúsculas, minúsculas y espacios también en productos', () => {
  const catalog = [...products, { id: 'mixed-case', category: 'gaming' }]
  const view = getCatalogCategoryView(catalog, categories, '  gAMING  ')
  assert.equal(view.category, 'Gaming')
  assert.deepEqual(view.products.map((product) => product.id), [4, 'mixed-case'])
})
test('categoría válida sin productos conserva el filtro y no mezcla otros diseños', () => {
  const view = getCatalogCategoryView(products, [...categories, { name: 'Regalos' }], 'Regalos')
  assert.equal(view.active, true)
  assert.equal(view.valid, true)
  assert.equal(view.category, 'Regalos')
  assert.deepEqual(view.products, [])
})
test('categoría inexistente muestra lista vacía sin romper el catálogo', () => {
  const view = getCatalogCategoryView(products, categories, 'NoExiste')
  assert.equal(view.active, true)
  assert.equal(view.valid, false)
  assert.deepEqual(view.products, [])
})
test('Ver todos elimina categoria sin mutar parámetros y restaura todos los productos', () => {
  const current = new URLSearchParams('categoria=Gaming&origen=home')
  const next = clearCategorySearch(current)
  assert.equal(current.get('categoria'), 'Gaming')
  assert.equal(next.has('categoria'), false)
  assert.equal(next.get('origen'), 'home')
  const view = getCatalogCategoryView(products, categories, next.get('categoria'))
  assert.equal(view.active, false)
  assert.deepEqual(view.products, products)
  assert.equal(getCatalogCategoryView(products, categories, ' ').active, false)
})
test('conteos y filtro responden a productos nuevos del catálogo sin alterar el anterior', () => {
  const result = addProductToCatalog(products, { name: 'Base de prueba', category: 'Gaming', price: 10, stock: 1 })
  assert.equal(result.ok, true)
  assert.equal(getCategoryProducts(products, 'Gaming').length, 1)
  assert.equal(getCategoryProducts(result.products, 'Gaming').length, 2)
  assert.equal(getCatalogCategoryView(result.products, categories, 'Gaming').products.length, 2)
})
test('tarjetas generan parámetros seguros para nombres dinámicos con acentos y símbolos', () => {
  const url = new URL(categoryCatalogUrl('Arte & Diseño'), 'https://nube3d.test')
  assert.equal(url.pathname, '/catalogo')
  assert.equal(url.searchParams.get('categoria'), 'Arte & Diseño')
})
