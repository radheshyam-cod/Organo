import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sleep, digestion, energy, notes } = req.body;
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!sleep || !digestion || !energy) {
      res.status(400).json({ message: "Sleep, digestion, and energy ratings are required." });
      return;
    }

    const checkIn = await prisma.healthCheckIn.create({
      data: {
        userId,
        sleep: Number(sleep),
        digestion: Number(digestion),
        energy: Number(energy),
        notes,
      },
    });

    res.status(201).json({ message: "Check-in saved successfully", checkIn });
  } catch (error) {
    console.error("Health check-in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const history = await prisma.healthCheckIn.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30, // Get last 30 days
    });

    res.json(history);
  } catch (error) {
    console.error("Fetch health history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
