import { Link } from 'react-router-dom';
import { MIN_ORDER, FREE_DELIVERY_FROM, DELIVERY_FEE } from '../rules/rules.js';

// Sticky bar: shows fees and minimum BEFORE checkout (Decision 2).
export default function CartBar({ count, totals, method }) {
  if (count === 0) return null;
  const feeText = method === 'delivery'
    ? (totals.fee ? `Delivery Rs ${DELIVERY_FEE}` : 'Free delivery')
    : 'Collection: no fee';
  return (
    <div className="cartbar" role="region" aria-label="Cart summary">
      <div>
        <strong>{count} item{count > 1 ? 's' : ''} · Rs {totals.total}</strong>
        <small>{feeText} · min order Rs {MIN_ORDER} · free delivery from Rs {FREE_DELIVERY_FROM}</small>
        {totals.belowMin && <small className="warn">Add Rs {totals.toMin} more to order.</small>}
      </div>
      <Link className="btn primary" to="/cart">View cart</Link>
    </div>
  );
}
