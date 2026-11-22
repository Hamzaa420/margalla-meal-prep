import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { loadMeals } from './api/loadMeals.js';
import { reconcile, calcTotals } from './rules/rules.js';
import Menu from './pages/Menu.jsx';
import MealDetails from './pages/MealDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import NotFound from './pages/NotFound.jsx';
import CartBar from './components/CartBar.jsx';

// Safe localStorage read with fallback.
const read = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

export default function App() {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [attempt, setAttempt] = useState(0);
  const [demo, setDemo] = useState({ fail: false, soldOut: false });
  const [cart, setCart] = useState(() => read('mm_cart', []));
  const [method, setMethod] = useState(() => read('mm_method', 'pickup'));
  const [order, setOrder] = useState(() => read('mm_order', null));

  // Load data asynchronously; cleanup ignores stale responses.
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    loadMeals({ fail: demo.fail })
      .then((data) => { if (!cancelled) { setMeals(data); setStatus('ready'); } })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [attempt, demo.fail]);

  // Persist selection and preference.
  useEffect(() => { localStorage.setItem('mm_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('mm_method', JSON.stringify(method)); }, [method]);
  useEffect(() => { localStorage.setItem('mm_order', JSON.stringify(order)); }, [order]);

  // Demo control: "changed availability" sells out m3.
  const liveMeals = useMemo(
    () => meals.map((m) => (demo.soldOut && m.id === 'm3' ? { ...m, stock: 0 } : m)),
    [meals, demo.soldOut]
  );
  const { lines, issues } = useMemo(
    () => (status === 'ready' ? reconcile(cart, liveMeals) : { lines: [], issues: [] }),
    [cart, liveMeals, status]
  );
  const totals = calcTotals(lines, method);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  // Callback props: all cart updates happen here (immutably).
  const setQty = (id, qty) =>
    setCart((prev) => (prev.some((l) => l.id === id)
      ? prev.map((l) => (l.id === id ? { ...l, qty } : l))
      : [...prev, { id, qty }]));
  const removeItem = (id) => setCart((prev) => prev.filter((l) => l.id !== id));
  const fixCart = () => setCart(reconcile(cart, liveMeals).fixed);
  const placeOrder = (details) => {
    // Simulated order: no name or phone is stored.
    setOrder({ ref: 'MM-' + Date.now().toString().slice(-6), ...details,
      items: lines.map((l) => ({ name: l.meal.name, qty: l.qty })), totals });
    setCart([]);
  };

  const shared = { meals: liveMeals, status, cart, lines, issues, totals, method, setMethod, setQty, removeItem, fixCart, retry: () => setAttempt((a) => a + 1) };

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <Link to="/" className="brand">🌿 Margalla Meal Prep</Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Menu</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
        </nav>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Menu {...shared} />} />
          <Route path="/items/:id" element={<MealDetails {...shared} />} />
          <Route path="/cart" element={<Cart {...shared} />} />
          <Route path="/checkout" element={<Checkout {...shared} placeOrder={placeOrder} />} />
          <Route path="/confirmation" element={<Confirmation order={order} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <CartBar count={cartCount} totals={totals} method={method} />
      <footer className="site-footer">
        <p>Student project - simulated orders only. No real payments or deliveries. Serving H-11, H-12, G-11, G-10, I-8, Islamabad.</p>
        <fieldset className="demo">
          <legend>Demo controls</legend>
          <label><input type="checkbox" checked={demo.fail} onChange={(e) => setDemo((d) => ({ ...d, fail: e.target.checked }))} /> Simulate loading failure</label>
          <label><input type="checkbox" checked={demo.soldOut} onChange={(e) => setDemo((d) => ({ ...d, soldOut: e.target.checked }))} /> Sell out Chicken Karahi Plate</label>
        </fieldset>
      </footer>
    </>
  );
}
