import test from 'node:test';
import assert from 'node:assert/strict';
import { checkQuantity } from '../src/rules/rules.js';

test('valid quantity (3) is accepted', () => {
  assert.equal(checkQuantity(3, 20).ok, true);
});
test('boundary: exactly 5 is accepted', () => {
  assert.equal(checkQuantity(5, 20).ok, true);
});
test('6 breaks the per-meal limit', () => {
  const r = checkQuantity(6, 20);
  assert.equal(r.ok, false);
  assert.match(r.message, /Maximum 5/);
});
test('quantity above remaining stock is rejected', () => {
  const r = checkQuantity(3, 2);
  assert.equal(r.ok, false);
  assert.match(r.message, /Only 2 left/);
});
test('zero is rejected', () => {
  assert.equal(checkQuantity(0, 20).ok, false);
});
