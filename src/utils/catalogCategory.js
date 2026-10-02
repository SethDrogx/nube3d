function categoryKey(value) {
  return String(value ?? '').trim().toLocaleLowerCase('es-MX')
}

export function getCategoryProducts(products, categoryName) {
  const key = categoryKey(categoryName)
  return products.filter((product) => categoryKey(product.category) === key)
}

export function getCatalogCategoryView(products, categories, parameter) {
  const key = categoryKey(parameter)
  if (!key) return { active: false, valid: true, category: null, products }
  const category = categories.find((item) => categoryKey(item.name) === key)
  return { active: true, valid: Boolean(category), category: category?.name ?? null, products: category ? getCategoryProducts(products, category.name) : [] }
}

export function categoryCatalogUrl(name) {
  return `/catalogo?${new URLSearchParams({ categoria: name })}`
}

export function clearCategorySearch(searchParams) {
  const next = new URLSearchParams(searchParams)
  next.delete('categoria')
  return next
}
