export type Role = "CUSTOMER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  tags?: string[];
  benefits?: string[];
}

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED";

export interface Order {
  id: string;
  userId: string;
  subtotal: number;
  gstAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt?: string;
}
