import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Helper to attach bearer token
export const authHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : {};
