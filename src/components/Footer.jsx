import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import { reveal, stagger, viewport } from '../animation'

export default function Footer() {
  return (
    <motion.footer
      id="contacto"
      className="site-footer"
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ ...viewport, amount: 0.08 }}
    >
      <motion.div variants={reveal}>
        <Brand light />
        <p>Objetos únicos, impresos para<br />hacer espacio a tus ideas.</p>
      </motion.div>
      <motion.div className="footer-links" variants={reveal}>
        <div><strong>Explora</strong><Link to="/catalogo">Productos</Link><a href="/#categorias">Categorías</a><Link to="/personalizado">Personaliza</Link></div>
        <div><strong>Ayuda</strong><a href="/#contacto">Contacto</a><a href="/#contacto">Preguntas frecuentes</a><a href="/#contacto">Políticas de envío</a></div>
        <div><strong>Síguenos</strong><a href="/#contacto">Instagram ↗</a><a href="/#contacto">TikTok ↗</a><a href="/#contacto">Pinterest ↗</a></div>
      </motion.div>
      <motion.div className="footer-bottom" variants={reveal}>
        <span>© 2024 Nube 3D</span><span>Hecho con intención en México</span>
      </motion.div>
    </motion.footer>
  )
}
