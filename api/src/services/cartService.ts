import prisma from "../utils/prisma.js";

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: { items: { include: { product: true } } },
  });
}

export async function getCart(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
}

async function ensureStock(productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error("Product not found");
    (error as any).status = 404;
    throw error;
  }
  if (product.stock < quantity) {
    const error = new Error("Insufficient stock");
    (error as any).status = 400;
    throw error;
  }
  return product;
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    const error = new Error("Quantity must be greater than 0");
    (error as any).status = 400;
    throw error;
  }

  const product = await ensureStock(productId, quantity);

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: { items: true },
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const newQuantity = (existingItem?.quantity ?? 0) + quantity;
  if (product.stock < newQuantity) {
    const error = new Error("Insufficient stock");
    (error as any).status = 400;
    throw error;
  }

  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: newQuantity, price: product.price },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      price: product.price,
    },
    include: { product: true },
  });

  return item;
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  const product = await ensureStock(productId, quantity);
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error = new Error("Cart not found");
    (error as any).status = 404;
    throw error;
  }

  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  if (!item) {
    const error = new Error("Item not in cart");
    (error as any).status = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error("Insufficient stock");
    (error as any).status = 400;
    throw error;
  }

  return prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId } },
    data: { quantity, price: product.price },
    include: { product: true },
  });
}

export async function removeFromCart(userId: string, productId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error = new Error("Cart not found");
    (error as any).status = 404;
    throw error;
  }

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
}
