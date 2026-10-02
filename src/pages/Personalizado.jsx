import { useEffect, useRef, useState } from 'react'
import { animate, AnimatePresence, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FormSection from '../components/FormSection'
import FormProgress from '../components/FormProgress'
import UploadZone from '../components/UploadZone'
import { useQuotes } from '../context/QuoteContext'
import { EMPTY_QUOTE, validateQuote } from '../context/quoteState'
import { prepareImageFile } from '../utils/imageUpload'
import { getNextQuoteStep, QUOTE_STEPS } from '../utils/quoteStepper'

const fields = [['nombre', 'Nombre *'], ['email', 'Correo electrónico *', 'email'], ['telefono', 'Teléfono', 'tel'], ['descripcion', 'Descripción del proyecto *', 'textarea'], ['medidas', 'Medidas aproximadas'], ['color', 'Color deseado'], ['cantidad', 'Cantidad *', 'number'], ['comentarios', 'Comentarios adicionales', 'textarea']]

export default function Personalizado() {
  const { addQuote } = useQuotes()
  const reduced = useReducedMotion()
  const circleRotation = useMotionValue(0)
  const stepRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [changingStep, setChangingStep] = useState(false)
  const [values, setValues] = useState({ ...EMPTY_QUOTE })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [imageReady, setImageReady] = useState(false)
  const [fileName, setFileName] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    circleRotation.set(0)
    if (reduced) return
    const rotation = animate(circleRotation, [0, 360], { duration: 10, ease: 'linear', repeat: Infinity })
    return () => rotation.stop()
  }, [circleRotation, reduced])
  function field(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }))
    if (key === 'imagen') { setImageReady(false); setFileName('') }
  }
  async function upload(file) {
    if (!file) return
    setProcessing(true)
    try { const prepared = await prepareImageFile(file); field('imagen', prepared.dataUrl); setFileName(prepared.originalName) }
    catch (error) { setErrors((e) => ({ ...e, imagen: error.message })) }
    finally { setProcessing(false) }
  }
  function changeStep(step) {
    setChangingStep(true)
    setActiveStep(step)
  }
  function finishStepTransition() {
    if (!changingStep) return
    setChangingStep(false)
    stepRef.current?.focus({ preventScroll: true })
    stepRef.current?.scrollIntoView({ block: 'start' })
  }
  function next() {
    const result = getNextQuoteStep(values, activeStep)
    setErrors((previous) => ({ ...previous, ...Object.fromEntries(QUOTE_STEPS[activeStep].fields.map((key) => [key, result.errors[key]])), form: undefined }))
    if (result.step !== activeStep) changeStep(result.step)
    else document.getElementById(`quote-${Object.keys(result.errors)[0]}`)?.focus()
  }
  function submit(event) {
    event.preventDefault()
    if (processing || saving || changingStep) return
    if (activeStep < 2) { next(); return }
    const nextErrors = validateQuote(values)
    if (values.imagen && !imageReady) nextErrors.imagen = 'Espera a que cargue la imagen o usa otra imagen válida.'
    if (errors.imagen) nextErrors.imagen = errors.imagen
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      const invalidStep = QUOTE_STEPS.findIndex((step) => step.fields.some((key) => nextErrors[key]))
      if (invalidStep >= 0 && invalidStep !== activeStep) changeStep(invalidStep)
      return
    }
    setSaving(true)
    const result = addQuote(values)
    if (result.ok) setConfirmation(result.quote)
    else setErrors(result.errors ?? { form: result.message })
    setSaving(false)
  }
  function renderField([key, label, type = 'text']) {
    return <label key={key} className={type === 'textarea' ? 'admin-form-wide' : ''} htmlFor={`quote-${key}`}>{label}
      {type === 'textarea' ? <textarea aria-label={label} id={`quote-${key}`} rows="4" value={values[key]} onChange={(e) => field(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} required={key === 'descripcion'} /> : <input aria-label={label} id={`quote-${key}`} type={type} min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined} required={['nombre', 'email', 'cantidad'].includes(key)} value={values[key]} onChange={(e) => field(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} />}
      {type === 'textarea' && <small className="character-count">{values[key].length} caracteres</small>}
      {errors[key] && <motion.span id={`error-${key}`} className="admin-field-error" role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors[key]}</motion.span>}
    </label>
  }
  return <main className="custom-create-page"><Navbar /><section className="custom-create-shell">
    <header className="custom-create-heading"><div><p className="kicker">TU IDEA, NUESTRA TÉCNICA · CREA TU PIEZA</p><h1>Impresión<br /><em>personalizada.</em></h1><p>Convierte algo que imaginas en una pieza que puedes tocar.</p></div><div className="custom-sculpture" aria-hidden="true"><motion.div className="custom-sculpture-orbit" style={{ rotate: circleRotation }}><span /><span /><span /></motion.div><small>DE LA IDEA<br />A LA FORMA / 3D</small></div></header>
    {confirmation ? <motion.div className="quote-confirmation" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <span className="confirmation-mark" aria-hidden="true">✓</span><p className="kicker">TU IDEA YA TIENE UN LUGAR</p><h2>Solicitud enviada correctamente</h2><p>Tu folio es:</p><strong className="confirmation-folio">{confirmation.folio}</strong><p>Conserva este folio para futuras consultas.</p>
      <div className="quote-actions"><Link className="primary-button" to="/">Volver al inicio ↗</Link><button className="admin-secondary-button" onClick={() => { setValues({ ...EMPTY_QUOTE }); setErrors({}); setImageReady(false); setFileName(''); setActiveStep(0); setConfirmation(null) }}>Enviar otra solicitud</button><Link to="/cotizacion">Consultar folio ↗</Link></div>
    </motion.div> : <>
      <p>Cuéntanos qué quieres imprimir. No necesitas iniciar sesión.</p>
      <FormProgress activeStep={activeStep} />
      <motion.form className="admin-product-form quote-form" noValidate onSubmit={submit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <AnimatePresence mode="wait" initial={false}><motion.div key={activeStep} ref={stepRef} tabIndex={-1} className="quote-step" aria-label={`Paso ${activeStep + 1}: ${QUOTE_STEPS[activeStep].label}`} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: .18 }} onAnimationComplete={finishStepTransition}>
        {activeStep === 0 && <FormSection number="01" title="Cuéntanos tu idea" description="El primer trazo de una pieza hecha para ti."><div className="admin-form-grid">{fields.slice(0, 4).map(renderField)}</div></FormSection>}
        {activeStep === 1 && <FormSection number="02" title="Define los detalles" description="Tamaño, color y pequeños detalles que hacen la diferencia."><div className="admin-form-grid">{fields.slice(4).map(renderField)}</div></FormSection>}
        {activeStep === 2 && <FormSection number="03" title="Muéstranos una referencia" description="Una foto, un boceto o una inspiración. Este paso es opcional.">
          <div className="admin-image-source"><strong>Imagen de referencia</strong><p>Sube una imagen desde tu equipo o celular, o pega su URL. Solo se aceptan imágenes; las fotos subidas se optimizan automáticamente.</p>
            <label>URL de imagen<input type="url" disabled={processing || values.imagen.startsWith('data:')} value={values.imagen.startsWith('data:') ? '' : values.imagen} onChange={(e) => field('imagen', e.target.value.trim())} /></label>
            <UploadZone image={values.imagen} fileName={fileName} busy={processing} error={errors.imagen} onFile={upload} onClear={() => field('imagen', '')} alt="Vista previa de referencia" onLoad={() => setImageReady(true)} onError={() => { setImageReady(false); setErrors((e) => ({ ...e, imagen: 'No se pudo cargar una imagen válida. Cambia o quita la referencia.' })) }} />
          </div>
        </FormSection>}
        </motion.div></AnimatePresence>
        {errors.form && <p className="admin-form-error" role="alert">{errors.form}</p>}
        <div className="custom-submit-row"><div><strong>{activeStep === 2 ? 'Del boceto a tu próxima pieza.' : 'Tu idea, paso a paso.'}</strong><p>{activeStep === 2 ? 'Revisaremos los detalles de tu idea.' : 'Cada detalle nos acerca a lo que imaginas.'}</p></div><div className="quote-step-actions">{activeStep > 0 && <button className="quote-step-back" disabled={processing || saving || changingStep} type="button" onClick={() => changeStep(activeStep - 1)}>Anterior</button>}<motion.button className="primary-button" disabled={processing || saving || changingStep} type="submit" whileTap={{ scale: .98 }}>{processing ? 'Preparando imagen…' : saving ? 'Guardando…' : activeStep === 2 ? 'Enviar solicitud' : 'Siguiente'} <span aria-hidden="true">↗</span></motion.button></div></div>
      </motion.form><p><Link to="/cotizacion">Consultar una solicitud por folio ↗</Link></p>
    </>}
    <p className="quote-local-note">Demostración local: las solicitudes se guardan únicamente en este navegador. No se envían al equipo de Nube 3D. No introduzcas datos sensibles reales.</p>
    {!confirmation && <Link className="text-button" to="/">Volver al inicio ↗</Link>}
  </section><Footer /></main>
}
