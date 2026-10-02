import { useRef, useState } from 'react'
import { motion } from 'motion/react'

// UI only: callers retain their existing image preparation and validation.
export default function UploadZone({ image, fileName, busy, error, onFile, onClear, onLoad, onError, alt = 'Vista previa del producto' }) {
  const input = useRef(null)
  const [dragging, setDragging] = useState(false)
  async function select(file) {
    if (!file || busy) return
    await onFile(file)
    if (input.current) input.current.value = ''
  }
  return <div className={`upload-zone ${dragging ? 'is-dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); if (!busy) setDragging(true) }} onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }} onDrop={(e) => { e.preventDefault(); setDragging(false); select(e.dataTransfer.files?.[0]) }}>
    {image ? <div className="upload-large-preview"><img key={image} src={image} alt={alt} onLoad={onLoad} onError={onError} /></div> : <div className="upload-empty"><span className="upload-symbol" aria-hidden="true">↥</span><strong>Una imagen cuenta tu idea.</strong><p>Arrastra una imagen aquí o selecciónala desde tu equipo.</p><span>JPG, PNG, WEBP y formatos de imagen compatibles con tu navegador</span></div>}
    <input ref={input} className="admin-file-input" type="file" accept="image/*" onChange={(e) => select(e.target.files?.[0])} disabled={busy} aria-label="Seleccionar archivo de imagen" />
    <div className="upload-controls"><motion.button type="button" className="admin-secondary-button" disabled={busy} onClick={() => input.current?.click()} whileHover={{ y: -2 }} whileTap={{ scale: .98 }}>{busy ? 'Preparando imagen…' : image ? 'Reemplazar imagen' : 'Subir imagen'}</motion.button>{image && <button type="button" className="admin-image-clear" disabled={busy} onClick={onClear}>Quitar imagen</button>}</div>
    {fileName && <p className="upload-file-name">{fileName}</p>}
    {busy && <p role="status">Optimizando tu imagen…</p>}
    {error && <p className="admin-field-error" role="alert">{error}</p>}
  </div>
}
