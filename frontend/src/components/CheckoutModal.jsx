import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../config';

export default function CheckoutModal({ open, currency, onClose }) {
  const { items, total, dispatch } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError('');
    setSending(true);
    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear el pedido.');
      dispatch({ type: 'CLEAR' });
      setDone(true);
      setTimeout(() => window.open(data.whatsappUrl, '_blank'), 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    if (!sending) {
      setDone(false);
      setError('');
      onClose();
    }
  };

  return (
    <div className={`overlay ${open ? 'open' : ''}`} onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="success">
            <div className="success-icon">✅</div>
            <h3>¡Pedido enviado con éxito!</h3>
            <p>
              Tu solicitud ya fue enviada a nuestro WhatsApp. Te contactaremos para
              confirmar la entrega y coordinar el pago por <strong>Yape</strong>.
            </p>
            <button className="btn btn-primary" onClick={close}>
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="modal-head">
              <h3>Finalizar pedido</h3>
              <button className="close-btn" onClick={close}>
                ✕
              </button>
            </div>
            <div className="modal-total">
              Total a pagar: <strong>{currency} {Number(total).toFixed(2)}</strong>
              <span className="modal-total-note">Pago por Yape</span>
            </div>
            <form onSubmit={submit}>
              <label>
                Nombre completo *
                <input
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ej: María Pérez"
                />
              </label>
              <label>
                Teléfono / WhatsApp *
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="Ej: 987 654 321"
                />
              </label>
              <label>
                Dirección de entrega
                <input
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Distrito, dirección, referencia…"
                />
              </label>
              <label>
                Notas (opcional)
                <textarea
                  rows="2"
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Ej: entregar después de las 5pm"
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn btn-primary" disabled={sending}>
                {sending ? 'Enviando…' : 'Enviar pedido por WhatsApp'}
              </button>
              <p className="hint">
                Tu pedido se enviará a nuestro WhatsApp. Ahí te confirmaremos la
                disponibilidad, el costo de envío y el pago por Yape.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
