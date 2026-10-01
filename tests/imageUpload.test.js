import test from 'node:test'
import assert from 'node:assert/strict'
import { isSupportedImageFile, isValidImageSource } from '../src/utils/imageUpload.js'

test('accepts URL, local paths and image data URLs as product image sources', () => {
  assert.equal(isValidImageSource('https://example.com/foto.jpg'), true)
  assert.equal(isValidImageSource('/placeholder.jpg'), true)
  assert.equal(isValidImageSource('data:image/webp;base64,AAAA'), true)
  assert.equal(isValidImageSource('javascript:alert(1)'), false)
  assert.equal(isValidImageSource('texto-no-url'), false)
})

test('accepts only files declared as images', () => {
  assert.equal(isSupportedImageFile({ type: 'image/jpeg' }), true)
  assert.equal(isSupportedImageFile({ type: 'image/png' }), true)
  assert.equal(isSupportedImageFile({ type: 'application/pdf' }), false)
  assert.equal(isSupportedImageFile(null), false)
})
