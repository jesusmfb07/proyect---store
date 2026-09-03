import React from 'react';
import ProductCard from './ProductCard';

export default function Catalog({ products, category, setCategory, onSelect }) {
  const brands = ['all', ...Array.from(new Set(products.map((p) => p.brand)))];
  const labels = {
    all: 'Catálogo completo',
    'Paraíso Resorts': 'Resortes Paraíso',
  };

  const filtered =
    category === 'all' ? products : products.filter((p) => p.brand === category);

  return (
    <section id="catalogo" className="catalog">
      <div className="catalog-inner">
        <h2>Nuestros colchones</h2>
        <p className="catalog-sub">
          Haz clic en la imagen de cada colchón para ver su detalle. Los precios se
          coordinan por WhatsApp y el envío se coordina con la entrega.
        </p>
        <div className="tabs">
          {brands.map((b) => (
            <button
              key={b}
              className={`tab ${category === b ? 'active' : ''}`}
              onClick={() => setCategory(b)}
            >
              {labels[b] || b}
            </button>
          ))}
        </div>
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
