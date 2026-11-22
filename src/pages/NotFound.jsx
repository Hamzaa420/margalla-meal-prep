import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="notice"><h1>Page not found</h1><p>That address does not exist.</p><Link className="btn primary" to="/">Go to menu</Link></div>;
}
