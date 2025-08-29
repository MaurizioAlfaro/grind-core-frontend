
import { useState, useCallback, useEffect } from 'react';
import * as chatApi from '../../../mockApi/routes/chat.routes';
import { ChatMessage, ChatState } from '../types';

export const useChatLogic = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const updateStateFromApi = (apiState: ChatState) => {
        setMessages(apiState.messages);
        if (apiState.log) {
            console.log(`Chat API Log [${apiState.log.type}]: ${apiState.log.message}`);
        }
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const initialState = await chatApi.getHistory();
            updateStateFromApi(initialState);
            setIsLoading(false);
        };
        init();
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        setIsLoading(true);
        try {
            const newState = await chatApi.sendMessage(text);
            updateStateFromApi(newState);
        } catch (error) {
            console.error("Chat API Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Simple polling to get bot messages
    useEffect(() => {
        const interval = setInterval(async () => {
            const latestState = await chatApi.getHistory();
            setMessages(latestState.messages);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
    };
};
