import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addToCartHandler,
  getCartHandler,
  removeFromCartHandler,
  updateCartHandler,
} from "../controllers/cartController.js";

const router = Router();

router.use(authenticate);

router.get("/", getCartHandler);
router.post("/add", addToCartHandler);
router.post("/remove", removeFromCartHandler);
router.post("/update", updateCartHandler);

export default router;
