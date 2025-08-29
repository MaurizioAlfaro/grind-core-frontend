
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface ChatState {
    messages: ChatMessage[];
    log: {type: 'info' | 'error', message: string} | null;
}
