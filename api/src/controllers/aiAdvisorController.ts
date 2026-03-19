import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { generateRecommendation } from "../services/aiAdvisorService.js";

const GOALS = ["energy", "detox", "recovery"];
const TIMES = ["morning", "afternoon", "evening"];

export async function aiAdvisorHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { goal, timeOfDay, preferences } = req.body;
    if (!GOALS.includes(goal)) {
      res.status(400).json({ message: "goal must be one of energy|detox|recovery" });
      return;
    }
    if (!TIMES.includes(timeOfDay)) {
      res.status(400).json({ message: "timeOfDay must be morning|afternoon|evening" });
      return;
    }
    const prefsArray = Array.isArray(preferences) ? preferences : [];
    const result = await generateRecommendation(req.user.id, goal, timeOfDay, prefsArray);
    res.json({
      recommendation: result.recommendation,
      id: result.recordId,
    });
  } catch (error) {
    next(error);
  }
}
