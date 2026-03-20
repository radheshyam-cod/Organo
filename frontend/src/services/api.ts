import axios from "axios";

// IMPORTANT: Always point to the API host, not the frontend host.
const IS_PROD = import.meta.env.PROD;
const API_BASE = IS_PROD
  ? "https://organo-k80d.onrender.com"
  : import.meta.env.VITE_API_BASE || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Helper to attach bearer token
export const authHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : {};
