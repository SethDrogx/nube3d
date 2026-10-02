import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import FormSection from '../FormSection'
import UploadZone from '../UploadZone'
import ProductLivePreview from './ProductLivePreview'
import { isValidImageSource, prepareImageFile } from '../../utils/imageUpload.js'

const emptyProduct = {
  name: '', category: '', price: '', stock: '', image: '', description: '', tag: '',
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'
  if (!values.category.trim()) errors.category = 'La categoría es obligatoria.'
  const price = Number(values.price)
  if (values.price === '' || !Number.isFinite(price) || price < 0) errors.price = 'Ingresa un precio válido mayor o igual a 0.'
  const stock = Number(values.stock)
  if (values.stock === '' || !Number.isInteger(stock) || stock < 0) errors.stock = 'El stock debe ser un entero mayor o igual a 0.'
  if (!isValidImageSource(values.image.trim())) errors.image = 'Usa una URL http(s), una ruta local que empiece con / o sube una imagen.'
  return errors
}

export default function ProductForm({ initialProduct, categories, submitLabel, onSubmit }) {
  const initialValues = useMemo(() => initialProduct ? {
    name: initialProduct.name ?? '', category: initialProduct.category ?? '', price: String(initialProduct.price ?? ''),
    stock: String(initialProduct.stock ?? 0), image: initialProduct.image ?? '', description: initialProduct.description ?? '',
    tag: initialProduct.tag ?? '',
  } : emptyProduct, [initialProduct])
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [processingImage, setProcessingImage] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
    setUploadedFileName(initialValues.image.startsWith('data:image/') ? 'Imagen guardada desde archivo' : '')
  }, [initialValues])

  const usingUploadedImage = values.image.startsWith('data:image/')

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  function handleImageUrlChange(value) {
    setUploadedFileName('')
    setField('image', value)
  }

  async function handleImageFile(file) {
    if (!file) return
    setProcessingImage(true)
    setErrors((current) => ({ ...current, image: undefined, form: undefined }))
    try {
      const prepared = await prepareImageFile(file)
      setValues((current) => ({ ...current, image: prepared.dataUrl }))
      setUploadedFileName(prepared.originalName)
    } catch (error) {
      setErrors((current) => ({ ...current, image: error?.message || 'No se pudo procesar la imagen.' }))
    } finally {
      setProcessingImage(false)
    }
  }

  function clearImage() {
    setValues((current) => ({ ...current, image: '' }))
    setUploadedFileName('')
    setErrors((current) => ({ ...current, image: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    setSaving(true)
    const result = onSubmit({
      ...values,
      name: values.name.trim(), category: values.category.trim(), price: Number(values.price), stock: Number(values.stock),
      image: values.image.trim(), description: values.description.trim(), tag: values.tag.trim(),
    })
    if (!result?.ok) setErrors({ form: result?.message || 'No se pudo guardar el producto.' })
    setSaving(false)
  }

  return (
    <div className="product-studio-grid"><motion.form className="admin-product-form product-studio-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <FormSection number="01" title="Dale identidad" description="La información que acompaña a tu diseño.">
      <div className="admin-form-grid">
        <label>Nombre<input aria-label="Nombre" aria-invalid={Boolean(errors.name)} value={values.name} onChange={(e) => setField('name', e.target.value)} />{errors.name && <span className="admin-field-error" role="alert">{errors.name}</span>}</label>
        <label>Categoría<select aria-label="Categoría" aria-invalid={Boolean(errors.category)} value={values.category} onChange={(e) => setField('category', e.target.value)}><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select>{errors.category && <span className="admin-field-error" role="alert">{errors.category}</span>}</label>
        <label>Precio<input aria-label="Precio" aria-invalid={Boolean(errors.price)} type="number" min="0" step="0.01" value={values.price} onChange={(e) => setField('price', e.target.value)} />{errors.price && <span className="admin-field-error" role="alert">{errors.price}</span>}</label>
        <label>Stock<input aria-label="Stock" aria-invalid={Boolean(errors.stock)} type="number" min="0" step="1" value={values.stock} onChange={(e) => setField('stock', e.target.value)} />{errors.stock && <span className="admin-field-error" role="alert">{errors.stock}</span>}</label>
        <label className="admin-form-wide">Etiqueta<input value={values.tag} onChange={(e) => setField('tag', e.target.value)} placeholder="Nuevo, Popular..." /></label>
        <label className="admin-form-wide">Descripción<textarea aria-label="Descripción" rows="4" value={values.description} onChange={(e) => setField('description', e.target.value)} /><small className="character-count">{values.description.length} caracteres</small></label>
      </div></FormSection>
      <FormSection number="02" title="La imagen de tu pieza" description="Una fotografía protagonista para el catálogo.">

        <div className="admin-image-source">
          <div className="admin-image-source-copy">
            <strong>Imagen del producto</strong>
            <span>Pega una URL o sube una foto desde tu equipo. En celular puedes elegir una imagen de tu galería o tomar una foto con la cámara.</span>
          </div>

          <label>URL de imagen
            <input
              value={usingUploadedImage ? '' : values.image}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder={usingUploadedImage ? 'Actualmente se usa una imagen subida desde archivo' : 'https://...'}
              disabled={usingUploadedImage}
            />
          </label>

          <UploadZone image={isValidImageSource(values.image.trim()) ? values.image.trim() : ''} fileName={uploadedFileName} busy={processingImage} error={errors.image} onFile={handleImageFile} onClear={clearImage} onError={(event) => { event.currentTarget.style.opacity = '.2' }} />
          <p className="admin-image-note">Las fotos subidas se optimizan automáticamente para esta versión local. Más adelante el almacenamiento se moverá al backend/servicio de imágenes.</p>
        </div>

      </FormSection>
      {errors.form && <p className="admin-form-error" role="alert">{errors.form}</p>}
      <div className="studio-form-actions"><motion.button className="primary-button admin-save-button" type="submit" disabled={saving || processingImage} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>{saving ? 'Guardando…' : submitLabel}<span>↗</span></motion.button><Link className="text-button" to="/admin/productos">Cancelar</Link></div>
    </motion.form><ProductLivePreview values={values} /></div>
  )
}
