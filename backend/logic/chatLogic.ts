export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  roomId: string;
  messageType: "text" | "system" | "emoji" | "command";
  isDeleted?: boolean;
  editedAt?: Date;
  originalMessage?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  maxUsers: number;
  currentUsers: number;
  createdBy: string;
  createdAt: Date;
  lastActivity: Date;
  rules?: string[];
  moderators: string[];
}

export interface ChatUser {
  id: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
  joinDate: Date;
  isModerator: boolean;
  isAdmin: boolean;
  avatar?: string;
  status?: string;
}

export interface ChatSettings {
  maxMessageLength: number;
  maxMessagesPerMinute: number;
  maxUsersPerRoom: number;
  messageRetentionDays: number;
  profanityFilter: boolean;
  autoModeration: boolean;
}

export class ChatLogic {
  static readonly defaultSettings: ChatSettings = {
    maxMessageLength: 500,
    maxMessagesPerMinute: 10,
    maxUsersPerRoom: 100,
    messageRetentionDays: 30,
    profanityFilter: true,
    autoModeration: true,
  };

  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static validateMessage(
    message: string,
    settings: ChatSettings
  ): string | null {
    if (!message || message.trim().length === 0) {
      return "Message cannot be empty";
    }

    if (message.length > settings.maxMessageLength) {
      return `Message too long. Maximum length is ${settings.maxMessageLength} characters`;
    }

    // Basic profanity filter (simplified)
    if (settings.profanityFilter) {
      const profanityWords = ["badword1", "badword2", "badword3"]; // This would be expanded
      const lowerMessage = message.toLowerCase();
      for (const word of profanityWords) {
        if (lowerMessage.includes(word)) {
          return "Message contains inappropriate content";
        }
      }
    }

    return null;
  }

  static validateUsername(username: string): string | null {
    if (!username || username.trim().length === 0) {
      return "Username cannot be empty";
    }

    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }

    if (username.length > 20) {
      return "Username must be less than 20 characters long";
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }

    return null;
  }

  static validateRoomName(name: string): string | null {
    if (!name || name.trim().length === 0) {
      return "Room name cannot be empty";
    }

    if (name.length < 3) {
      return "Room name must be at least 3 characters long";
    }

    if (name.length > 50) {
      return "Room name must be less than 50 characters long";
    }

    return null;
  }

  static sanitizeMessage(message: string): string {
    // Remove HTML tags and potentially dangerous content
    return message
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim();
  }

  static formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return timestamp.toLocaleDateString();
  }

  static canUserModerate(userId: string, room: ChatRoom): boolean {
    return room.moderators.includes(userId) || room.createdBy === userId;
  }

  static canUserDeleteMessage(
    userId: string,
    message: ChatMessage,
    room: ChatRoom
  ): boolean {
    return message.userId === userId || this.canUserModerate(userId, room);
  }

  static canUserEditMessage(userId: string, message: ChatMessage): boolean {
    return message.userId === userId;
  }

  static isMessageRateLimited(
    userId: string,
    lastMessageTime: Date,
    settings: ChatSettings
  ): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - lastMessageTime.getTime();
    const minutesDiff = timeDiff / 60000;

    return minutesDiff < 1 / settings.maxMessagesPerMinute;
  }

  static createSystemMessage(message: string, roomId: string): ChatMessage {
    return {
      id: this.generateMessageId(),
      userId: "system",
      username: "System",
      message,
      timestamp: new Date(),
      roomId,
      messageType: "system",
    };
  }

  static createWelcomeMessage(username: string, roomId: string): ChatMessage {
    return this.createSystemMessage(`${username} has joined the room`, roomId);
  }

  static createLeaveMessage(username: string, roomId: string): ChatMessage {
    return this.createSystemMessage(`${username} has left the room`, roomId);
  }

  static createRoomCreatedMessage(
    roomName: string,
    roomId: string
  ): ChatMessage {
    return this.createSystemMessage(
      `Room "${roomName}" has been created`,
      roomId
    );
  }

  static parseCommand(
    message: string
  ): { command: string; args: string[] } | null {
    if (!message.startsWith("/")) return null;

    const parts = message.slice(1).split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    return { command, args };
  }

  static isValidCommand(command: string): boolean {
    const validCommands = [
      "help",
      "me",
      "roll",
      "dice",
      "flip",
      "coin",
      "time",
      "weather",
      "ban",
      "kick",
      "mute",
      "unmute",
      "clear",
      "rules",
      "info",
    ];

    return validCommands.includes(command);
  }

  static executeCommand(
    command: string,
    args: string[],
    userId: string,
    room: ChatRoom
  ): ChatMessage | null {
    switch (command) {
      case "roll":
      case "dice":
        const sides = args[0] ? parseInt(args[0]) : 6;
        const result = Math.floor(Math.random() * sides) + 1;
        return this.createSystemMessage(
          `${userId} rolled a ${sides}-sided die: ${result}`,
          room.id
        );

      case "flip":
      case "coin":
        const coinResult = Math.random() < 0.5 ? "Heads" : "Tails";
        return this.createSystemMessage(
          `${userId} flipped a coin: ${coinResult}`,
          room.id
        );

      case "time":
        const time = new Date().toLocaleTimeString();
        return this.createSystemMessage(`Current time: ${time}`, room.id);

      case "help":
        return this.createSystemMessage(
          `Available commands: /roll [sides], /flip, /time, /help`,
          room.id
        );

      default:
        return null;
    }
  }
}
