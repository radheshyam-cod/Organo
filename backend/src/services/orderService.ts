import prisma from "../utils/prisma.js";
import { addDays } from "../utils/time.js";
import { env } from "../utils/env.js";

function generateInvoiceNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORG-${y}${m}${d}-${rand}`;
}

export async function createOrderFromCart(
  userId: string,
  invoiceInfo?: { businessName?: string; gstin?: string }
) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    (error as any).status = 400;
    throw error;
  }

  // Validate stock and compute total
  let subtotal = 0;
  for (const item of cart.items) {
    if (!item.product) {
      const error = new Error("Product not found");
      (error as any).status = 404;
      throw error;
    }
    if (item.product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${item.product.name}`);
      (error as any).status = 400;
      throw error;
    }
    subtotal += Number(item.price) * item.quantity;
  }

  const deliveryETA = addDays(new Date(), 2); // simple ETA +2 days; plug pincode logic later
  const gstRate = env.GST_RATE;
  const bundleDiscountRate = cart.items.length >= 3 ? env.BUNDLE_DISCOUNT : 0;
  const subscriptionDiscountRate = env.SUBSCRIPTION_DISCOUNT;
  const totalDiscountRate = Math.min(bundleDiscountRate + subscriptionDiscountRate, 0.2);
  const orderDiscount = Number((subtotal * totalDiscountRate).toFixed(2));
  const discountedSubtotal = subtotal - orderDiscount;
  const gstAmount = Number((discountedSubtotal * gstRate).toFixed(2));
  const deliveryFee = env.DELIVERY_FEE;
  const totalAmount = discountedSubtotal + gstAmount + deliveryFee;
  const invoiceNumber = generateInvoiceNumber();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        subtotal: discountedSubtotal,
        gstAmount,
        gstRate,
        deliveryFee,
        orderDiscount,
        totalAmount,
        status: "PENDING",
        invoiceNumber,
        businessName: invoiceInfo?.businessName,
        gstin: invoiceInfo?.gstin,
        deliveryETA,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // decrement stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
}

export async function listOrders(userId: string, isAdmin: boolean) {
  return prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrderById(id: string, userId: string, isAdmin: boolean) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return null;
  if (!isAdmin && order.userId !== userId) return null;
  return order;
}
