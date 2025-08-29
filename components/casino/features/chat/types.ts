export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  room?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  log: { type: "info" | "error"; message: string } | null;
}
