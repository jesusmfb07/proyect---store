import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { money, oldPrice } from '../config';

export default function ProductModal({ product, onClose }) {
  const { dispatch } = useCart();
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSize(product ? Object.keys(product.sizes)[0] : '');
    setAdded(false);
  }, [product]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!product) return null;

  const price = product.sizes[size] ?? product.sizes[Object.keys(product.sizes)[0]];

  const addToCart = () => {
    dispatch({
      type: 'ADD',
      item: {
        productId: product.id,
        name: product.name,
        size,
        qty: 1,
        unitPrice: price,
        image: product.image,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="overlay pm-overlay open" onClick={onClose}>
      <div className="pmodal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn pm-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <div className="pm-img">
          <span className="oferta-badge oferta-lg">
            <span className="oferta-text">OFERTA</span>
          </span>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="pm-body">
          <span className="tag">{product.brand}</span>
          <h2>{product.name}</h2>
          <p className="pm-type">{product.type}</p>
          <p className="pm-desc">{product.description}</p>
          <div className="sizes">
            {Object.keys(product.sizes).map((s) => (
              <button
                key={s}
                className={`size-btn ${size === s ? 'active' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="pm-price-row">
            <span className="pm-price">{money(price)}</span>
            <span className="old-price">Antes: {money(oldPrice(price))}</span>
          </div>
          <button className={`btn btn-primary ${added ? 'added' : ''}`} onClick={addToCart}>
            {added ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
