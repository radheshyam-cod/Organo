import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createSubscriptionHandler,
  deleteSubscriptionHandler,
  listSubscriptionsHandler,
  updateSubscriptionHandler,
} from "../controllers/subscriptionController.js";

const router = Router();

router.use(authenticate);

router.post("/", createSubscriptionHandler);
router.get("/", listSubscriptionsHandler);
router.patch("/:id", updateSubscriptionHandler);
router.delete("/:id", deleteSubscriptionHandler);

export default router;
