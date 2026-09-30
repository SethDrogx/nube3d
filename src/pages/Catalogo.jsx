import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductsSection from '../components/ProductsSection'
import Footer from '../components/Footer'
import ChatAssistant from '../components/ChatAssistant'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Catalogo() {
  const [query, setQuery] = useState('')
  const { addProduct } = useCart()
  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <main>
      <Navbar query={query} onQueryChange={setQuery} />
      <ProductsSection products={filteredProducts} onAdd={addProduct} />
      <Footer />
      <ChatAssistant />
    </main>
  )
}
