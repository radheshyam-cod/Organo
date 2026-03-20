import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products.`);
  
  for (const p of products) {
    if (p.price && p.price >= 100) { // Safety check to only divide prices that look inflated (>= 100 might be too wide, but all seed prices are >= 800)
       const newPrice = Math.floor(p.price / 10);
       await prisma.product.update({
         where: { id: p.id },
         data: { price: newPrice }
       });
       console.log(`Updated ${p.name}: ${p.price} -> ${newPrice}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
