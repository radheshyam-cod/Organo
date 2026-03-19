import prisma from "../utils/prisma.js";

type ProductFilters = {
  category?: string;
  tags?: string[];
  benefits?: string[];
};

export async function listProducts(filters: ProductFilters) {
  const where: any = {};
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }
  if (filters.benefits && filters.benefits.length > 0) {
    where.benefits = { hasSome: filters.benefits };
  }

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}
