
import { ChatState } from '../../features/chat/types';

export const initialChatState: ChatState = {
    messages: [
        {
            id: '1',
            userId: 'casino-bot',
            userName: 'Casino Bot',
            avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/1.jpeg',
            text: 'Welcome to the table! Please be respectful and have fun. Good luck!',
            timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
        },
        {
            id: '2',
            userId: 'lady-luck',
            userName: 'LadyLuck',
            avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/2.jpeg',
            text: 'Hey everyone! Ready to win big?',
            timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
        },
        {
            id: '3',
            userId: 'high-roller',
            userName: 'HighRoller',
            avatar: 'https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/3.jpeg',
            text: 'Hello! Good luck to you all.',
            timestamp: new Date(Date.now() - 60000 * 2).toISOString(),
        },
    ],
    log: null,
}
