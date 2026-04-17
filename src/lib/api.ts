import type { Product } from "@/data/products";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
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
