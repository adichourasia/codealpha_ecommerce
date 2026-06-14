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

      // If this target does not host API routes, try the next configured base URL.
      if (response.status === 404 && isApiPath && API_BASE_URLS[API_BASE_URLS.length - 1] !== baseUrl) {
        continue;
      }

      throw new Error(payload?.message || `Request failed with status ${response.status}`);
    } catch (err) {
      lastError = err;

      // Network failures should attempt next base URL when available.
      if (err instanceof TypeError) {
        continue;
      }
    }
  }

  if (lastError instanceof Error) {
    throw new Error(`${lastError.message} (last tried: ${attemptedUrl})`);
  }

  throw new Error(
    `Unable to reach API for ${path}. In development, start backend with \"npm run backend\" and ensure port 4000 is reachable.`,
  );
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
