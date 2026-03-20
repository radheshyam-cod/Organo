import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import aiAdvisorRoutes from "./routes/aiAdvisorRoutes.js";
import demandRoutes from "./routes/demandRoutes.js";
import nearbyRoutes from "./routes/nearbyRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { env } from "./utils/env.js";

const app = express();

const allowedOrigins =
  env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((origin: string) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/ai", aiAdvisorRoutes);
app.use("/api/ai", demandRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api", nearbyRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
