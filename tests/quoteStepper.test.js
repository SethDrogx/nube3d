import test from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_QUOTE } from '../src/context/quoteState.js'
import { getNextQuoteStep, getQuoteStepProgress, validateQuoteStep } from '../src/utils/quoteStepper.js'

const validIdea = { ...EMPTY_QUOTE, nombre: 'Prueba', email: 'prueba@example.com', descripcion: 'Maceta de prueba' }

test('paso 1 bloquea el avance e informa sus campos obligatorios', () => {
  const result = getNextQuoteStep(EMPTY_QUOTE, 0)
  assert.equal(result.step, 0)
  assert.deepEqual(Object.keys(result.errors), ['nombre', 'email', 'descripcion'])
})
test('paso 1 reutiliza la validación de correo y teléfono opcional', () => {
  assert.ok(validateQuoteStep({ ...validIdea, email: 'incorrecto' }, 0).email)
  assert.ok(validateQuoteStep({ ...validIdea, telefono: '123' }, 0).telefono)
  assert.deepEqual(validateQuoteStep(validIdea, 0), {})
})
test('avanza solo con campos válidos del paso actual sin alterar los datos', () => {
  const values = { ...validIdea, cantidad: 0, color: 'Coral', comentarios: 'Conservar' }
  const before = structuredClone(values)
  assert.equal(getNextQuoteStep(values, 0).step, 1)
  assert.equal(getNextQuoteStep(values, 1).step, 1)
  assert.ok(getNextQuoteStep(values, 1).errors.cantidad)
  assert.deepEqual(values, before)
})
test('paso 2 bloquea cantidad fraccionaria y permite detalles opcionales vacíos', () => {
  assert.equal(getNextQuoteStep({ ...validIdea, cantidad: 1.5 }, 1).step, 1)
  assert.equal(getNextQuoteStep(validIdea, 1).step, 2)
})
test('referencia opcional válida conserva el paso final y rechaza fuentes inválidas', () => {
  assert.deepEqual(getNextQuoteStep(validIdea, 2), { step: 2, errors: {} })
  assert.ok(validateQuoteStep({ ...validIdea, imagen: 'javascript:alert(1)' }, 2).imagen)
})
test('progreso refleja el paso real al avanzar y retroceder', () => {
  for (const step of [0, 1, 2, 1, 0]) {
    const progress = getQuoteStepProgress(step)
    assert.equal(progress.percent, [33, 67, 100][step])
    assert.equal(progress.sections.filter((section) => section.active).length, 1)
    assert.equal(progress.sections[step].active, true)
    assert.equal(progress.sections.filter((section) => section.completed).length, step)
  }
})
