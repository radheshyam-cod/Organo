import crypto from "crypto";
import prisma from "../utils/prisma.js";
import { razorpayClient } from "../utils/razorpay.js";
import { env } from "../utils/env.js";
import { createOrderFromCart } from "./orderService.js";

interface CreatePaymentInput {
  userId: string;
  orderId?: string;
}

export async function createPaymentOrder({ userId, orderId }: CreatePaymentInput) {
  const order =
    orderId !== undefined
      ? await prisma.order.findFirst({
          where: { id: orderId, userId },
          include: { payment: true },
        })
      : await createOrderFromCart(userId);

  if (!order) {
    const err = new Error("Order not found");
    (err as any).status = 404;
    throw err;
  }

  // Razorpay expects amount in paise
  const amountPaise = Math.round(Number(order.totalAmount) * 100);

  type RazorpayOrderResponse = { id: string; amount: number; currency: string };

  const razorpayOrder = (await razorpayClient.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: order.id,
    notes: { userId },
    payment_capture: true, // capture automatically
  })) as unknown as RazorpayOrderResponse;

  await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      razorpayOrderId: razorpayOrder.id,
      amountPaise,
      currency: "INR",
      status: "PENDING",
    },
    create: {
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amountPaise,
      currency: "INR",
      status: "PENDING",
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "PENDING" },
  });

  return {
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: amountPaise,
    currency: "INR",
    key: env.RAZORPAY_KEY_ID,
  };
}

interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyPayment(userId: string, payload: VerifyPayload) {
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: payload.razorpay_order_id },
    include: { order: true },
  });

  if (!payment || !payment.order || payment.order.userId !== userId) {
    const err = new Error("Payment not found");
    (err as any).status = 404;
    throw err;
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === payload.razorpay_signature;

  const status = isValid ? "SUCCESS" : "FAILED";

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature,
      status,
    },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { paymentStatus: status },
  });

  if (!isValid) {
    const err = new Error("Payment verification failed");
    (err as any).status = 400;
    throw err;
  }

  return { paymentId: payment.id, orderId: payment.orderId };
}
