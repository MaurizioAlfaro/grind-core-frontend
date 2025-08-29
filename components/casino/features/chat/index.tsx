import React, { useEffect, useRef, useState } from 'react';
import { useChatLogic } from './hooks/useChatLogic';
import Message from './components/Message';
import MessageSelector from './components/MessageSelector';

const Chat: React.FC = () => {
    const { messages, isLoading, sendMessage } = useChatLogic();
    const messagesContainerRef = useRef<null | HTMLDivElement>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);
    const [showScrollDownButton, setShowScrollDownButton] = useState(false);
    const initialLoadDone = useRef(false);

    const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Effect to handle scroll position detection
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Check if user is scrolled to the very bottom (with a tolerance)
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            isAtBottomRef.current = isAtBottom;
            if (isAtBottom) {
                setShowScrollDownButton(false);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect to scroll or show button when new messages arrive
    useEffect(() => {
        if (!initialLoadDone.current) {
            scrollToBottom('auto');
            if (messages.length > 0) {
              initialLoadDone.current = true;
            }
            return;
        }

        if (isAtBottomRef.current) {
            scrollToBottom('smooth');
        } else if (messages.length > 0) {
            setShowScrollDownButton(true);
        }
    }, [messages]);

    return (
        <div className="w-full h-full bg-dark-felt rounded-b-3xl rounded-tr-3xl shadow-2xl p-2 sm:p-4 border-4 sm:border-8 border-black/20 flex flex-col">
            <div className="flex-grow overflow-hidden relative min-h-0">
                <div ref={messagesContainerRef} className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {messages.map((msg) => (
                        <Message key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {showScrollDownButton && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => scrollToBottom('smooth')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 animate-bounce hover:animate-none transition-transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M5.293 11.293a1 1 0 011.414 0L10 14.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            New Messages
                        </button>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 pt-4 border-t-2 border-black/20 overflow-y-auto max-h-[12rem] sm:max-h-[14rem]">
                <MessageSelector onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
}

export default Chat;