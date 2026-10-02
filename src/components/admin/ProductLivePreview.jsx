import { motion } from 'motion/react'
import ProductCard from '../ProductCard'
import { isValidImageSource } from '../../utils/imageUpload'

export default function ProductLivePreview({ values }) {
  const price = Number(values.price)
  const product = { ...values, name: values.name || 'Tu próximo diseño', category: values.category || 'Categoría', price: Number.isFinite(price) && price >= 0 ? price : 0, stock: Number(values.stock) > 0 ? Number(values.stock) : 0, image: isValidImageSource(values.image.trim()) ? values.image.trim() : '', color: '#f1eee8' }
  return <motion.aside className="product-live-preview" aria-label="Vista previa en vivo del producto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <p className="kicker">VISTA PREVIA / EN VIVO</p><h2>Así se verá<br /><em>tu pieza.</em></h2>
    <motion.div className="studio-preview-card" initial="show" animate="show" whileHover={{ y: -3 }}><ProductCard product={product} preview /></motion.div>
    {values.description && <p className="studio-preview-description">{values.description}</p>}
    <p className="studio-preview-note">Una mirada antes de publicar.<br />Los cambios se guardan solo al enviar el formulario.</p>
  </motion.aside>
}
