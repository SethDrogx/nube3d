import { validateQuote } from '../context/quoteState.js'

export const QUOTE_STEPS = [
  { number: '01', label: 'Tu idea', fields: ['nombre', 'email', 'telefono', 'descripcion'] },
  { number: '02', label: 'Detalles', fields: ['medidas', 'color', 'cantidad', 'comentarios'] },
  { number: '03', label: 'Referencia', fields: ['imagen'] },
]

export function validateQuoteStep(values, step) {
  const errors = validateQuote(values)
  return Object.fromEntries(QUOTE_STEPS[step].fields.filter((key) => errors[key]).map((key) => [key, errors[key]]))
}

export function getNextQuoteStep(values, step) {
  const errors = validateQuoteStep(values, step)
  return { step: Object.keys(errors).length ? step : Math.min(step + 1, QUOTE_STEPS.length - 1), errors }
}

export function getQuoteStepProgress(step) {
  return { percent: Math.round((step + 1) / QUOTE_STEPS.length * 100), sections: QUOTE_STEPS.map((section, index) => ({ ...section, active: index === step, completed: index < step })) }
}
