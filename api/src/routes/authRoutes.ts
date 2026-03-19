import { Router } from "express";
import { handleLogin, handleMe, handleSignup } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/me", authenticate, handleMe);

export default router;
