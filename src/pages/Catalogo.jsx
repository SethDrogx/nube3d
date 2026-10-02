import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProductsSection from '../components/ProductsSection'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { clearCategorySearch, getCatalogCategoryView } from '../utils/catalogCategory'

export default function Catalogo() {
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const { addProduct } = useCart()
  const { products, categories } = useProducts()
  const categoryParameter = searchParams.get('categoria')
  const categoryView = useMemo(() => getCatalogCategoryView(products, categories, categoryParameter), [products, categories, categoryParameter])
  const filteredProducts = useMemo(
    () => categoryView.products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [categoryView, query],
  )

  return (
    <main>
      <Navbar query={query} onQueryChange={setQuery} />
      <ProductsSection products={filteredProducts} onAdd={addProduct} categoryView={categoryView} onClearCategory={() => { setSearchParams(clearCategorySearch(searchParams)); setQuery('') }} />
      <Footer />
    </main>
  )
}
