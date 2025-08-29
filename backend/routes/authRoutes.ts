import express from "express";
import {
  getNonce,
  authenticate,
  disconnect,
  createNewAccount,
  generateRecoveryString,
  authenticateWithRecovery,
  linkWallet,
  refreshNFTs,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/nonce", getNonce);
router.post("/authenticate", authenticate);
router.post("/new-account", createNewAccount);
router.post("/link-wallet", linkWallet);

// Protected routes
router.post("/disconnect", authMiddleware, disconnect);
router.post("/generate-recovery", authMiddleware, generateRecoveryString);
router.post("/refresh-nfts", authMiddleware, refreshNFTs);

// Public recovery route
router.post("/recovery", authenticateWithRecovery);

export default router;
