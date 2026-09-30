import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import ProductsSection from '../components/ProductsSection'
import CustomSection from '../components/CustomSection'
import QuoteSection from '../components/QuoteSection'
import Footer from '../components/Footer'
import ChatAssistant from '../components/ChatAssistant'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [query, setQuery] = useState('')
  const { addProduct } = useCart()
  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <main>
      <Navbar query={query} onQueryChange={setQuery} />
      <Hero />
      <Categories />
      <ProductsSection products={filteredProducts} onAdd={addProduct} />
      <CustomSection />
      <QuoteSection />
      <Footer />
      <ChatAssistant />
    </main>
  )
}
