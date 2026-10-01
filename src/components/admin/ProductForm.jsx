import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'

const emptyProduct = {
  name: '', category: '', price: '', stock: '', image: '', description: '', tag: '', color: '#eee9e1',
}

function isValidImage(value) {
  if (!value) return true
  if (value.startsWith('/')) return true
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) } catch { return false }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'
  if (!values.category.trim()) errors.category = 'La categoría es obligatoria.'
  const price = Number(values.price)
  if (values.price === '' || !Number.isFinite(price) || price < 0) errors.price = 'Ingresa un precio válido mayor o igual a 0.'
  const stock = Number(values.stock)
  if (values.stock === '' || !Number.isInteger(stock) || stock < 0) errors.stock = 'El stock debe ser un entero mayor o igual a 0.'
  if (!isValidImage(values.image.trim())) errors.image = 'Usa una URL http(s) válida o una ruta local que empiece con /.'
  return errors
}

export default function ProductForm({ initialProduct, categories, submitLabel, onSubmit }) {
  const initialValues = useMemo(() => initialProduct ? {
    name: initialProduct.name ?? '', category: initialProduct.category ?? '', price: String(initialProduct.price ?? ''),
    stock: String(initialProduct.stock ?? 0), image: initialProduct.image ?? '', description: initialProduct.description ?? '',
    tag: initialProduct.tag ?? '', color: initialProduct.color ?? '#eee9e1',
  } : emptyProduct, [initialProduct])
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { setValues(initialValues); setErrors({}) }, [initialValues])

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    setSaving(true)
    const result = onSubmit({
      ...values,
      name: values.name.trim(), category: values.category.trim(), price: Number(values.price), stock: Number(values.stock),
      image: values.image.trim(), description: values.description.trim(), tag: values.tag.trim(), color: values.color || '#eee9e1',
    })
    if (!result?.ok) setErrors({ form: result?.message || 'No se pudo guardar el producto.' })
    setSaving(false)
  }

  return (
    <motion.form className="admin-product-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="admin-form-grid">
        <label>Nombre<input value={values.name} onChange={(e) => setField('name', e.target.value)} />{errors.name && <span className="admin-field-error">{errors.name}</span>}</label>
        <label>Categoría<select value={values.category} onChange={(e) => setField('category', e.target.value)}><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select>{errors.category && <span className="admin-field-error">{errors.category}</span>}</label>
        <label>Precio<input type="number" min="0" step="0.01" value={values.price} onChange={(e) => setField('price', e.target.value)} />{errors.price && <span className="admin-field-error">{errors.price}</span>}</label>
        <label>Stock<input type="number" min="0" step="1" value={values.stock} onChange={(e) => setField('stock', e.target.value)} />{errors.stock && <span className="admin-field-error">{errors.stock}</span>}</label>
        <label>Etiqueta<input value={values.tag} onChange={(e) => setField('tag', e.target.value)} placeholder="Nuevo, Popular..." /></label>
        <label>Color de fondo<input type="color" value={values.color} onChange={(e) => setField('color', e.target.value)} /></label>
        <label className="admin-form-wide">URL de imagen<input value={values.image} onChange={(e) => setField('image', e.target.value)} placeholder="https://..." />{errors.image && <span className="admin-field-error">{errors.image}</span>}</label>
        <label className="admin-form-wide">Descripción<textarea rows="4" value={values.description} onChange={(e) => setField('description', e.target.value)} /></label>
      </div>
      {values.image && isValidImage(values.image.trim()) && <div className="admin-image-preview"><span>Vista previa</span><img src={values.image} alt="Vista previa del producto" onError={(event) => { event.currentTarget.style.opacity = '.2' }} /></div>}
      {errors.form && <p className="admin-form-error" role="alert">{errors.form}</p>}
      <motion.button className="primary-button admin-save-button" type="submit" disabled={saving} whileTap={{ scale: 0.98 }}>{saving ? 'Guardando…' : submitLabel}<span>↗</span></motion.button>
    </motion.form>
  )
}
