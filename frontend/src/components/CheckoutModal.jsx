import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { money, waNumberOnly, SITE_NAME, SITE_ADDRESS } from '../config';
import { STORE_CONFIG } from '../data/products';

export default function CheckoutModal({ open, onClose }) {
  const { items, total, dispatch } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const lines = [];
    lines.push(`🛒 *NUEVO PEDIDO - ${SITE_NAME}*`);
    lines.push(`📅 ${new Date().toLocaleString('es-PE')}`);
    if (SITE_ADDRESS) lines.push(`📍 ${SITE_ADDRESS}`);
    lines.push('-----------------------------------');
    items.forEach((item, i) => {
      lines.push(
        `${i + 1}. ${item.name} - ${item.size}\n   Cantidad: ${item.qty} x ${money(item.unitPrice)} = ${money(item.unitPrice * item.qty)}`
      );
    });
    lines.push('-----------------------------------');
    lines.push(`💰 *TOTAL: ${money(total)}*`);
    lines.push('-----------------------------------');
    lines.push(`👤 *Nombre:* ${form.name}`);
    lines.push(`📞 *Teléfono:* ${form.phone}`);
    lines.push(`🏠 *Dirección:* ${form.address || 'Recoger en tienda'}`);
    if (form.notes) lines.push(`📝 *Notas:* ${form.notes}`);
    lines.push(`💳 *Método de pago:* Yape`);

    const url = `https://wa.me/${waNumberOnly()}?text=${encodeURIComponent(lines.join('\n'))}`;

    dispatch({ type: 'CLEAR' });
    setDone(true);
    setForm({ name: '', phone: '', address: '', notes: '' });
    setTimeout(() => window.open(url, '_blank'), 300);
  };

  const close = () => {
    setDone(false);
    onClose();
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
              Total a pagar: <strong>{money(total)}</strong>
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
              <button className="btn btn-primary">Enviar pedido por WhatsApp</button>
              <p className="hint">
                Tu pedido se enviará a nuestro WhatsApp ({STORE_CONFIG.whatsappNumber}). Ahí te
                confirmaremos la disponibilidad, el costo de envío y el pago por Yape.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
