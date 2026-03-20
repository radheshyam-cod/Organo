import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createPaymentOrderHandler,
  verifyPaymentHandler,
} from "../controllers/paymentController.js";

const router = Router();

router.use(authenticate);
router.post("/create-order", createPaymentOrderHandler);
router.post("/verify", verifyPaymentHandler);

export default router;
