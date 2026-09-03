# Colchonería Paraíso — Tienda online (100% estática)

Página web para vender colchones **Paraíso Resorts** (resortes) y **Espumas Zebra**. El pedido se arma en el carrito y se envía por **WhatsApp** al vendedor; el pago se coordina por **Yape** en el chat.

La tienda es **100% estática**: no necesita servidor ni base de datos. Todo el catálogo, los precios y la configuración viven en el frontend.

## Estructura

```
colchoneria/
└── frontend/                  React + Vite (todo el sitio)
    ├── index.html
    └── src/
        ├── App.jsx
        ├── config.js          Número de WhatsApp y helpers
        ├── data/products.js   ★ Catálogo con precios y configuración de la tienda
        ├── styles.css
        ├── components/
        │   ├── Header.jsx          Cabecera amarilla con logo
        │   ├── Hero.jsx
        │   ├── Benefits.jsx
        │   ├── Catalog.jsx
        │   ├── ProductCard.jsx     Tarjeta de producto
        │   ├── ProductModal.jsx    ★ Detalle ampliado del colchón
        │   ├── CartDrawer.jsx
        │   ├── CheckoutModal.jsx   Envía el pedido por WhatsApp
        │   └── Footer.jsx
        └── context/CartContext.jsx
```

## Configurar tu número de WhatsApp y precios

Todo se edita en **`frontend/src/data/products.js`**:

- `STORE_CONFIG.whatsappNumber` → número en formato internacional sin `+` ni espacios (Perú: `51` + número). Actual: `51997060312`.
- `STORE_CONFIG.currency` → símbolo de la moneda (`S/`).
- `PRODUCTS` → lista de colchones. Cada uno tiene `name`, `brand`, `category` (`resortes` o `espumas`), `type`, `image`, `sizes` (precio por medida) y `description` (se muestra al hacer clic en la imagen).

Para cambiar el logo, reemplaza `frontend/public/images/logo.jpeg`.

## Publicar en internet (URL permanente, gratis)

Solo necesitas **GitHub Pages** (ya no hace falta Render).

1. Crea el repositorio `colchoneria` en https://github.com.
2. Sube el proyecto:
   ```powershell
   git init
   git add .
   git commit -m "Primera versión de la tienda"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/colchoneria.git
   git push -u origin main
   ```
   Reemplaza `TU_USUARIO` con tu usuario de GitHub.
3. En tu repositorio → **Settings** → **Pages** → en **Source** elige **GitHub Actions**.
4. El flujo de `deploy.yml` ya está configurado: compila y publica solo con cada `git push`.
5. Tu tienda queda en:
   ```
   https://TU_USUARIO.github.io/colchoneria/
   ```

## Ejecutar en desarrollo

```
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173

## Cómo funciona un pedido

1. El cliente elige colchón y tamaño → **Agregar al carrito**.
2. En el carrito → **Continuar**.
3. Completa nombre, teléfono y dirección → **Enviar pedido por WhatsApp**.
4. Se abre WhatsApp con el mensaje del pedido dirigido a tu número (997 060 312).
5. Tú confirmas el pago por Yape en el chat.
