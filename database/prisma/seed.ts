import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../../frontend/src/data/products.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Try to clean up existing products that might have conflicting names
  // We only delete products with long IDs (cuids) to avoid deleting the correct ones
  try {
    const oldProducts = await prisma.product.findMany({});
    for (const p of oldProducts) {
      if (p.id.length > 10) {
        // try deleting cart items referencing this product first
        await prisma.cartItem.deleteMany({ where: { productId: p.id } });
        // delete product
        await prisma.product.delete({ where: { id: p.id } }).catch(() => {
          // Ignore if it fails due to order references
        });
      }
    }
  } catch (err) {
    console.log("Cleanup failed or skipped", err instanceof Error ? err.message : err);
  }

  const allProducts = [
    ...PRODUCTS.juices.map((p) => ({ ...p, category: "juices" })),
    ...PRODUCTS.vegetables.map((p) => ({ ...p, category: "vegetables" })),
    ...PRODUCTS.fruits.map((p) => ({ ...p, category: "fruits" })),
  ];

  for (const p of allProducts) {
    try {
      const product = await prisma.product.upsert({
        where: { id: p.id.toString() },
        update: {
          name: p.name,
          price: p.price,
          image: p.image,
          description: p.description,
          tags: p.tag ? [p.tag] : [],
          benefits: p.benefits,
          category: p.category,
        },
        create: {
          id: p.id.toString(),
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          tags: p.tag ? [p.tag] : [],
          benefits: p.benefits || [],
          stock: 100,
        },
      });
      console.log(`Upserted product: ${product.name} with id: ${product.id}`);
    } catch (upsertErr) {
      console.log(
        `Failed to upsert ${p.name}:`,
        upsertErr instanceof Error ? upsertErr.message : upsertErr
      );
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
