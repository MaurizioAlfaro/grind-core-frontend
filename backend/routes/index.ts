import express from "express";
import authRoutes from "./authRoutes";
import missionRoutes from "./missionRoutes";
import playerRoutes from "./playerRoutes";
import forgeRoutes from "./forgeRoutes";
import storeRoutes from "./storeRoutes";
import bossRoutes from "./bossRoutes";
import labRoutes from "./labRoutes";
import chatRoutes from "./chat";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/missions", missionRoutes);
router.use("/player", playerRoutes);
router.use("/forge", forgeRoutes);
router.use("/store", storeRoutes);
router.use("/bosses", bossRoutes);
router.use("/lab", labRoutes);
router.use("/chat", chatRoutes);

export default router;
