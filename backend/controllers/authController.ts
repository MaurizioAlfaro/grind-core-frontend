import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PublicKey } from "@solana/web3.js";
import Player from "../models/playerModel";
import { Recovery } from "../models/recoveryModel";
import { recalculatePower } from "../logic/recalculatePower";
import crypto from "crypto";

interface AuthRequest extends Request {
  body: {
    walletAddress: string;
    signature: string;
    message: string;
  };
}

interface NonceRequest extends Request {
  body: {
    walletAddress: string;
  };
}

// Store nonces in memory (in production, use Redis)
const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

export const getNonce = async (req: NonceRequest, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      res.status(400).json({ error: "Wallet address required" });
      return;
    }

    // Generate a random nonce
    const nonce =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store the nonce
    nonceStore.set(walletAddress, { nonce, expiresAt });

    // Clean up expired nonces
    for (const [addr, data] of nonceStore.entries()) {
      if (data.expiresAt < Date.now()) {
        nonceStore.delete(addr);
      }
    }

    res.json({
      nonce,
      message: `Sign this message to authenticate: ${nonce}`,
      expiresAt,
    });
  } catch (error) {
    console.error("Error generating nonce:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const authenticate = async (req: AuthRequest, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      res
        .status(400)
        .json({ error: "Wallet address, signature, and message required" });
      return;
    }

    // Get stored nonce
    const storedData = nonceStore.get(walletAddress);
    if (!storedData || storedData.expiresAt < Date.now()) {
      res.status(400).json({ error: "Nonce expired or not found" });
      return;
    }

    // Verify the message contains the nonce
    if (!message.includes(storedData.nonce)) {
      res.status(400).json({ error: "Invalid message format" });
      return;
    }

    try {
      // Verify signature (basic verification - in production, use proper Solana signature verification)
      const publicKey = new PublicKey(walletAddress);

      // For now, we'll do basic validation
      // In production, you'd use: verify(message, signature, publicKey)
      if (signature.length < 80) {
        // Basic signature length check
        res.status(400).json({ error: "Invalid signature" });
        return;
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid wallet address" });
      return;
    }

    // Find or create player
    let player = await Player.findOne({ walletAddress });

    if (!player) {
      // Create new player
      const initialState = {
        level: 1,
        xp: 0,
        gold: 0,
        dollars: 0,
        power: 1,
        inventory: [],
        equipment: {},
        equipmentUpgrades: {},
        unlockedZoneIds: ["caffeteria"],
        discoveredItemIds: [],
        completedZoneIds: [],
        completedLongMissionZoneIds: [],
        permanentPowerBonus: 0,
        powerMultiplier: 1.0,
        activeBoosts: [],
        purchasedStoreUpgradeIds: [],
        unlockedBadgeIds: [],
        defeatedBossIds: [],
        globalBossCooldownEndTime: 0,
        unlockedPermanentPerks: [],
        labLevel: 1,
        labXp: 0,
        purchasedLabEquipmentIds: [],
        homunculusCreatedCount: 0,
        homunculi: [],
        consecutiveCancels: 0,
        hasEquippedWeapon: false,
        highChanceForgeFails: 0,
        consecutiveCommonCacheOpens: 0,
        missionsCompleted: 0,
        hasReceivedInitialBoost: false,
        tutorialStep: 99,
        tutorialCompleted: true,
        bossDefeatCounts: {},
        dailySafeguardUses: {},
        lastSafeguardUseTimestamp: 0,
        walletAddress,
        isWalletConnected: true,
        ownsReptilianzNFT: false,
        hasSeenWalletConnectPrompt: true,
      };
      const hydratedState = recalculatePower(initialState);
      player = await Player.create(hydratedState);
    } else {
      // Update existing player
      player.isWalletConnected = true;
      player.hasSeenWalletConnectPrompt = true;
      await player.save();
    }

    // Clean up used nonce
    nonceStore.delete(walletAddress);

    // Generate JWT token
    const token = jwt.sign(
      {
        walletAddress,
        playerId: player._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
      },
      process.env.JWT_SECRET || "fallback-secret"
    );

    res.json({
      token,
      player: {
        id: player._id,
        walletAddress: (player as any).walletAddress || walletAddress,
        isWalletConnected: (player as any).isWalletConnected || true,
        ownsReptilianzNFT: (player as any).ownsReptilianzNFT || false,
        level: player.level,
        xp: player.xp,
        gold: player.gold,
        power: player.power,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Custom UUID generator without external dependencies
const generateUUID = (): string => {
  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).substring(2, 8);
  const random2 = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random1}_${random2}`;
};

export const createNewAccount = async (req: Request, res: Response) => {
  try {
    // Generate unique player ID
    const playerId = generateUUID();
    console.log("playerId", playerId);

    // Create new player without wallet connection
    const initialState = {
      level: 1,
      xp: 0,
      gold: 0,
      dollars: 0,
      power: 1,
      inventory: [],
      equipment: {},
      equipmentUpgrades: {},
      unlockedZoneIds: ["caffeteria"],
      discoveredItemIds: [],
      completedZoneIds: [],
      completedLongMissionZoneIds: [],
      permanentPowerBonus: 0,
      powerMultiplier: 1.0,
      activeBoosts: [],
      purchasedStoreUpgradeIds: [],
      unlockedBadgeIds: [],
      defeatedBossIds: [],
      globalBossCooldownEndTime: 0,
      unlockedPermanentPerks: [],
      labLevel: 1,
      labXp: 0,
      purchasedLabEquipmentIds: [],
      homunculusCreatedCount: 0,
      homunculi: [],
      consecutiveCancels: 0,
      hasEquippedWeapon: false,
      highChanceForgeFails: 0,
      consecutiveCommonCacheOpens: 0,
      missionsCompleted: 0,
      hasReceivedInitialBoost: false,
      tutorialStep: 99,
      tutorialCompleted: true,
      bossDefeatCounts: {},
      dailySafeguardUses: {},
      lastSafeguardUseTimestamp: 0,
      walletAddress: undefined,
      isWalletConnected: false,
      ownsReptilianzNFT: false,
      hasSeenWalletConnectPrompt: false,
      guestId: playerId, // Add guest ID for tracking
      user: playerId,
    };

    console.log("initialState", initialState);
    const hydratedState = recalculatePower(initialState);
    const player = await Player.create(hydratedState);
    console.log("player", player);

    // Generate JWT token (30 days)
    const token = jwt.sign(
      {
        playerId: player._id,
        guestId: playerId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
      process.env.JWT_SECRET || "fallback-secret"
    );

    res.json({
      token,
      player: {
        id: player._id,
        guestId: playerId,
        walletAddress: undefined,
        isWalletConnected: false,
        ownsReptilianzNFT: false,
        level: player.level,
        xp: player.xp,
        gold: player.gold,
        power: player.power,
      },
    });
  } catch (error) {
    console.error("New account creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const disconnect = async (req: Request, res: Response) => {
  try {
    const walletAddress = (req as any).walletAddress;

    if (!walletAddress) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const player = await Player.findOne({ walletAddress });
    if (player) {
      player.isWalletConnected = false;
      await player.save();
    }

    res.json({ message: "Disconnected successfully" });
  } catch (error) {
    console.error("Disconnect error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Generate recovery string for authenticated user
export const generateRecoveryString = async (req: Request, res: Response) => {
  try {
    const playerId = (req as any).playerId;
    const guestId = (req as any).guestId;

    if (!playerId && !guestId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // Find player by ID or guest ID
    const player = await Player.findOne({
      $or: [{ _id: playerId }, { guestId: guestId }],
    });

    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    // Check if recovery string already exists
    let recovery = await Recovery.findOne({ playerId: player._id });

    if (!recovery) {
      // Generate new recovery string
      const recoveryString = crypto.randomBytes(32).toString("hex");
      recovery = await Recovery.create({
        playerId: player._id,
        recoveryString,
      });
    }

    res.json({
      recoveryString: recovery.recoveryString,
      documentId: recovery._id,
    });
  } catch (error) {
    console.error("Recovery string generation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Authenticate using recovery string
export const authenticateWithRecovery = async (req: Request, res: Response) => {
  try {
    const { recoveryString } = req.body;

    if (!recoveryString) {
      res.status(400).json({ error: "Recovery string required" });
      return;
    }

    // Find recovery document
    const recovery = await Recovery.findOne({ recoveryString });
    if (!recovery) {
      res.status(401).json({ error: "Invalid recovery string" });
      return;
    }

    // Find player
    const player = await Player.findById(recovery.playerId);
    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    // Generate JWT token (30 days)
    const token = jwt.sign(
      {
        playerId: player._id,
        guestId: player.guestId,
        walletAddress: player.walletAddress,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      },
      process.env.JWT_SECRET || "fallback-secret"
    );

    res.json({
      token,
      player,
    });
  } catch (error) {
    console.error("Recovery authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
