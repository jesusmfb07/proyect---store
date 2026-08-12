import React from 'react';
import { useCart } from '../context/CartContext';

function money(n, currency) {
  return `${currency} ${Number(n).toFixed(2)}`;
}

export default function CartDrawer({ open, currency, onClose, onCheckout }) {
  const { items, total, dispatch } = useCart();

  return (
    <div className={`overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h3>Tu carrito</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {items.length === 0 ? (
          <p className="empty">El carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.key}>
                  <div className="cart-item-info">
                    <strong>
                      {item.name}
                      {item.thickness ? ` (${item.thickness})` : ''}
                    </strong>
                    <span>{item.size}</span>
                    <span>
                      {money(item.unitPrice, currency)} c/u
                    </span>
                  </div>
                  <div className="qty">
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'SET_QTY',
                          key: item.key,
                          qty: item.qty - 1,
                        })
                      }
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'SET_QTY',
                          key: item.key,
                          qty: item.qty + 1,
                        })
                      }
                    >
                      +
                    </button>
                    <button
                      className="remove"
                      onClick={() => dispatch({ type: 'REMOVE', key: item.key })}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="total">
                <span>Total</span>
                <strong>{money(total, currency)}</strong>
              </div>
              <button className="btn btn-primary" onClick={onCheckout}>
                Continuar
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
