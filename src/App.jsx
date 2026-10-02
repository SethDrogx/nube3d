import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Personalizado from './pages/Personalizado'
import Cotizacion from './pages/Cotizacion'
import AdminQuotes from './pages/admin/AdminQuotes'
import AdminQuoteDetail from './pages/admin/AdminQuoteDetail'
import { QuoteProvider } from './context/QuoteContext'
import Login from './pages/Login'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './data/users'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductNew from './pages/admin/AdminProductNew'
import AdminProductEdit from './pages/admin/AdminProductEdit'
import AdminCategories from './pages/admin/AdminCategories'
import ChatAssistant from './components/ChatAssistant'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="page-transition"
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/personalizado" element={<Personalizado />} />
          <Route path="/cotizacion" element={<Cotizacion />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<ProtectedRoute requiredRole={ROLES.SUPER_USUARIO}><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="productos/nuevo" element={<AdminProductNew />} />
            <Route path="productos/:id/editar" element={<AdminProductEdit />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="cotizaciones" element={<AdminQuotes />} />
            <Route path="cotizaciones/:id" element={<AdminQuoteDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <QuoteProvider><AnimatedRoutes /><ChatAssistant /></QuoteProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
