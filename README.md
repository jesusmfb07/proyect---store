# Colchonería Paraíso — Tienda online

Página web para vender colchones **Paraíso Resorts** (resortes) y **Espumas Zebra**. El pedido se arma en el carrito y se envía por WhatsApp al vendedor; el pago se coordina por **Yape** en el chat.

## Estructura

```
colchoneria/
├── backend/          API Node.js + Express (puerto 3001)
│   ├── config.json   Número de WhatsApp, moneda y nombre de la tienda
│   └── data/
│       ├── products.json   Catálogo con precios
│       └── orders.json     Pedidos registrados
└── frontend/         React + Vite (puerto 5173)
```

## Configurar tu número de WhatsApp

Abre `backend/config.json` y cambia:

```json
{
  "whatsappNumber": "51999999999"
}
```

Debe ser el número en formato internacional sin `+` ni espacios (Perú: `51` + número).

## Acceso para vendedores (login)

Los pedidos se ven en la página **/admin** (enlace "Acceso vendedores" en el pie de página). El usuario y contraseña se definen en `backend/config.json`:

```json
{
  "users": [
    {
      "username": "admin",
      "passwordHash": "$2b$10$...hash...",
      "name": "Administrador"
    }
  ]
}
```

La contraseña se guarda **encriptada** (hash bcrypt). Para cambiar la contraseña, genera el hash con:

```powershell
cd backend
node hash.js "tu-nueva-contraseña"
```

El script imprime el hash; pégalo en `passwordHash`. El secreto JWT se lee de la variable de entorno `JWT_SECRET` si existe (así en Render no queda en el repositorio); si no, usa `config.json`.

## Publicar en internet (URL permanente, gratis)

Este proyecto ya está preparado para publicarse así:
- **Backend** (Node.js) → **Render** (plan gratis).
- **Frontend** (React) → **GitHub Pages** (gratis), con despliegue automático por GitHub Actions.

### Paso 1 — Prepara tus datos antes de subir

Abre `backend/config.json` y cambia ANTES de subir:

```json
{
  "whatsappNumber": "51TU_NUMERO_REAL",
  "jwtSecret": "pon-aqui-un-texto-largo-y-aleatorio",
  "users": [
    { "username": "admin", "passwordHash": "hash-de-tu-contraseña", "name": "Administrador" }
  ]
}
```

Para el `passwordHash` genera el hash: `cd backend` → `node hash.js "tu-contraseña"`. En Render, define la variable de entorno `JWT_SECRET` con el mismo secreto. Estos datos se suben a GitHub/Render, por eso deben estar ya correctos.

### Paso 2 — Crea cuentas e instala Git

1. Crea cuenta en https://github.com (gratis).
2. Crea cuenta en https://render.com (entra con "Continue with GitHub").
3. Instala Git si no lo tienes:
   ```powershell
   winget install --id Git.Git
   ```
4. Reinicia VS Code. Configura tu identidad (una vez):
   ```powershell
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@correo.com"
   ```

### Paso 3 — Sube el proyecto a GitHub

1. En github.com: botón **New repository**. Nombre: `colchoneria`. **No** marques nada más. **Create repository**.
2. En VS Code abre la terminal integrada (Ctrl + ñ) en la carpeta del proyecto y ejecuta:

```powershell
git init
git add .
git commit -m "Primera versión de la tienda"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/colchoneria.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

### Paso 4 — Publica el backend en Render

1. Entra a https://render.com → **New +** → **Web Service**.
2. Conecta tu repositorio GitHub (el de `colchoneria`).
3. Render detectará `backend/render.yaml` y llenará todo solo (Build `npm install`, Start `node server.js`).
4. Verifica el nombre: `colchoneria-backend`. Deja el plan **Free**. → **Create Web Service**.
5. Espera a que el **Deploy** termine (puede tardar 2-5 min). Cuando el estado sea **Live**, copia la URL, algo como:

   ```
   https://colchoneria-backend.onrender.com
   ```

6. Compruébalo en el navegador abriendo:
   ```
   https://colchoneria-backend.onrender.com/api/products
   ```
   Debe mostrarse la lista de colchones en JSON.

### Paso 5 — Conecta el frontend al backend y publícalo en GitHub Pages

1. Abre `frontend/.env.production` y pon la URL de tu backend:

   ```
   VITE_API_BASE=https://colchoneria-backend.onrender.com
   ```

2. En github.com ve a tu repo → **Settings** → **Pages** (menú izquierdo). En **Source** elige **GitHub Actions**. No hace falta nada más.

3. Sube los cambios:
   ```powershell
   git add .
   git commit -m "Conecto frontend al backend de Render"
   git push
   ```

4. El despliegue se hace solo. Ve a tu repo → pestaña **Actions** para ver el progreso (primera vez tarda ~2 min).

5. Tu tienda queda en:
   ```
   https://TU_USUARIO.github.io/colchoneria/
   ```

6. El panel de vendedores (para ti y tu amiga):
   ```
   https://TU_USUARIO.github.io/colchoneria/#/admin
   ```

### Notas importantes

- **URL permanente y gratuita**: funciona 24/7 sin que tu PC esté encendida.
- El plan **Free de Render** "duerme" el backend tras ~15 min sin visitas; la primera visita puede tardar unos 10-30 segundos en despertar. Se soluciona comprando el plan pago (~7 USD/mes) o agregando un "keep alive".
- Los pedidos se guardan en `data/orders.json` dentro del contenedor de Render: se pierden si el servicio se reinicia. Para historial permanente se usa una base de datos gratis (te lo configuro si lo necesitas).
- GitHub Pages con las rutas tipo `#/admin` no necesita configuración extra de servidor.

## Ejecutar (desarrollo)

Terminal 1 — backend:

```
cd backend
npm install
npm run dev
```

Terminal 2 — frontend:

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
4. La API guarda el pedido en `data/orders.json` y abre WhatsApp con el mensaje del pedido dirigido a tu número.
5. Tú confirmas el pago por Yape en el chat.

## Cambiar precios o productos

Edita `backend/data/products.json`. Cada producto tiene `id`, `name`, `brand`, `category` (`resortes` o `espumas`), `thickness` (solo espumas) y `sizes` con el precio por medida.

Después de un cambio en el backend (precios, config), recuerda: `git add .` → `git commit` → `git push`, y Render vuelve a desplegar automáticamente.
