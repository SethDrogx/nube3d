import { motion } from 'motion/react'

export default function FormSection({ number, title, description, children }) {
  return <motion.fieldset className="editorial-form-section" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: .4 }}>
    <legend><span>{number}</span>{title}</legend>
    {description && <p className="form-section-description">{description}</p>}
    {children}
  </motion.fieldset>
}
