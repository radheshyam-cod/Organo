import type { Request, Response, NextFunction } from "express";
import { findNearby } from "../services/nearbyService.js";

const TYPES = ["gym", "hospital", "yoga", "clinic"];

export async function nearbyHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { lat, lng, type, radiusKm, minRating } = req.query;
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!lat || Number.isNaN(latNum) || !lng || Number.isNaN(lngNum)) {
      res.status(400).json({ message: "lat and lng are required numbers" });
      return;
    }
    if (!type || typeof type !== "string" || !TYPES.includes(type)) {
      res.status(400).json({ message: "type must be gym|hospital" });
      return;
    }

    const radius = radiusKm ? Number(radiusKm) : 5;
    const rating = minRating ? Number(minRating) : 0;

    const data = await findNearby(latNum, lngNum, type as any, radius, rating);
    res.json({
      isServiceable: true,
      results: data.results.map((r: any) => ({
        name: r.name,
        distanceKm: Number((r.distance / 1000).toFixed(2)),
        rating: r.rating,
        address: r.address,
      })),
      source: data.cached ? "cache" : "live",
      radiusKm: radius,
    });
  } catch (error) {
    next(error);
  }
}
