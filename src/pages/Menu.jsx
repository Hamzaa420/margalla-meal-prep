import { useSearchParams, Link } from 'react-router-dom';
import MealCard from '../components/MealCard.jsx';
import { MIN_ORDER, DELIVERY_FEE, FREE_DELIVERY_FROM } from '../rules/rules.js';

const CATS = ['All', 'Rice', 'Protein', 'Wraps', 'Bundles'];

export default function Menu({ meals, status, cart, setQty, retry }) {
  // Filters live in the URL so Back/refresh keeps them (Decision 1).
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const cat = params.get('cat') || 'All';
  const veg = params.get('veg') === '1';
  const sort = params.get('sort') || 'name';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'All' && value !== 'name') next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  if (status === 'loading') return <p role="status" className="notice">Loading menu…</p>;
  if (status === 'error') return (
    <div className="notice bad" role="alert">
      <p>We could not load the menu.</p>
      <button type="button" className="btn primary" onClick={retry}>Retry</button>
    </div>
  );
  if (meals.length === 0) return <p className="notice">No meals are on the menu today. Please check back tomorrow.</p>;

  const term = q.trim().toLowerCase();
  const results = meals
    .filter((m) => cat === 'All' || m.category === cat)
    .filter((m) => !veg || m.veg)
    .filter((m) => !term || `${m.name} ${m.desc} ${m.ingredients}`.toLowerCase().includes(term))
    .sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : a.name.localeCompare(b.name));

  const qtyOf = (id) => cart.find((l) => l.id === id)?.qty || 0;
  const clear = () => setParams({}, { replace: true });

  return (
    <>
      <h1>Fresh student meals, Islamabad</h1>
      <p className="lead">Order meals for collection or delivery. Min order Rs {MIN_ORDER} · delivery Rs {DELIVERY_FEE}, free from Rs {FREE_DELIVERY_FROM}.</p>
      <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <label>Search<input type="search" value={q} placeholder="e.g. chicken, daal" onChange={(e) => update('q', e.target.value)} /></label>
        <label>Category
          <select value={cat} onChange={(e) => update('cat', e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Sort by
          <select value={sort} onChange={(e) => update('sort', e.target.value)}>
            <option value="name">Name</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
          </select>
        </label>
        <label className="check"><input type="checkbox" checked={veg} onChange={(e) => update('veg', e.target.checked ? '1' : '')} /> Vegetarian only</label>
      </form>
      <p role="status">{results.length} meal{results.length !== 1 ? 's' : ''} shown</p>
      {results.length === 0 ? (
        <div className="notice">
          <h2>No meals match your search</h2>
          <p>Try a different word, remove the vegetarian filter, or browse everything.</p>
          <button type="button" className="btn primary" onClick={clear}>Clear all filters</button>{' '}
          <Link className="btn" to="/?cat=Bundles">See bundles</Link>
        </div>
      ) : (
        <ul className="grid">
          {results.map((m) => <MealCard key={m.id} meal={m} inCart={qtyOf(m.id)} onAdd={setQty} />)}
        </ul>
      )}
    </>
  );
}
