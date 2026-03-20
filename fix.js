const fs = require("fs");
const path = require("path");

function removeZero(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const updated = content.replace(/price:\s*(\d+)((?:\.0)?)/g, (match, p1, p2) => {
    // If it's a number, divide by 10
    const newPrice = Math.floor(parseInt(p1, 10) / 10);
    return `price: ${newPrice}${p2}`;
  });
  fs.writeFileSync(filePath, updated);
  console.log(`Updated prices in ${filePath}`);
}

removeZero(path.join(__dirname, "prisma/seed.ts"));
removeZero(path.join(__dirname, "src/data/products.ts"));
