import { Router } from "express";
import { checkIn, getHistory } from "../controllers/wellnessController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/checkin", authenticate, checkIn);
router.get("/history", authenticate, getHistory);

export default router;
