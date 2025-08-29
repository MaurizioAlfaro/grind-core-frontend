import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All chat routes require authentication
router.use(authenticateToken);

// Message management
router.post("/message", ChatController.sendMessage);
router.get("/messages", ChatController.getMessages);
router.get("/messages/:room", ChatController.getMessagesByRoom);

// Room management
router.get("/rooms", ChatController.getRooms);
router.post("/rooms", ChatController.createRoom);
router.put("/rooms/:roomId", ChatController.updateRoom);
router.delete("/rooms/:roomId", ChatController.deleteRoom);

// User management in rooms
router.post("/rooms/:roomId/join", ChatController.joinRoom);
router.post("/rooms/:roomId/leave", ChatController.leaveRoom);
router.get("/rooms/:roomId/users", ChatController.getRoomUsers);

// Chat history and moderation
router.get("/history", ChatController.getChatHistory);
router.delete("/message/:messageId", ChatController.deleteMessage);
router.post("/message/:messageId/report", ChatController.reportMessage);

export default router;
