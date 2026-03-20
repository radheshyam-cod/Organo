import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createOrderHandler,
  getOrderHandler,
  listOrdersHandler,
} from "../controllers/orderController.js";

const router = Router();

router.use(authenticate);

router.post("/create", createOrderHandler);
router.get("/", listOrdersHandler);
router.get("/:id", getOrderHandler);

export default router;
