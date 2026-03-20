import { Router } from "express";
import { aiAdvisorHandler } from "../controllers/aiAdvisorController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);
router.post("/advisor", aiAdvisorHandler);

export default router;
