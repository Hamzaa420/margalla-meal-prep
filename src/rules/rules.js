// Business rules - plain JS so they can be tested with node:test.

// RULE 1 (capacity): max 5 portions of one meal per order, and never more than today's stock.
export const MAX_PER_ITEM = 5;
export function checkQuantity(qty, stock = Infinity, max = MAX_PER_ITEM) {
  const limit = Math.min(max, stock);
  if (!Number.isInteger(qty) || qty < 1) return { ok: false, limit, message: 'Quantity must be at least 1.' };
  if (qty > limit) {
    return { ok: false, limit, message: stock < max ? `Only ${stock} left today.` : `Maximum ${max} per meal per order.` };
  }
  return { ok: true, limit, message: '' };
}

// RULE 2 (eligibility): delivery only to served sectors. Collection is allowed from anywhere.
export const SERVED_AREAS = ['H-11', 'H-12', 'G-11', 'G-10', 'I-8'];
export const ALL_AREAS = [...SERVED_AREAS, 'Bahria Town', 'DHA Phase 2', 'Gulberg'];
export function checkDelivery(method, area) {
  if (method !== 'delivery') return { ok: true, message: '' };
  if (!area) return { ok: false, message: 'Choose a delivery area.' };
  if (!SERVED_AREAS.includes(area)) return { ok: false, message: `We do not deliver to ${area}. Choose a served sector or switch to collection.` };
  return { ok: true, message: '' };
}

// RULE 3 (pricing): min order Rs 600; delivery fee Rs 150, free from Rs 2000; collection has no fee.
export const MIN_ORDER = 600;
export const DELIVERY_FEE = 150;
export const FREE_DELIVERY_FROM = 2000;
export function calcTotals(lines, method) {
  const subtotal = lines.reduce((s, l) => s + l.meal.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const fee = method === 'delivery' && subtotal > 0 && subtotal < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return {
    count, subtotal, fee, total: subtotal + fee,
    belowMin: subtotal < MIN_ORDER,
    toMin: Math.max(0, MIN_ORDER - subtotal),
    toFree: Math.max(0, FREE_DELIVERY_FROM - subtotal)
  };
}

// Check saved/restored cart against current data and rules. Returns joined lines, issues and a repaired cart.
export function reconcile(cart, meals) {
  const lines = [], issues = [], fixed = [];
  for (const { id, qty } of cart) {
    const meal = meals.find((m) => m.id === id);
    if (!meal) { issues.push(`An item in your saved cart (${id}) is no longer on the menu.`); continue; }
    if (meal.stock < 1) { issues.push(`${meal.name} is sold out.`); continue; }
    const r = checkQuantity(qty, meal.stock);
    if (!r.ok) issues.push(`${meal.name}: ${r.message} Quantity reduced to ${r.limit}.`);
    lines.push({ meal, qty });
    fixed.push({ id, qty: r.ok ? qty : r.limit });
  }
  return { lines, issues, fixed };
}
