import { API_URL } from "../../../config/api";
import { ChatMessage, ChatState } from "../features/chat/types";

const API_BASE_URL = `${API_URL}/chat`;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper function to make authenticated API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.data || data;
};

// Chat API functions
export const chatApi = {
  // Send a message
  async sendMessage(
    text: string,
    room: string = "main",
    playerId?: string
  ): Promise<ChatMessage> {
    return apiRequest<ChatMessage>("/message", {
      method: "POST",
      body: JSON.stringify({ text, room, playerId }),
    });
  },

  // Get message history
  async getHistory(
    room?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatMessage[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(room && { room }),
    });

    return apiRequest<ChatMessage[]>(`/history?${params}`);
  },

  // Get messages for a specific room
  async getMessages(
    room: string = "main",
    limit: number = 50,
    offset: number = 0
  ): Promise<ChatMessage[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      room,
    });

    return apiRequest<ChatMessage[]>(`/messages?${params}`);
  },

  // Get available chat rooms
  async getRooms(): Promise<any[]> {
    return apiRequest<any[]>("/rooms");
  },

  // Join a room
  async joinRoom(
    roomId: string
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(
      `/rooms/${roomId}/join`,
      {
        method: "POST",
      }
    );
  },

  // Leave a room
  async leaveRoom(
    roomId: string
  ): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(
      `/rooms/${roomId}/leave`,
      {
        method: "POST",
      }
    );
  },

  // Get room users
  async getRoomUsers(roomId: string): Promise<any[]> {
    return apiRequest<any[]>(`/rooms/${roomId}/users`);
  },

  // Delete a message (if user owns it)
  async deleteMessage(messageId: string): Promise<void> {
    return apiRequest<void>(`/message/${messageId}`, {
      method: "DELETE",
    });
  },

  // Report a message
  async reportMessage(messageId: string, reason: string): Promise<any> {
    return apiRequest<any>(`/message/${messageId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};
