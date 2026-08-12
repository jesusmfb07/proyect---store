import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function money(n, currency) {
  return `${currency} ${Number(n).toFixed(2)}`;
}

export default function ProductCard({ product, currency }) {
  const { dispatch } = useCart();
  const sizeNames = Object.keys(product.sizes);
  const [size, setSize] = useState(sizeNames[0]);
  const [added, setAdded] = useState(false);

  const price = product.sizes[size];
  const discount = product.discount || 0;
  const oldPrice = Number((price + discount).toFixed(2));

  const description =
    product.category === 'resortes'
      ? 'Sistema de resortes de alto rendimiento para un soporte firme y duradero.'
      : 'Espuma de alta densidad que se adapta a tu cuerpo y mantiene su forma.';

  const addToCart = () => {
    dispatch({
      type: 'ADD',
      item: {
        productId: product.id,
        name: product.name,
        thickness: product.thickness,
        size,
        qty: 1,
        unitPrice: price,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card">
      <div className="card-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && (
          <span className="discount-badge">-{currency} {discount}</span>
        )}
      </div>
      <div className="card-body">
        <span className="tag">{product.brand}</span>
        <h3>{product.name}</h3>
        {product.thickness && <span className="thickness">Altura {product.thickness}</span>}
        <p className="type">{product.type}</p>
        <p className="desc">{description}</p>
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
          {discount > 0 && <span className="old-price">{money(oldPrice, currency)}</span>}
          <span className="price">{money(price, currency)}</span>
        </div>
        <button className={`btn btn-primary ${added ? 'added' : ''}`} onClick={addToCart}>
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
