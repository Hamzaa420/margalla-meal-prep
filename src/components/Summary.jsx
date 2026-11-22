import { MIN_ORDER, FREE_DELIVERY_FROM } from '../rules/rules.js';

// Calculated summary (derived values only, nothing stored).
export default function Summary({ totals, method }) {
  return (
    <section className="summary" aria-label="Order summary">
      <h2>Summary</h2>
      <dl>
        <dt>Items</dt><dd>{totals.count}</dd>
        <dt>Subtotal</dt><dd>Rs {totals.subtotal}</dd>
        <dt>{method === 'delivery' ? 'Delivery fee' : 'Collection'}</dt><dd>{totals.fee ? `Rs ${totals.fee}` : 'Free'}</dd>
        <dt className="total">Total</dt><dd className="total">Rs {totals.total}</dd>
      </dl>
      {totals.belowMin && <p className="tag bad">Minimum order is Rs {MIN_ORDER}. Add Rs {totals.toMin} more.</p>}
      {method === 'delivery' && totals.fee > 0 && <p className="tag warn">Add Rs {totals.toFree} more for free delivery (from Rs {FREE_DELIVERY_FROM}).</p>}
    </section>
  );
}
