import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products.`);
  
  for (const p of products) {
    const currentPrice = Number(p.price);
    if (currentPrice && currentPrice >= 100) { // Safety check to only divide prices that look inflated
       const newPrice = Math.floor(currentPrice / 10);
       await prisma.product.update({
         where: { id: p.id },
         data: { price: newPrice }
       });
       console.log(`Updated ${p.name}: ${currentPrice} -> ${newPrice}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
