import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const DATABASE_URL = process.env.DATABASE_URL;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const GST_RATE = process.env.GST_RATE ? Number(process.env.GST_RATE) : 0.05;
const DELIVERY_FEE = process.env.DELIVERY_FEE ? Number(process.env.DELIVERY_FEE) : 0;
const SUBSCRIPTION_DISCOUNT = process.env.SUBSCRIPTION_DISCOUNT
  ? Number(process.env.SUBSCRIPTION_DISCOUNT)
  : 0.1;
const BUNDLE_DISCOUNT = process.env.BUNDLE_DISCOUNT ? Number(process.env.BUNDLE_DISCOUNT) : 0.08;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Set it in your environment (.env)");
}
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set it in your environment (.env)");
}
if (!GOOGLE_PLACES_API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is required. Set it in your environment (.env)");
}
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required in .env");
}
if (Number.isNaN(GST_RATE) || GST_RATE < 0) {
  throw new Error("GST_RATE must be a valid number (e.g., 0.05 for 5%)");
}
if (Number.isNaN(DELIVERY_FEE) || DELIVERY_FEE < 0) {
  throw new Error("DELIVERY_FEE must be a valid non-negative number");
}
if (
  Number.isNaN(SUBSCRIPTION_DISCOUNT) ||
  SUBSCRIPTION_DISCOUNT < 0 ||
  SUBSCRIPTION_DISCOUNT > 0.2
) {
  throw new Error("SUBSCRIPTION_DISCOUNT must be between 0 and 0.2 (e.g., 0.1 for 10%)");
}
if (Number.isNaN(BUNDLE_DISCOUNT) || BUNDLE_DISCOUNT < 0 || BUNDLE_DISCOUNT > 0.2) {
  throw new Error("BUNDLE_DISCOUNT must be between 0 and 0.2 (e.g., 0.08 for 8%)");
}

export const env = {
  PORT,
  DATABASE_URL: DATABASE_URL as string,
  CORS_ORIGIN: CORS_ORIGIN as string,
  JWT_SECRET: JWT_SECRET as string,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN as string,
  GOOGLE_PLACES_API_KEY: GOOGLE_PLACES_API_KEY as string,
  RAZORPAY_KEY_ID: RAZORPAY_KEY_ID as string,
  RAZORPAY_KEY_SECRET: RAZORPAY_KEY_SECRET as string,
  GST_RATE,
  DELIVERY_FEE,
  SUBSCRIPTION_DISCOUNT,
  BUNDLE_DISCOUNT,
};
