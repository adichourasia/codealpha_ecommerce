import cors from "cors";
import express from "express";
import { randomUUID, createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import seedProducts from "./seed-products.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const dbFile = join(__dirname, "db.json");
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [], products: [], orders: [] });

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function createOrderNumber() {
  return `SC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function initDb() {
  await db.read();
  db.data ||= { users: [], products: [], orders: [] };

  if (!Array.isArray(db.data.users)) db.data.users = [];
  if (!Array.isArray(db.data.products)) db.data.products = [];
  if (!Array.isArray(db.data.orders)) db.data.orders = [];

  if (db.data.products.length === 0) {
    db.data.products = seedProducts;
  }

  await db.write();
}

const app = express();
const port = Number(process.env.BACKEND_PORT || 4000);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", async (_req, res) => {
  await db.read();
  res.json(db.data.products);
});

app.get("/api/products/:id", async (req, res) => {
  await db.read();
  const product = db.data.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", async (req, res) => {
  const payload = req.body || {};
  const required = ["name", "price", "description", "shortDescription", "image", "category"];
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === "");
  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  await db.read();
  const product = {
    id: randomUUID(),
    name: payload.name,
    price: Number(payload.price),
    originalPrice: payload.originalPrice ? Number(payload.originalPrice) : undefined,
    description: payload.description,
    shortDescription: payload.shortDescription,
    image: payload.image,
    category: payload.category,
    badge: payload.badge === "new" || payload.badge === "sale" ? payload.badge : undefined,
    stock: Number(payload.stock ?? 0),
    rating: Number(payload.rating ?? 0),
    reviews: Number(payload.reviews ?? 0),
  };

  db.data.products.push(product);
  await db.write();
  res.status(201).json(product);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  await db.read();
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = {
    id: randomUUID(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(String(password)),
    createdAt: new Date().toISOString(),
  };

  db.data.users.push(user);
  await db.write();

  res.status(201).json({ user: safeUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  await db.read();
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || user.passwordHash !== hashPassword(String(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ user: safeUser(user) });
});

app.post("/api/orders", async (req, res) => {
  const { user, items, shippingAddress, shipping, subtotal, total } = req.body || {};

  if (!user?.email || !user?.name) {
    return res.status(400).json({ message: "User information is required" });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }
  if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.pincode) {
    return res.status(400).json({ message: "Complete shipping address is required" });
  }

  await db.read();

  const order = {
    id: randomUUID(),
    orderNumber: createOrderNumber(),
    user: {
      name: String(user.name),
      email: String(user.email).toLowerCase(),
    },
    items,
    shippingAddress,
    shipping: Number(shipping ?? 0),
    subtotal: Number(subtotal ?? 0),
    total: Number(total ?? 0),
    status: "placed",
    createdAt: new Date().toISOString(),
  };

  db.data.orders.push(order);
  await db.write();

  res.status(201).json(order);
});

app.get("/api/orders", async (req, res) => {
  await db.read();

  const email = typeof req.query.email === "string" ? req.query.email.toLowerCase() : undefined;
  const orders = email
    ? db.data.orders.filter((order) => order.user.email.toLowerCase() === email)
    : db.data.orders;

  res.json(orders);
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`SnapCart backend running on http://localhost:${port}`);
  });
});
