
import { apiRequest, loadGameState, saveGameState } from '../database';
import { initialChatState } from '../models/chat.model';
import { ALL_MESSAGES } from '../../features/chat/constants';
import { ChatMessage, ChatState } from '../../features/chat/types';

const BOT_RESPONSES: { keywords: string[], response: string }[] = [
    { keywords: ['hello', 'hi', 'hey'], response: 'Hey there! Good to see you.' },
    { keywords: ['luck'], response: 'Thanks, you too!' },
    { keywords: ['win', 'roll', 'lucky'], response: 'Let\'s see that winning streak!' },
    { keywords: ['bye', 'see you', 'cashing out'], response: 'Catch you later!' },
    { keywords: ['lol', 'haha'], response: 'Haha!' },
];

const BOTS = [
    { userId: 'lady-luck', userName: 'LadyLuck', avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/2.jpeg' },
    { userId: 'high-roller', userName: 'HighRoller', avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/3.jpeg' },
    { userId: 'ace-player', userName: 'AcePlayer', avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/4.jpeg' },
];

const getBotResponse = (message: string): ChatMessage | null => {
    const lowerCaseMessage = message.toLowerCase();
    for (const rule of BOT_RESPONSES) {
        if (rule.keywords.some(kw => lowerCaseMessage.includes(kw))) {
            const randomBot = BOTS[Math.floor(Math.random() * BOTS.length)];
            return {
                id: crypto.randomUUID(),
                ...randomBot,
                text: rule.response,
                timestamp: new Date().toISOString(),
            };
        }
    }
    return null;
}

export const getHistory = () => {
    let state = loadGameState('chat', initialChatState);
    saveGameState('chat', state);
    return apiRequest(state);
}

export const sendMessage = (text: string) => {
    let state: ChatState = loadGameState('chat', initialChatState);
    state.log = null;

    if (!ALL_MESSAGES.includes(text)) {
        state.log = { type: 'error', message: 'Invalid message.' };
        return apiRequest(state, 50);
    }
    
    const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        userId: 'currentPlayer',
        userName: 'You',
        avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/33.jpeg',
        text,
        timestamp: new Date().toISOString()
    };
    state.messages.push(userMessage);

    const botResponse = getBotResponse(text);
    if (botResponse) {
        // Delay bot response
        setTimeout(() => {
            let currentState = loadGameState('chat', initialChatState);
            currentState.messages.push(botResponse);
            saveGameState('chat', currentState);
        }, 1000 + Math.random() * 1500);
    }

    saveGameState('chat', state);
    return apiRequest(state, 200);
}
