import asyncHandler from "express-async-handler";
import Player from "../models/playerModel";
import { authMiddleware } from "./authMiddleware";

// This middleware finds the player based on the authenticated wallet address or guest ID
export const playerMiddleware = asyncHandler(async (req: any, res, next) => {
  try {
    // First run auth middleware to get authentication info
    await authMiddleware(req, res, () => {});

    if (res.statusCode === 401) {
      return; // Auth middleware already sent error response
    }

    const walletAddress = req.walletAddress;
    const playerId = req.playerId;
    const guestId = req.guestId;

    let player = null;

    // Try to find player by wallet address first (for wallet users)
    if (walletAddress) {
      player = await Player.findOne({ walletAddress });
    }

    // If no wallet player found, try by guest ID (for guest users)
    if (!player && guestId) {
      player = await Player.findOne({ guestId });
    }

    // If still no player found, try by player ID (fallback)
    if (!player && playerId) {
      player = await Player.findById(playerId);
    }

    if (!player) {
      res.status(400).json({ error: "Player not found" });
      return;
    }

    // Attach the mongoose document to the request object
    req.player = player;

    next();
  } catch (error) {
    console.error("Player middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
