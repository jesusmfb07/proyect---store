import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { money, oldPrice } from '../config';

export default function ProductCard({ product, onSelect }) {
  const { dispatch } = useCart();
  const sizeNames = Object.keys(product.sizes);
  const [size, setSize] = useState(sizeNames[0]);
  const [added, setAdded] = useState(false);

  const price = product.sizes[size];

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
    <div className="card">
      <button className="card-img-btn" onClick={() => onSelect(product)} aria-label={`Ver ${product.name}`}>
        <div className="card-img-wrap">
          <span className="oferta-badge">
            <span className="oferta-text">OFERTA</span>
          </span>
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="zoom-hint">🔍 Ver detalle</span>
        </div>
      </button>
      <div className="card-body">
        <span className="tag">{product.brand}</span>
        <h3>{product.name}</h3>
        <p className="type">{product.type}</p>
        <div className="sizes">
          {sizeNames.map((s) => (
            <button
              key={s}
              className={`size-btn ${size === s ? 'active' : ''}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="price-row">
          <span className="price">{money(price)}</span>
          <span className="old-price">Antes: {money(oldPrice(price))}</span>
        </div>
        <button className={`btn btn-primary ${added ? 'added' : ''}`} onClick={addToCart}>
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
