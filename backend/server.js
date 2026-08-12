const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('./config.json');
const store = require('./store');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || config.jwtSecret;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));

store.initStore();

function formatMoney(amount) {
  return `${config.currency} ${Number(amount).toFixed(2)}`;
}

function buildOrderMessage(order) {
  const lines = [];
  lines.push(`🛒 *NUEVO PEDIDO - ${config.storeName}*`);
  lines.push(`📅 ${new Date().toLocaleString('es-PE')}`);
  if (config.storeAddress) {
    lines.push(`📍 ${config.storeAddress}`);
  }
  lines.push('-----------------------------------');
  order.items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.name}${item.thickness ? ` (${item.thickness})` : ''}` +
        ` - ${item.size}\n   Cantidad: ${item.qty} x ${formatMoney(item.unitPrice)} = ${formatMoney(item.lineTotal)}`
    );
  });
  lines.push('-----------------------------------');
  lines.push(`💰 *TOTAL: ${formatMoney(order.total)}*`);
  lines.push('-----------------------------------');
  lines.push(`👤 *Nombre:* ${order.customer.name}`);
  lines.push(`📞 *Teléfono:* ${order.customer.phone}`);
  lines.push(`🏠 *Dirección:* ${order.customer.address || 'Recoger en tienda'}`);
  if (order.customer.notes) {
    lines.push(`📝 *Notas:* ${order.customer.notes}`);
  }
  lines.push(`💳 *Método de pago:* Yape`);
  return lines.join('\n');
}

function buildWhatsAppUrl(message) {
  const number = config.whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function signToken(user) {
  return jwt.sign({ username: user.username, name: user.name }, JWT_SECRET, {
    expiresIn: '12h',
  });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión expirada o inválida.' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = config.users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
  const valid = bcrypt.compareSync(String(password || ''), user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }
  res.json({ token: signToken(user), name: user.name, username: user.username });
});

app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ username: req.user.username, name: req.user.name });
});

app.get('/api/orders', authRequired, async (req, res, next) => {
  try {
    const orders = await store.getOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/config', (req, res) => {
  res.json({
    storeName: config.storeName,
    storeAddress: config.storeAddress,
    currency: config.currency,
    whatsappNumber: config.whatsappNumber,
  });
});

app.post('/api/orders', async (req, res, next) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Faltan datos del cliente (nombre y teléfono).' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    const normalizedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || !(item.size in product.sizes)) {
        throw new Error(`Producto inválido: ${item.productId}`);
      }
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      const unitPrice = product.sizes[item.size];
      return {
        productId: product.id,
        name: product.name,
        thickness: product.thickness,
        size: item.size,
        qty,
        unitPrice,
        lineTotal: Number((unitPrice * qty).toFixed(2)),
      };
    });

    const total = Number(normalizedItems.reduce((acc, it) => acc + it.lineTotal, 0).toFixed(2));

    const order = {
      id: `PED-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: String(customer.name),
        phone: String(customer.phone),
        address: String(customer.address || ''),
        notes: String(customer.notes || ''),
      },
      items: normalizedItems,
      total,
      paymentMethod: 'Yape',
    };

    await store.saveOrder(order);

    const message = buildOrderMessage(order);
    res.json({
      orderId: order.id,
      total,
      whatsappUrl: buildWhatsAppUrl(message),
      message,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message || 'Error en el servidor.' });
});

app.listen(config.serverPort, () => {
  console.log(`API de colchonería corriendo en http://localhost:${config.serverPort}`);
});
