import { categories as seedCategoryData, products as seedProductData } from '../data/products.js'

export const PRODUCTS_STORAGE_KEY = 'nube3d.products.v1'
export const CATEGORIES_STORAGE_KEY = 'nube3d.categories.v1'

const DEFAULT_CATEGORY_IMAGE = '/placeholder.jpg'
const DEFAULT_PRODUCT_COLOR = '#eee9e1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function normalizeProduct(product) {
  if (!product || (typeof product.id !== 'number' && typeof product.id !== 'string')) return null
  const name = typeof product.name === 'string' ? product.name.trim() : ''
  const category = typeof product.category === 'string' ? product.category.trim() : ''
  const price = Number(product.price)
  const stock = Number(product.stock ?? 0)
  if (!name || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return null
  return {
    ...product,
    name,
    category,
    price,
    stock,
    image: typeof product.image === 'string' ? product.image.trim() : '',
    description: typeof product.description === 'string' ? product.description.trim() : '',
    tag: typeof product.tag === 'string' ? product.tag.trim() : '',
    color: typeof product.color === 'string' && product.color.trim() ? product.color.trim() : DEFAULT_PRODUCT_COLOR,
  }
}

export function normalizeProducts(value, fallback = seedProductData) {
  if (!Array.isArray(value)) return clone(fallback)
  const seen = new Set()
  const normalized = []
  for (const entry of value) {
    const product = normalizeProduct(entry)
    if (!product || seen.has(String(product.id))) continue
    seen.add(String(product.id))
    normalized.push(product)
  }
  return normalized
}

export function normalizeCategory(category) {
  const rawName = typeof category === 'string' ? category : category?.name
  const name = typeof rawName === 'string' ? rawName.trim() : ''
  if (!name) return null
  return {
    name,
    image: typeof category?.image === 'string' && category.image.trim() ? category.image.trim() : DEFAULT_CATEGORY_IMAGE,
  }
}

export function normalizeCategories(value, fallback = seedCategoryData) {
  const source = Array.isArray(value) ? value : fallback
  const seen = new Set()
  const normalized = []
  for (const entry of source) {
    const category = normalizeCategory(entry)
    const key = category?.name.toLocaleLowerCase('es-MX')
    if (!category || seen.has(key)) continue
    seen.add(key)
    normalized.push(category)
  }
  return normalized
}

export function ensureProductCategories(categoryList, productList) {
  const categories = normalizeCategories(categoryList, [])
  const names = new Set(categories.map((category) => category.name.toLocaleLowerCase('es-MX')))
  for (const product of normalizeProducts(productList, [])) {
    const key = product.category.toLocaleLowerCase('es-MX')
    if (!names.has(key)) {
      categories.push({ name: product.category, image: DEFAULT_CATEGORY_IMAGE })
      names.add(key)
    }
  }
  return categories
}

function safeGet(storage, key) {
  try { return storage?.getItem(key) ?? null } catch { return null }
}

export function readProducts(storage) {
  try {
    const raw = safeGet(storage, PRODUCTS_STORAGE_KEY)
    return raw === null ? clone(seedProductData) : normalizeProducts(JSON.parse(raw), seedProductData)
  } catch {
    return clone(seedProductData)
  }
}

export function readCategories(storage, productList = seedProductData) {
  try {
    const raw = safeGet(storage, CATEGORIES_STORAGE_KEY)
    const base = raw === null ? clone(seedCategoryData) : normalizeCategories(JSON.parse(raw), seedCategoryData)
    return ensureProductCategories(base, productList)
  } catch {
    return ensureProductCategories(seedCategoryData, productList)
  }
}

export function persistProducts(storage, productList) {
  try {
    storage?.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalizeProducts(productList, [])))
    return true
  } catch { return false }
}

export function persistCategories(storage, categoryList) {
  try {
    storage?.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(normalizeCategories(categoryList, [])))
    return true
  } catch { return false }
}

export function nextProductId(productList) {
  const numeric = productList.map((product) => Number(product.id)).filter(Number.isSafeInteger)
  return numeric.length ? Math.max(...numeric) + 1 : 1
}

