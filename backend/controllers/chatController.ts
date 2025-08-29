import { Request, Response } from "express";
import { ChatService } from "../services/chatService";

export class ChatController {
  // Send a message
  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { text, room = "main" } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Valid message text is required",
        });
      }

      if (text.length > 500) {
        return res.status(400).json({
          success: false,
          error: "Message too long (max 500 characters)",
        });
      }

      const message = await ChatService.sendMessage(userId, text, room);

      return res.json({
        success: true,
        data: message,
        message: "Message sent successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  }

  // Get messages
  static async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { limit = 50, offset = 0, room = "main" } = req.query;

      const messages = await ChatService.getMessages(userId, {
        limit: Number(limit),
        offset: Number(offset),
        room: String(room),
      });

      return res.json({
        success: true,
        data: messages,
        message: "Messages retrieved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get messages",
      });
    }
  }

  // Get messages by room
  static async getMessagesByRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { room } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      if (!room) {
        return res.status(400).json({
          success: false,
          error: "Room parameter is required",
        });
      }

      const messages = await ChatService.getMessages(userId, {
        limit: Number(limit),
        offset: Number(offset),
        room,
      });

      return res.json({
        success: true,
        data: messages,
        message: "Room messages retrieved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get room messages",
      });
    }
  }

  // Get available rooms
  static async getRooms(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const rooms = await ChatService.getRooms(userId);

      return res.json({
        success: true,
        data: rooms,
        message: "Rooms retrieved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to get rooms",
      });
    }
  }

  // Create a new room
  static async createRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, description, isPrivate = false } = req.body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Valid room name is required",
        });
      }

      if (name.length > 50) {
        return res.status(400).json({
          success: false,
          error: "Room name too long (max 50 characters)",
        });
      }

      const room = await ChatService.createRoom(
        userId,
        name,
        description,
        isPrivate
      );

      return res.json({
        success: true,
        data: room,
        message: "Room created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create room",
      });
    }
  }

  // Update room
  static async updateRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId } = req.params;
      const { name, description, isPrivate } = req.body;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: "Room ID is required",
        });
      }

      const room = await ChatService.updateRoom(userId, roomId, {
        name,
        description,
        isPrivate,
      });

      return res.json({
        success: true,
        data: room,
        message: "Room updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update room",
      });
    }
  }

  // Delete room
  static async deleteRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: "Room ID is required",
        });
      }

      await ChatService.deleteRoom(userId, roomId);

      return res.json({
        success: true,
        message: "Room deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete room",
      });
    }
  }

  // Join room
  static async joinRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: "Room ID is required",
        });
      }

      const result = await ChatService.joinRoom(userId, roomId);

      return res.json({
        success: true,
        data: result,
        message: "Joined room successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to join room",
      });
    }
  }

  // Leave room
  static async leaveRoom(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: "Room ID is required",
        });
      }

      await ChatService.leaveRoom(userId, roomId);

      return res.json({
        success: true,
        message: "Left room successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to leave room",
      });
    }
  }

  // Get room users
  static async getRoomUsers(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          error: "Room ID is required",
        });
      }

      const users = await ChatService.getRoomUsers(userId, roomId);

      return res.json({
        success: true,
        data: users,
        message: "Room users retrieved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get room users",
      });
    }
  }

  // Get chat history
  static async getChatHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { limit = 100, offset = 0, room } = req.query;

      const history = await ChatService.getChatHistory(userId, {
        limit: Number(limit),
        offset: Number(offset),
        room: room ? String(room) : undefined,
      });

      return res.json({
        success: true,
        data: history,
        message: "Chat history retrieved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get chat history",
      });
    }
  }

  // Delete message (moderation)
  static async deleteMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { messageId } = req.params;

      if (!messageId) {
        return res.status(400).json({
          success: false,
          error: "Message ID is required",
        });
      }

      await ChatService.deleteMessage(userId, messageId);

      return res.json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete message",
      });
    }
  }

  // Report message
  static async reportMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { messageId } = req.params;
      const { reason } = req.body;

      if (!messageId) {
        return res.status(400).json({
          success: false,
          error: "Message ID is required",
        });
      }

      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Report reason is required",
        });
      }

      const report = await ChatService.reportMessage(userId, messageId, reason);

      return res.json({
        success: true,
        data: report,
        message: "Message reported successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to report message",
      });
    }
  }
}
