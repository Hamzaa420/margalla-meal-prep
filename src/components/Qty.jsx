import { checkQuantity } from '../rules/rules.js';

// Quantity stepper. Rule 1 limit is shown beside the control.
export default function Qty({ meal, qty, onChange }) {
  const next = checkQuantity(qty + 1, meal.stock);
  return (
    <div className="qty">
      <button type="button" aria-label={`Decrease ${meal.name}`} onClick={() => onChange(qty - 1)}>−</button>
      <output aria-live="polite">{qty}</output>
      <button type="button" aria-label={`Increase ${meal.name}`} disabled={!next.ok} onClick={() => onChange(qty + 1)}>+</button>
      <small className={next.ok ? '' : 'warn'}>{next.ok ? `Limit ${next.limit} per order` : next.message}</small>
    </div>
  );
}
