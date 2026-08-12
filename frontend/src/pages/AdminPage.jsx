import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../config';

function money(n) {
  return `S/ ${Number(n).toFixed(2)}`;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-card">
        <h2>Panel de pedidos</h2>
        <p className="admin-sub">Acceso para el equipo de ventas</p>
        <form onSubmit={submit}>
          <label>
            Usuario
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu usuario"
              autoComplete="username"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
        <Link className="admin-back" to="/">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('colchoneria_token')}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('No autorizado.');
        return res.json();
      })
      .then(setOrders)
      .catch(() => setError('No se pudieron cargar los pedidos.'));
  }, []);

  const totalVentas = orders
    ? Number(orders.reduce((acc, o) => acc + o.total, 0).toFixed(2))
    : 0;

  return (
    <div className="admin-panel">
      <header className="admin-head">
        <div>
          <h1>Pedidos recibidos</h1>
          <p>Bienvenido, {user?.name || 'vendedor'}</p>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-outline" to="/">
            Ver tienda
          </Link>
          <button className="btn btn-danger" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {error ? (
        <p className="loading error">{error}</p>
      ) : orders === null ? (
        <p className="loading">Cargando pedidos…</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="success-icon">📭</div>
          <h3>Aún no hay pedidos</h3>
          <p>Cuando un cliente confirme su compra, el pedido aparecerá aquí.</p>
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="stat">
              <span>Pedidos</span>
              <strong>{orders.length}</strong>
            </div>
            <div className="stat">
              <span>Ventas totales</span>
              <strong>{money(totalVentas)}</strong>
            </div>
          </div>
          <div className="orders-list">
            {orders.map((o) => (
              <div className="order-card" key={o.id}>
                <div className="order-top">
                  <strong>{o.id}</strong>
                  <span className="order-date">{formatDate(o.createdAt)}</span>
                </div>
                <div className="order-items">
                  {o.items.map((it, i) => (
                    <div className="order-item" key={i}>
                      <span>
                        {it.name}
                        {it.thickness ? ` (${it.thickness})` : ''} — {it.size}
                      </span>
                      <span>
                        {it.qty} × {money(it.unitPrice)}
                      </span>
                      <strong>{money(it.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-foot">
                  <div className="order-customer">
                    <span>
                      👤 {o.customer.name} · 📞 {o.customer.phone}
                    </span>
                    {o.customer.address && <span>🏠 {o.customer.address}</span>}
                    {o.customer.notes && <span>📝 {o.customer.notes}</span>}
                  </div>
                  <div className="order-total">
                    Total: <strong>{money(o.total)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { token } = useAuth();
  return token ? <OrdersPanel /> : <LoginForm />;
}
