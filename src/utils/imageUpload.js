const DEFAULT_MAX_DIMENSION = 1200
const DEFAULT_MAX_DATA_URL_BYTES = 280 * 1024
const DEFAULT_QUALITY_STEPS = [0.86, 0.78, 0.7, 0.62, 0.54]

export function isValidImageSource(value) {
  if (!value) return true
  if (value.startsWith('/')) return true
  if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function isSupportedImageFile(file) {
  return Boolean(file && typeof file.type === 'string' && file.type.startsWith('image/'))
}

function dataUrlByteLength(dataUrl) {
  const base64 = String(dataUrl).split(',')[1] || ''
  return Math.ceil((base64.length * 3) / 4)
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('El navegador no pudo procesar este formato de imagen. Intenta con JPG, PNG o WEBP.'))
    image.src = dataUrl
  })
}

function canvasToDataUrl(canvas, quality) {
  const webp = canvas.toDataURL('image/webp', quality)
  if (webp.startsWith('data:image/webp')) return webp
  return canvas.toDataURL('image/jpeg', quality)
}

export async function prepareImageFile(file, options = {}) {
  if (!isSupportedImageFile(file)) throw new Error('Selecciona un archivo de imagen válido.')

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_DATA_URL_BYTES
  const sourceDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(sourceDataUrl)

  const naturalWidth = image.naturalWidth || image.width
  const naturalHeight = image.naturalHeight || image.height
  const longestSide = Math.max(naturalWidth, naturalHeight)
  const scale = longestSide > maxDimension ? maxDimension / longestSide : 1
  let width = Math.max(1, Math.round(naturalWidth * scale))
  let height = Math.max(1, Math.round(naturalHeight * scale))

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('No se pudo preparar la imagen en este navegador.')

  for (let resizeAttempt = 0; resizeAttempt < 3; resizeAttempt += 1) {
    canvas.width = width
    canvas.height = height
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    for (const quality of DEFAULT_QUALITY_STEPS) {
      const dataUrl = canvasToDataUrl(canvas, quality)
      if (dataUrlByteLength(dataUrl) <= maxBytes) {
        return {
          dataUrl,
          width,
          height,
          originalName: file.name || 'imagen',
          size: dataUrlByteLength(dataUrl),
        }
      }
    }

    width = Math.max(1, Math.round(width * 0.78))
    height = Math.max(1, Math.round(height * 0.78))
  }

  throw new Error('La imagen sigue siendo demasiado pesada. Intenta con otra foto o recórtala antes de subirla.')
}