export function addProductToCatalog(productList, input) {
  const product = normalizeProduct({ ...input, id: input?.id ?? nextProductId(productList) })
  if (!product) return { ok: false, message: 'Los datos del producto no son válidos.', products: productList }
  if (productList.some((item) => String(item.id) === String(product.id))) return { ok: false, message: 'Ya existe un producto con ese identificador.', products: productList }
  return { ok: true, product, products: [...productList, product] }
}

export function updateProductInCatalog(productList, id, changes) {
  const current = productList.find((product) => String(product.id) === String(id))
  if (!current) return { ok: false, message: 'Producto no encontrado.', products: productList }
  const product = normalizeProduct({ ...current, ...changes, id: current.id })
  if (!product) return { ok: false, message: 'Los datos del producto no son válidos.', products: productList }
  return { ok: true, product, products: productList.map((item) => String(item.id) === String(id) ? product : item) }
}

export function deleteProductFromCatalog(productList, id) {
  if (!productList.some((product) => String(product.id) === String(id))) return { ok: false, message: 'Producto no encontrado.', products: productList }
  return { ok: true, products: productList.filter((product) => String(product.id) !== String(id)) }
}

export function addCategoryToCatalog(categoryList, name, image = DEFAULT_CATEGORY_IMAGE) {
  const category = normalizeCategory({ name, image })
  if (!category) return { ok: false, message: 'Escribe un nombre de categoría válido.', categories: categoryList }
  if (categoryList.some((item) => item.name.toLocaleLowerCase('es-MX') === category.name.toLocaleLowerCase('es-MX'))) {
    return { ok: false, message: 'Esa categoría ya existe.', categories: categoryList }
  }
  return { ok: true, category, categories: [...categoryList, category] }
}

export function renameCategoryInCatalog(categoryList, productList, oldName, newName) {
  const name = typeof newName === 'string' ? newName.trim() : ''
  if (!name) return { ok: false, message: 'Escribe un nombre de categoría válido.', categories: categoryList, products: productList }
  const oldKey = String(oldName).toLocaleLowerCase('es-MX')
  const duplicate = categoryList.some((item) => item.name.toLocaleLowerCase('es-MX') === name.toLocaleLowerCase('es-MX') && item.name.toLocaleLowerCase('es-MX') !== oldKey)
  if (duplicate) return { ok: false, message: 'Ya existe otra categoría con ese nombre.', categories: categoryList, products: productList }
  const exists = categoryList.some((item) => item.name.toLocaleLowerCase('es-MX') === oldKey)
  if (!exists) return { ok: false, message: 'Categoría no encontrada.', categories: categoryList, products: productList }
  return {
    ok: true,
    categories: categoryList.map((item) => item.name.toLocaleLowerCase('es-MX') === oldKey ? { ...item, name } : item),
    products: productList.map((product) => product.category.toLocaleLowerCase('es-MX') === oldKey ? { ...product, category: name } : product),
  }
}

export function deleteCategoryFromCatalog(categoryList, productList, name) {
  const key = String(name).toLocaleLowerCase('es-MX')
  if (productList.some((product) => product.category.toLocaleLowerCase('es-MX') === key)) {
    return { ok: false, message: 'No puedes eliminar esta categoría porque contiene productos.', categories: categoryList }
  }
  if (!categoryList.some((category) => category.name.toLocaleLowerCase('es-MX') === key)) {
    return { ok: false, message: 'Categoría no encontrada.', categories: categoryList }
  }
  return { ok: true, categories: categoryList.filter((category) => category.name.toLocaleLowerCase('es-MX') !== key) }
}

export function getCatalogMetrics(productList, categoryList) {
  return {
    totalProducts: productList.length,
    availableProducts: productList.filter((product) => product.stock > 0).length,
    outOfStockProducts: productList.filter((product) => product.stock === 0).length,
    totalCategories: categoryList.length,
  }
}

export function demoCatalog() {
  return {
    products: clone(seedProductData),
    categories: clone(seedCategoryData),
  }
}
