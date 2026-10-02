export const QUICK_ACTIONS = [
  { intent: 'SEARCH', label: 'Buscar un producto' },
  { intent: 'CUSTOM', label: 'Quiero una impresión personalizada' },
  { intent: 'PRICES', label: 'Consultar precios' },
  { intent: 'QUOTE', label: 'Consultar mi cotización' },
  { intent: 'DELIVERY', label: 'Tiempo de entrega' },
  { intent: 'PAYMENT', label: 'Métodos de pago' },
  { intent: 'CART', label: 'Ver mi carrito' },
  { intent: 'CONTACT', label: 'Hablar con una persona' },
]
export const RESPONSES = {
  greeting: '¡Hola! Soy el asistente de Nube 3D. ¿Qué estás buscando hoy?',
  search: '¿Qué producto buscas? Escribe su nombre, categoría o una descripción.',
  custom: 'Claro. Puedes enviarnos tu idea, medidas, color y una imagen de referencia.',
  prices: 'Los precios dependen del producto y del nivel de personalización.',
  quote: 'Claro. Escribe tu folio, por ejemplo COT-20261001-0001.',
  missingQuote: 'No encontré una cotización con ese folio.',
  missingProducts: 'No encontré productos con esa búsqueda. Puedes ver todo el catálogo.',
  delivery: 'El tiempo depende del tamaño, material y complejidad del diseño. Como referencia, una impresión sencilla puede tardar entre 2 y 5 días hábiles. Es una estimación, no una garantía. Para un proyecto personalizado podemos darte un tiempo más preciso mediante una cotización.',
  payment: 'Los métodos de pago se confirmarán al aprobar tu cotización o pedido. El pago en línea todavía no está habilitado en esta versión.',
  contact: 'Por ahora el contacto directo todavía no está habilitado.',
  fallback: 'No estoy seguro de haber entendido. Puedo ayudarte con productos, cotizaciones, entregas o tu carrito.',
}
