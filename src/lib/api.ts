import type { Product } from "@/data/products";

const normalizeBaseUrl = (value: string): string => value.replace(/\/$/, "");

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)
  : "";

const getFallbackBaseUrls = (): string[] => {
  const urls: string[] = [];

  if (ENV_API_BASE_URL) {
    urls.push(ENV_API_BASE_URL);
  }

  // Same-origin /api should be attempted first (works with Vite proxy and deployed API routes).
  urls.push("");

  if (typeof window !== "undefined" && window.location) {
    const protocol = window.location.protocol || "http:";
    const hostname = window.location.hostname;

    // On physical devices, this allows trying <dev-machine-ip>:4000 when proxy is unavailable.
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      urls.push(`${protocol}//${hostname}:4000`);
    }
  }

  urls.push("http://localhost:4000");

  return Array.from(new Set(urls.map((url) => normalizeBaseUrl(url))));
};

const API_BASE_URLS = getFallbackBaseUrls();

async function requestWithBaseUrl<T>(baseUrl: string, path: string, init?: RequestInit) {
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);

  return { response, payload, url } as const;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface OrderItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface CreateOrderPayload {
  user: { name: string; email: string };
  items: OrderItemInput[];
  shippingAddress: ShippingAddress;
  shipping: number;
  subtotal: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: { name: string; email: string };
  items: OrderItemInput[];
  shippingAddress: ShippingAddress;
  shipping: number;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
}

async function hashPasswordBrowser(password: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString(16);
  }
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleMockFallback<T>(path: string, init?: RequestInit, originalError?: unknown): Promise<T> {
  console.warn(`[api-fallback] Backend server is unreachable. Emulating endpoint: ${path}`, originalError);

  if (typeof window === "undefined") {
    if (path === "/api/products") {
      const localProducts = (await import("@/data/products")).products;
      return localProducts as unknown as T;
    }
    if (path.startsWith("/api/products/")) {
      const id = path.replace("/api/products/", "");
      const localProducts = (await import("@/data/products")).products;
      const product = localProducts.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      return product as unknown as T;
    }
    throw new Error("API offline. Emulation not supported in SSR.");
  }

  const localProducts = (await import("@/data/products")).products;

  if (path === "/api/products") {
    return localProducts as unknown as T;
  }

  if (path.startsWith("/api/products/")) {
    const id = path.replace("/api/products/", "");
    const product = localProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product as unknown as T;
  }

  const getMockUsers = () => {
    const raw = localStorage.getItem("snapcart_mock_users");
    if (!raw) {
      const seedUsers = [
        {
          id: "90f84723-e7eb-4356-ae1c-e8bbf595aefb",
          name: "Alex Rivera",
          email: "alex123@gmail.com",
          passwordHash: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
          createdAt: "2026-04-17T16:36:36.306Z"
        },
        {
          id: "cabb6e89-3123-4437-a589-c29253dd7c76",
          name: "naman kumar",
          email: "naman123@gmail.com",
          passwordHash: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
          createdAt: "2026-04-18T04:28:23.826Z"
        },
        {
          id: "cf66f3e3-92dc-4506-ba82-a273e756be24",
          name: "sarthak dubey",
          email: "sarthak123@gmail.com",
          passwordHash: "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
          createdAt: "2026-04-18T04:29:50.288Z"
        }
      ];
      localStorage.setItem("snapcart_mock_users", JSON.stringify(seedUsers));
      return seedUsers;
    }
    return JSON.parse(raw);
  };

  const saveMockUsers = (users: any[]) => {
    localStorage.setItem("snapcart_mock_users", JSON.stringify(users));
  };

  if (path === "/api/auth/login" && init?.body) {
    const { email, password } = JSON.parse(init.body as string);
    if (!email || !password) {
      throw new Error("Please fill in all fields");
    }
    const users = getMockUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    const hash = await hashPasswordBrowser(String(password));
    if (!user || user.passwordHash !== hash) {
      throw new Error("Invalid email or password");
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    } as unknown as T;
  }

  if (path === "/api/auth/register" && init?.body) {
    const { name, email, password } = JSON.parse(init.body as string);
    if (!name || !email || !password) {
      throw new Error("Please fill in all fields");
    }
    if (String(password).length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    const users = getMockUsers();
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = users.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: await hashPasswordBrowser(String(password)),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveMockUsers(users);
    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }
    } as unknown as T;
  }

  if (path === "/api/orders" && init?.body) {
    const payload = JSON.parse(init.body as string);
    const mockOrders = JSON.parse(localStorage.getItem("snapcart_mock_orders") || "[]");
    const orderNo = `SC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const newOrder = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      orderNumber: orderNo,
      user: payload.user,
      items: payload.items,
      shippingAddress: payload.shippingAddress,
      shipping: payload.shipping,
      subtotal: payload.subtotal,
      total: payload.total,
      status: "placed",
      createdAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    localStorage.setItem("snapcart_mock_orders", JSON.stringify(mockOrders));
    return newOrder as unknown as T;
  }

  if (path.startsWith("/api/orders")) {
    const urlObj = new URL(path, "http://localhost");
    const email = urlObj.searchParams.get("email");
    const mockOrders = JSON.parse(localStorage.getItem("snapcart_mock_orders") || "[]");
    if (email) {
      const filtered = mockOrders.filter((o: any) => o.user.email.toLowerCase() === email.toLowerCase());
      return filtered as unknown as T;
    }
    return mockOrders as unknown as T;
  }

  throw originalError || new Error(`Unimplemented mock fallback for path: ${path}`);
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: unknown;
  let attemptedUrl = path;
  const isApiPath = path.startsWith("/api/");

  for (const baseUrl of API_BASE_URLS) {
    try {
      const { response, payload, url } = await requestWithBaseUrl<T>(baseUrl, path, init);
      attemptedUrl = url;

      if (response.ok) {
        return payload as T;
      }

      if (response.status === 404 && isApiPath && API_BASE_URLS[API_BASE_URLS.length - 1] !== baseUrl) {
        continue;
      }

      throw new Error(payload?.message || `Request failed with status ${response.status}`);
    } catch (err) {
      lastError = err;

      if (err instanceof TypeError) {
        continue;
      }
    }
  }

  return handleMockFallback<T>(path, init, lastError);
}

export function fetchProducts() {
  return apiRequest<Product[]>("/api/products");
}

export function fetchProductById(id: string) {
  return apiRequest<Product>(`/api/products/${id}`);
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const result = await apiRequest<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return result.user;
}

export async function loginUser(input: { email: string; password: string }) {
  const result = await apiRequest<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return result.user;
}

export function createOrder(payload: CreateOrderPayload) {
  return apiRequest<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchOrders(email?: string) {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";
  return apiRequest<Order[]>(`/api/orders${query}`);
}
