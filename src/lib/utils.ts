import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const toImageSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const finalBase = base.endsWith('/') ? base : base + '/';
  return `${finalBase}${cleanPath}`;
};

export const getProductImage = (product: { image?: string | null; name: string }) => {
  if (product.image) return getImageUrl(product.image);
  const slug = toImageSlug(product.name);
  return getImageUrl(`/images/${slug}.png`);
};
