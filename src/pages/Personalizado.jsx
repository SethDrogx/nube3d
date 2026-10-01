import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import RouteShell from './RouteShell'
import { useQuotes } from '../context/QuoteContext'
import { EMPTY_QUOTE, validateQuote } from '../context/quoteState'
import { prepareImageFile } from '../utils/imageUpload'

const fields = [['nombre', 'Nombre *'], ['email', 'Correo electrónico *', 'email'], ['telefono', 'Teléfono', 'tel'], ['descripcion', 'Descripción del proyecto *', 'textarea'], ['medidas', 'Medidas aproximadas'], ['color', 'Color deseado'], ['cantidad', 'Cantidad *', 'number'], ['comentarios', 'Comentarios adicionales', 'textarea']]

export default function Personalizado() {
  const { addQuote } = useQuotes()
  const [values, setValues] = useState({ ...EMPTY_QUOTE })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [imageReady, setImageReady] = useState(false)
  const fileRef = useRef(null)
  function field(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }))
    if (key === 'imagen') setImageReady(false)
  }
  async function upload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setProcessing(true)
    try { const prepared = await prepareImageFile(file); field('imagen', prepared.dataUrl) }
    catch (error) { setErrors((e) => ({ ...e, imagen: error.message })); event.target.value = '' }
    finally { setProcessing(false) }
  }
  function submit(event) {
    event.preventDefault()
    const nextErrors = validateQuote(values)
    if (values.imagen && !imageReady) nextErrors.imagen = 'Espera a que cargue la imagen o usa otra imagen válida.'
    if (errors.imagen) nextErrors.imagen = errors.imagen
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return }
    const result = addQuote(values)
    if (result.ok) setConfirmation(result.quote)
    else setErrors(result.errors ?? { form: result.message })
  }
  return <RouteShell kicker="TU IDEA, NUESTRA TÉCNICA" title="Impresión personalizada">
    {confirmation ? <motion.div className="quote-confirmation" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2>Solicitud enviada correctamente</h2><p>Tu folio es: <strong>{confirmation.folio}</strong></p><p>Conserva este folio para futuras consultas.</p>
      <div className="quote-actions"><button className="admin-secondary-button" onClick={() => { setValues({ ...EMPTY_QUOTE }); setErrors({}); setImageReady(false); setConfirmation(null) }}>Enviar otra solicitud</button><Link to="/cotizacion">Consultar folio ↗</Link></div>
    </motion.div> : <>
      <p>Cuéntanos qué quieres imprimir. No necesitas iniciar sesión.</p>
      <motion.form className="admin-product-form quote-form" noValidate onSubmit={submit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="admin-form-grid">{fields.map(([key, label, type = 'text']) => <label key={key} className={type === 'textarea' ? 'admin-form-wide' : ''} htmlFor={`quote-${key}`}>{label}
          {type === 'textarea' ? <textarea id={`quote-${key}`} rows="4" value={values[key]} onChange={(e) => field(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} required={key === 'descripcion'} /> : <input id={`quote-${key}`} type={type} min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined} required={['nombre', 'email', 'cantidad'].includes(key)} value={values[key]} onChange={(e) => field(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} />}
          {errors[key] && <motion.span id={`error-${key}`} className="admin-field-error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[key]}</motion.span>}
        </label>)}
          <div className="admin-form-wide admin-image-source"><strong>Imagen de referencia</strong><p>Sube una imagen desde tu equipo o celular, o pega su URL. Solo se aceptan imágenes; las fotos subidas se optimizan automáticamente.</p>
            <label>URL de imagen<input type="url" disabled={processing || values.imagen.startsWith('data:')} value={values.imagen.startsWith('data:') ? '' : values.imagen} onChange={(e) => field('imagen', e.target.value.trim())} /></label>
            <label>Subir imagen<input ref={fileRef} type="file" accept="image/*" disabled={processing} onChange={upload} /></label>
            {processing && <p role="status">Preparando imagen…</p>}
            {values.imagen && <><button className="admin-image-clear" type="button" disabled={processing} onClick={() => { field('imagen', ''); if (fileRef.current) fileRef.current.value = '' }}>Quitar imagen</button><div className="admin-image-preview"><img key={values.imagen} src={values.imagen} alt="Vista previa de referencia" onLoad={() => setImageReady(true)} onError={() => { setImageReady(false); setErrors((e) => ({ ...e, imagen: 'No se pudo cargar una imagen válida. Cambia o quita la referencia.' })) }} /></div></>}
            {errors.imagen && <motion.p className="admin-field-error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.imagen}</motion.p>}
          </div>
        </div>
        {errors.form && <p className="admin-form-error" role="alert">{errors.form}</p>}
        <button className="primary-button" disabled={processing} type="submit">Enviar solicitud ↗</button>
      </motion.form><p><Link to="/cotizacion">Consultar una solicitud por folio ↗</Link></p>
    </>}
    <p className="quote-local-note">Demostración local: las solicitudes se guardan únicamente en este navegador. No se envían al equipo de Nube 3D. No introduzcas datos sensibles reales.</p>
  </RouteShell>
}
