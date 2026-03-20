import { Router } from "express";
import { demandReportHandler } from "../controllers/demandController.js";
import { authenticate, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate, requireRole(["ADMIN"]));

router.get("/demand-report", demandReportHandler);

export default router;
