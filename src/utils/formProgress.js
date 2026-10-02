export function getFormProgress(values, imageReady = false) {
  const hasText = (keys) => keys.some((key) => String(values[key] ?? '').trim().length > 0)
  const sections = [
    { number: '01', label: 'Tu idea', filled: hasText(['nombre', 'email', 'telefono', 'descripcion']) },
    { number: '02', label: 'Detalles', filled: hasText(['medidas', 'color', 'comentarios']) || (Number(values.cantidad) > 1) },
    { number: '03', label: 'Referencia', filled: Boolean(values.imagen && imageReady) },
  ]
  return { sections, percent: Math.round(sections.filter((section) => section.filled).length / sections.length * 100) }
}
