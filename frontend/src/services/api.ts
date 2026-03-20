import axios from "axios";

// IMPORTANT: Always point to the API host, not the frontend host.
const DEFAULT_API = "http://localhost:4000";
const API_BASE = import.meta.env.VITE_API_BASE || DEFAULT_API;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Helper to attach bearer token
export const authHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : {};
