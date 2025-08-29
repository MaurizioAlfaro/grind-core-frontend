import { useState, useCallback, useEffect } from "react";
import { chatApi } from "../../../services/chatApi";
import { ChatMessage } from "../types";

export const useChatLogic = (currentPlayerId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    setError(null);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const messages = await chatApi.getHistory();
        updateMessages(messages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setError("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      setIsLoading(true);
      try {
        // Send message to backend
        await chatApi.sendMessage(text, "main", currentPlayerId);

        // Refresh messages to get the updated state
        const updatedMessages = await chatApi.getHistory();
        updateMessages(updatedMessages);
      } catch (error) {
        console.error("Chat API Error:", error);
        setError("Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPlayerId]
  );

  // Polling to get new messages
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const latestMessages = await chatApi.getHistory();
        updateMessages(latestMessages);
      } catch (error) {
        console.error("Failed to refresh messages:", error);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
