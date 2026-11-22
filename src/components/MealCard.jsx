import { Link } from 'react-router-dom';
import { checkQuantity } from '../rules/rules.js';

export default function MealCard({ meal, inCart, onAdd, hidden }) {
  const soldOut = meal.stock < 1;
  const next = checkQuantity(inCart + 1, meal.stock);
  return (
    <li className="card">
      <span className="emoji" role="img" aria-label={`${meal.name} illustration`}>{meal.emoji}</span>
      <h3><Link to={`/items/${meal.id}`}>{meal.name}</Link></h3>
      <p className="meta">{meal.category} · {meal.veg ? 'Vegetarian' : 'Non-veg'} · {meal.calories} kcal</p>
      <p className="price">Rs {meal.price}</p>
      <p className={soldOut ? 'tag bad' : meal.stock <= 5 ? 'tag warn' : 'tag ok'}>
        {soldOut ? 'Sold out' : `${meal.stock} left today`}
      </p>
      <button type="button" className="btn primary" disabled={soldOut || !next.ok} onClick={() => onAdd(meal.id, inCart + 1)}>
        {soldOut ? 'Unavailable' : next.ok ? (inCart ? `Add another (${inCart} in cart)` : 'Add to cart') : 'Limit reached'}
      </button>
      {!next.ok && !soldOut && <small className="warn">{next.message}</small>}
    </li>
  );
}
