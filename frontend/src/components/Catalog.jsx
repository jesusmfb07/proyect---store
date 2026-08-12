import React from 'react';
import ProductCard from './ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'resortes', label: 'Resortes Paraíso' },
  { id: 'espumas', label: 'Espumas Zebra' },
];

export default function Catalog({ products, currency, category, setCategory }) {
  const filtered =
    category === 'all' ? products : products.filter((p) => p.category === category);

  return (
    <section id="catalogo" className="catalog">
      <div className="catalog-inner">
        <h2>Nuestros colchones</h2>
        <p className="catalog-sub">
          Elige la medida que necesites. Los precios incluyen IGV y se coordina el
          envío por WhatsApp.
        </p>
        <div className="tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`tab ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} currency={currency} />
          ))}
        </div>
      </div>
    </section>
  );
}
