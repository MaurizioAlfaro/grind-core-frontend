import { ChatMessage } from "../models/chatMessageModel";
import Player from "../models/playerModel";

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
}

import mongoose from "mongoose";

export interface ChatMessageData {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
  room: string;
}

export class ChatService {
  // Send a message
  static async sendMessage(
    userId: string,
    text: string,
    room: string = "main"
  ): Promise<ChatMessageData> {
    try {
      // Get user information
      const player = await Player.findById(userId);
      if (!player) {
        throw new Error("Player not found");
      }

      // Create message
      const message = await ChatMessage.create({
        userId,
        username: player.username || `Player_${player._id}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          player.username || player._id
        }`,
        text: text.trim(),
        room,
        timestamp: new Date(),
      });

      return {
        id: (message._id as mongoose.Types.ObjectId).toString(),
        userId: message.userId.toString(),
        username: message.username,
        avatar: message.avatar,
        text: message.text,
        timestamp: message.timestamp,
        room: message.room,
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  // Get messages
  static async getMessages(
    userId: string,
    options: { limit: number; offset: number; room: string }
  ): Promise<ChatMessageData[]> {
    try {
      const messages = await ChatMessage.find({ room: options.room })
        .sort({ timestamp: -1 })
        .skip(options.offset)
        .limit(options.limit)
        .lean();

      return messages.map((message) => ({
        id: (message._id as mongoose.Types.ObjectId).toString(),
        userId: message.userId.toString(),
        username: message.username,
        avatar: message.avatar,
        text: message.text,
        timestamp: message.timestamp,
        room: message.room,
      }));
    } catch (error) {
      throw new Error(`Failed to get messages: ${error}`);
    }
  }

  // Get available rooms
  static async getRooms(userId: string): Promise<ChatRoom[]> {
    try {
      // For now, return default rooms
      // In a real implementation, you'd query a rooms collection
      const defaultRooms: ChatRoom[] = [
        {
          id: "main",
          name: "General Chat",
          description: "Main chat room for all users",
          isPrivate: false,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          userCount: 0, // This would be calculated from active users
        },
        {
          id: "casino",
          name: "Casino Talk",
          description: "Discuss casino games and strategies",
          isPrivate: false,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          userCount: 0,
        },
        {
          id: "support",
          name: "Support",
          description: "Get help and support",
          isPrivate: false,
          createdBy: "system",
          createdAt: new Date(),
          updatedAt: new Date(),
          userCount: 0,
        },
      ];

      return defaultRooms;
    } catch (error) {
      throw new Error(`Failed to get rooms: ${error}`);
    }
  }

  // Create a new room
  static async createRoom(
    userId: string,
    name: string,
    description?: string,
    isPrivate: boolean = false
  ): Promise<ChatRoom> {
    try {
      // In a real implementation, you'd create a room in a rooms collection
      const room: ChatRoom = {
        id: `room_${Date.now()}`,
        name: name.trim(),
        description: description?.trim(),
        isPrivate,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        userCount: 1, // Creator is automatically added
      };

      return room;
    } catch (error) {
      throw new Error(`Failed to create room: ${error}`);
    }
  }

  // Update room
  static async updateRoom(
    userId: string,
    roomId: string,
    updates: { name?: string; description?: string; isPrivate?: boolean }
  ): Promise<ChatRoom> {
    try {
      // In a real implementation, you'd update the room in a rooms collection
      // For now, return a mock updated room
      const room: ChatRoom = {
        id: roomId,
        name: updates.name || "Updated Room",
        description: updates.description,
        isPrivate: updates.isPrivate || false,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        userCount: 0,
      };

      return room;
    } catch (error) {
      throw new Error(`Failed to update room: ${error}`);
    }
  }

  // Delete room
  static async deleteRoom(userId: string, roomId: string): Promise<void> {
    try {
      // In a real implementation, you'd delete the room and all associated messages
      // For now, just delete messages in that room
      await ChatMessage.deleteMany({ room: roomId });
    } catch (error) {
      throw new Error(`Failed to delete room: ${error}`);
    }
  }

  // Join room
  static async joinRoom(
    userId: string,
    roomId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // In a real implementation, you'd add the user to the room's user list
      // For now, just return success
      return {
        success: true,
        message: `Joined room ${roomId} successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to join room: ${error}`);
    }
  }

  // Leave room
  static async leaveRoom(
    userId: string,
    roomId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // In a real implementation, you'd remove the user from the room's user list
      // For now, just return success
      return {
        success: true,
        message: `Left room ${roomId} successfully`,
      };
    } catch (error) {
      throw new Error(`Failed to leave room: ${error}`);
    }
  }

  // Get room users
  static async getRoomUsers(userId: string, roomId: string): Promise<any[]> {
    try {
      // In a real implementation, you'd query the room's user list
      // For now, return mock data
      return [
        {
          id: userId,
          username: "Current User",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
          isOnline: true,
        },
      ];
    } catch (error) {
      throw new Error(`Failed to get room users: ${error}`);
    }
  }

  // Get chat history
  static async getChatHistory(
    userId: string,
    options: { limit: number; offset: number; room?: string }
  ): Promise<ChatMessageData[]> {
    try {
      const query: any = {};
      if (options.room) {
        query.room = options.room;
      }

      const messages = await ChatMessage.find(query)
        .sort({ timestamp: -1 })
        .skip(options.offset)
        .limit(options.limit)
        .lean();

      return messages.map((message) => ({
        id: (message._id as mongoose.Types.ObjectId).toString(),
        userId: message.userId.toString(),
        username: message.username,
        avatar: message.avatar,
        text: message.text,
        timestamp: message.timestamp,
        room: message.room,
      }));
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error}`);
    }
  }

  // Delete message (moderation)
  static async deleteMessage(userId: string, messageId: string): Promise<void> {
    try {
      const message = await ChatMessage.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      // Check if user can delete the message (own message or moderator)
      if (message.userId.toString() !== userId) {
        // In a real implementation, check if user is moderator
        throw new Error("Not authorized to delete this message");
      }

      await ChatMessage.findByIdAndDelete(messageId);
    } catch (error) {
      throw new Error(`Failed to delete message: ${error}`);
    }
  }

  // Report message
  static async reportMessage(
    userId: string,
    messageId: string,
    reason: string
  ): Promise<{
    id: string;
    messageId: string;
    reason: string;
    reportedBy: string;
    timestamp: Date;
  }> {
    try {
      const message = await ChatMessage.findById(messageId);
      if (!message) {
        throw new Error("Message not found");
      }

      // In a real implementation, you'd create a report in a reports collection
      const report = {
        id: `report_${Date.now()}`,
        messageId,
        reason: reason.trim(),
        reportedBy: userId,
        timestamp: new Date(),
      };

      return report;
    } catch (error) {
      throw new Error(`Failed to report message: ${error}`);
    }
  }
}
