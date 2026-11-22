import { Link } from 'react-router-dom';

export default function Confirmation({ order }) {
  if (!order) return <div className="notice"><p>No recent order to show.</p><Link className="btn primary" to="/">Browse menu</Link></div>;
  return (
    <section>
      <h1>✅ Order confirmed (simulated)</h1>
      <p className="tag ok">Reference {order.ref}</p>
      <p>{order.method === 'delivery' ? `Delivery to ${order.area}` : 'Collection'} · {order.slot}</p>
      <ul>{order.items.map((i) => <li key={i.name}>{i.qty} × {i.name}</li>)}</ul>
      <p><strong>Total paid: Rs {order.totals.total}</strong> (fictional - no payment was taken)</p>
      <Link className="btn primary" to="/">Order again</Link>
    </section>
  );
}
