import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Summary from '../components/Summary.jsx';
import { checkDelivery, ALL_AREAS } from '../rules/rules.js';

const SLOTS = ['12:00 - 1:00 PM', '1:00 - 2:00 PM', '6:00 - 7:00 PM'];

// Pure validation function: returns an object of field -> message.
function validate(f, method) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!/^03\d{9}$/.test(f.phone)) e.phone = 'Phone must be 11 digits starting with 03, e.g. 03001234567.';
  const d = checkDelivery(method, f.area);
  if (!d.ok) e.area = d.message;
  if (!f.slot) e.slot = 'Choose a time slot.';
  return e;
}

export default function Checkout({ lines, issues, totals, method, setMethod, placeOrder, status }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', area: '', slot: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (status !== 'ready' || lines.length === 0) return <div className="notice"><p>Nothing to check out yet.</p><Link className="btn primary" to="/">Browse menu</Link></div>;
  if (issues.length > 0 || totals.belowMin) return <div className="notice bad" role="alert"><p>Your cart needs attention before checkout.</p><Link className="btn primary" to="/cart">Go to cart</Link></div>;

  // Object update without mutation; valid input is kept, only errors refresh.
  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (submitted) setErrors(validate(next, method));
  };
  const onMethod = (m) => { setMethod(m); if (submitted) setErrors(validate(form, m)); };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form, method);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    placeOrder({ method, area: method === 'delivery' ? form.area : 'Collection', slot: form.slot });
    navigate('/confirmation');
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={onChange} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} {...props} />
      {errors[name] && <p id={`${name}-err`} className="error">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <h1>Checkout</h1>
      <p className="notice">Simulated checkout - no real payment is taken and your name/phone are not saved.</p>
      <form onSubmit={onSubmit} noValidate>
        {Object.keys(errors).length > 0 && <p className="error" role="alert">Please fix {Object.keys(errors).length} field(s) below. Your other answers are kept.</p>}
        {field('name', 'Full name', { autoComplete: 'name' })}
        {field('phone', 'Phone number', { inputMode: 'numeric', placeholder: '03001234567' })}
        <fieldset className="method">
          <legend>Order type</legend>
          <label><input type="radio" name="m" checked={method === 'pickup'} onChange={() => onMethod('pickup')} /> Collection</label>
          <label><input type="radio" name="m" checked={method === 'delivery'} onChange={() => onMethod('delivery')} /> Delivery</label>
        </fieldset>
        {method === 'delivery' && (
          <div className="field">
            <label htmlFor="area">Delivery area</label>
            <select id="area" name="area" value={form.area} onChange={onChange} aria-invalid={!!errors.area} aria-describedby="area-hint">
              <option value="">Select area…</option>
              {ALL_AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
            <small id="area-hint">We deliver to H-11, H-12, G-11, G-10 and I-8.</small>
            {errors.area && <p className="error">{errors.area}</p>}
          </div>
        )}
        <div className="field">
          <label htmlFor="slot">Time slot</label>
          <select id="slot" name="slot" value={form.slot} onChange={onChange} aria-invalid={!!errors.slot}>
            <option value="">Select slot…</option>
            {SLOTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          {errors.slot && <p className="error">{errors.slot}</p>}
        </div>
        <Summary totals={totals} method={method} />
        <button type="submit" className="btn primary">Place simulated order</button>
      </form>
    </>
  );
}
