import { Link } from 'react-router-dom';
import Qty from '../components/Qty.jsx';
import Summary from '../components/Summary.jsx';

export default function Cart({ status, cart, lines, issues, totals, method, setMethod, setQty, removeItem, fixCart, retry }) {
  if (status === 'loading') return <p role="status" className="notice">Loading your cart…</p>;
  if (status === 'error') return <div className="notice bad" role="alert"><p>Could not load menu data to check your cart.</p><button type="button" className="btn primary" onClick={retry}>Retry</button></div>;
  if (cart.length === 0) return <div className="notice"><h1>Your cart is empty</h1><p>Pick a few meals to get started.</p><Link className="btn primary" to="/">Browse menu</Link></div>;
  return (
    <>
      <h1>Your cart</h1>
      {issues.length > 0 && (
        <div className="notice bad" role="alert">
          <h2>Some items need attention</h2>
          <ul>{issues.map((i) => <li key={i}>{i}</li>)}</ul>
          <button type="button" className="btn primary" onClick={fixCart}>Fix my cart</button>
        </div>
      )}
      <ul className="lines">
        {lines.map(({ meal, qty }) => (
          <li key={meal.id}>
            <div><Link to={`/items/${meal.id}`}>{meal.emoji} {meal.name}</Link><br /><small>Rs {meal.price} each · Rs {meal.price * qty}</small></div>
            <Qty meal={meal} qty={qty} onChange={(n) => (n < 1 ? removeItem(meal.id) : setQty(meal.id, n))} />
            <button type="button" className="btn" onClick={() => removeItem(meal.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <fieldset className="method">
        <legend>How do you want your order?</legend>
        <label><input type="radio" name="method" checked={method === 'pickup'} onChange={() => setMethod('pickup')} /> Collection (free)</label>
        <label><input type="radio" name="method" checked={method === 'delivery'} onChange={() => setMethod('delivery')} /> Delivery (Rs 150, free from Rs 2000)</label>
      </fieldset>
      <Summary totals={totals} method={method} />
      {issues.length > 0 || totals.belowMin
        ? <button type="button" className="btn primary" disabled>Checkout unavailable - see messages above</button>
        : <Link className="btn primary" to="/checkout">Continue to checkout</Link>}
    </>
  );
}
