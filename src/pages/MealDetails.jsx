import { useParams, Link, useNavigate } from 'react-router-dom';
import Qty from '../components/Qty.jsx';
import { MIN_ORDER, DELIVERY_FEE, FREE_DELIVERY_FROM } from '../rules/rules.js';

export default function MealDetails({ meals, status, cart, setQty, removeItem, retry }) {
  const { id } = useParams();
  const navigate = useNavigate();
  if (status === 'loading') return <p role="status" className="notice">Loading…</p>;
  if (status === 'error') return <div className="notice bad" role="alert"><p>Could not load this meal.</p><button type="button" className="btn primary" onClick={retry}>Retry</button></div>;
  const meal = meals.find((m) => m.id === id);
  if (!meal) return (
    <div className="notice"><h1>Meal not found</h1><p>“{id}” is not on our menu.</p><Link className="btn primary" to="/">Back to menu</Link></div>
  );
  const qty = cart.find((l) => l.id === id)?.qty || 0;
  const soldOut = meal.stock < 1;
  return (
    <article className="details">
      <button type="button" className="btn" onClick={() => navigate(-1)}>← Back</button>
      <span className="emoji big" role="img" aria-label={`${meal.name} illustration`}>{meal.emoji}</span>
      <h1>{meal.name}</h1>
      <p className="price">Rs {meal.price}</p>
      <p>{meal.desc}</p>
      <ul className="facts">
        <li><strong>Type:</strong> {meal.veg ? 'Vegetarian' : 'Contains meat'}</li>
        <li><strong>Calories:</strong> {meal.calories} kcal</li>
        <li><strong>Prep time:</strong> {meal.prep}</li>
        <li><strong>Ingredients:</strong> {meal.ingredients}</li>
        <li><strong>Availability:</strong> {soldOut ? 'Sold out' : `${meal.stock} left today`}</li>
        <li><strong>Charges:</strong> Delivery Rs {DELIVERY_FEE} (free from Rs {FREE_DELIVERY_FROM}); min order Rs {MIN_ORDER}; collection is free.</li>
      </ul>
      {soldOut ? <p className="tag bad">Sold out - try another meal.</p>
        : qty === 0 ? <button type="button" className="btn primary" onClick={() => setQty(id, 1)}>Add to cart</button>
        : <>
            <Qty meal={meal} qty={qty} onChange={(n) => (n < 1 ? removeItem(id) : setQty(id, n))} />
            <Link className="btn primary" to="/cart">Go to cart</Link>
          </>}
    </article>
  );
}
