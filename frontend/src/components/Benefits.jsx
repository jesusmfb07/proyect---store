import React from 'react';

const BENEFITS = [
  {
    icon: '🚚',
    title: 'Entrega a domicilio',
    text: 'Llevamos tu colchón hasta la puerta de tu casa.',
  },
  {
    icon: '💳',
    title: 'Pago por Yape',
    text: 'Abona de forma segura y sencilla desde tu celular. Confirmamos al instante.',
  },
  {
    icon: '🛡️',
    title: 'Calidad garantizada',
    text: 'Resortes Paraíso Resorts y espumas Zebra, marcas de confianza.',
  },
  {
    icon: '💬',
    title: 'Atención por WhatsApp',
    text: 'Te asesoramos en tu compra y coordinamos la entrega por WhatsApp.',
  },
];

export default function Benefits() {
  return (
    <section className="benefits">
      <div className="benefits-inner">
        {BENEFITS.map((b) => (
          <div className="benefit" key={b.title}>
            <span className="benefit-icon">{b.icon}</span>
            <strong>{b.title}</strong>
            <p>{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
