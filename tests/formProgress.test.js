import test from 'node:test'
import assert from 'node:assert/strict'
import { getFormProgress } from '../src/utils/formProgress.js'
import { EMPTY_QUOTE, validateQuote } from '../src/context/quoteState.js'

test('progreso visual vacío no considera la cantidad predeterminada como datos añadidos', () => {
  assert.equal(getFormProgress(EMPTY_QUOTE).percent, 0)
  assert.equal(getFormProgress({ ...EMPTY_QUOTE, nombre: '   ' }).percent, 0)
})
test('progreso refleja secciones con información sin depender de su validez', () => {
  const values = { ...EMPTY_QUOTE, email: 'correo incompleto', color: 'Coral', imagen: '/reference.png' }
  assert.equal(getFormProgress(values).percent, 67)
  assert.equal(getFormProgress(values, true).percent, 100)
  assert.ok(validateQuote(values).email)
  assert.equal(getFormProgress({ ...EMPTY_QUOTE, cantidad: 2 }).sections[1].filled, true)
})
test('referencia opcional no bloquea un formulario válido ni modifica valores', () => {
  const values = { ...EMPTY_QUOTE, nombre: 'Ana', email: 'ana@example.com', descripcion: 'Maceta' }
  const before = structuredClone(values)
  assert.equal(getFormProgress(values).sections[2].filled, false)
  assert.deepEqual(validateQuote(values), {})
  assert.deepEqual(values, before)
})
