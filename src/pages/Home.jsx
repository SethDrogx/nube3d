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

export default function Home() {
  const [query, setQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const addToCart = (name) => {
    setCartCount((count) => count + 1)
    window.alert(`${name} se agregó al carrito`)
  }

  return (
    <main>
      <Navbar query={query} onQueryChange={setQuery} cartCount={cartCount} />
      <Hero />
      <Categories />
      <ProductsSection products={filteredProducts} onAdd={addToCart} />
      <CustomSection />
      <QuoteSection />
      <Footer />
      <ChatAssistant />
    </main>
  )
}
