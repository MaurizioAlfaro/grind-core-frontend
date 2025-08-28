import express from "express";
import {
  getNonce,
  authenticate,
  disconnect,
  createNewAccount,
  generateRecoveryString,
  authenticateWithRecovery,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/nonce", getNonce);
router.post("/authenticate", authenticate);
router.post("/new-account", createNewAccount);

// Protected routes
router.post("/disconnect", authMiddleware, disconnect);
router.post("/generate-recovery", authMiddleware, generateRecoveryString);

// Public recovery route
router.post("/recovery", authenticateWithRecovery);

export default router;
