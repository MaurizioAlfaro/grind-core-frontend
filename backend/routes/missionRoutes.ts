import express from "express";
import {
  startMissionController,
  claimMissionController,
  cancelMissionController,
} from "../controllers/missionController";
import { playerMiddleware } from "../middleware/playerMiddleware";

const router = express.Router();

router.post("/start", playerMiddleware, startMissionController);
router.post("/claim", playerMiddleware, claimMissionController);
router.post("/cancel", playerMiddleware, cancelMissionController);

export default router;
