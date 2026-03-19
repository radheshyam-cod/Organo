import { Router } from "express";
import { nearbyHandler } from "../controllers/nearbyController.js";

const router = Router();

router.get("/nearby", nearbyHandler);

export default router;
