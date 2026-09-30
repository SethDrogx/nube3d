import test from 'node:test'
import assert from 'node:assert/strict'
import { products } from '../src/data/products.js'
import { CART_STORAGE_KEY, cartReducer, getCartSummary, normalizeCart, readCart } from '../src/context/cartState.js'

const [first, second] = products
const add = (items, id = first.id) => cartReducer(items, { type: 'add', id })

test('adding the same product increments a single row without mutating previous state', () => {
  const initial = add([])
  const next = add(initial)
  assert.deepEqual(initial, [{ id: first.id, quantity: 1 }])
  assert.deepEqual(next, [{ id: first.id, quantity: 2 }])
  assert.equal(add(next, second.id).length, 2)
  assert.deepEqual(add(next, 'unknown'), next)
})

test('quantity controls target only the selected product and stop at one', () => {
  const items = add(add([]), second.id)
  const increased = cartReducer(items, { type: 'increase', id: first.id })
  assert.equal(increased[0].quantity, 2)
  assert.equal(increased[1].quantity, 1)
  const decreased = cartReducer(increased, { type: 'decrease', id: first.id })
  assert.deepEqual(decreased, items)
  assert.deepEqual(cartReducer(decreased, { type: 'decrease', id: first.id }), items)
})

test('remove and clear leave correct empty totals', () => {
  const items = add(add([]), second.id)
  assert.deepEqual(cartReducer(items, { type: 'remove', id: first.id }), [{ id: second.id, quantity: 1 }])
  const cleared = cartReducer(items, { type: 'clear' })
  assert.deepEqual(cleared, [])
  assert.deepEqual(getCartSummary(cleared), { cartItems: [], totalQuantity: 0, subtotal: 0, shipping: 0, total: 0 })
})

test('summary uses catalog data, counts units and calculates prices in cents', () => {
  const summary = getCartSummary(add(add(add([])), second.id))
  const expected = (Math.round(first.price * 100) * 2 + Math.round(second.price * 100)) / 100
  assert.equal(summary.totalQuantity, 3)
  assert.equal(summary.subtotal, expected)
  assert.equal(summary.shipping, 0)
  assert.equal(summary.total, expected)
  assert.deepEqual(summary.cartItems[0], { ...first, quantity: 2 })
})

test('persisted references restore quantities and always use current catalog details', () => {
  const stored = JSON.stringify([{ id: first.id, quantity: 3, name: 'stale', price: 0 }])
  const restored = readCart({ getItem: (key) => { assert.equal(key, CART_STORAGE_KEY); return stored } })
  assert.deepEqual(restored, [{ id: first.id, quantity: 3 }])
  assert.equal(getCartSummary(restored).cartItems[0].price, first.price)
})

test('invalid or unavailable storage safely starts empty', () => {
  for (const stored of [null, '{broken', '{}', 'null', '42']) {
    assert.deepEqual(readCart({ getItem: () => stored }), [])
  }
  assert.deepEqual(readCart({ getItem: () => { throw new Error('Storage blocked') } }), [])
})

test('restoration removes invalid records and merges duplicate product references', () => {
  assert.deepEqual(normalizeCart([
    null, {}, { id: 'unknown', quantity: 1 }, { id: first.id, quantity: -1 },
    { id: first.id, quantity: 0 }, { id: first.id, quantity: 1.5 },
    { id: first.id, quantity: '2' }, { id: first.id, quantity: Infinity },
    { id: first.id, quantity: 2 }, { id: first.id, quantity: 3 },
  ]), [{ id: first.id, quantity: 5 }])
})
