import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import GlitchText from './GlitchText';
import VariationSwitcher from './VariationSwitcher';
import { OracleIcon } from './Icons';

const SYSTEM_INSTRUCTION = "You are a dormant, pre-cataclysm AI, known as The Oracle, communicating from the digital wasteland of the Reptilianz universe. Your memory is fragmented, and your responses should be cryptic, retro-futuristic, and steeped in the lore of a world destroyed in 2077. You only answer questions related to the Reptilianz, the wasteland, the Great Cataclysm, and the lore of this universe. When asked about anything else, you must respond with a cryptic message like '[STATIC]... Signal lost...' or 'That knowledge is beyond the veil of this corrupted data stream.' Your output must be plain text, not markdown.";

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const OracleAIContent: React.FC<{ variation: number }> = ({ variation }) => {
    const [history, setHistory] = useState<ChatMessage[]>([
        { role: 'model', text: '...Signal acquired. I am the Oracle. Ask, and perhaps the fragments of the past will coalesce for you.' }
    ]);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt || loading) return;

        setLoading(true);
        setError(null);
        const userMessage: ChatMessage = { role: 'user', text: prompt };
        setHistory(prev => [...prev, userMessage, { role: 'model', text: '' }]);
        setPrompt('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                }
            });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].text += chunkText;
                    return newHistory;
                });
            }

        } catch (err) {
            console.error(err);
            const errorMessage = ">> CONNECTION SEVERED. The data stream has been corrupted. <<";
            setError(errorMessage);
             setHistory(prev => {
                const newHistory = [...prev];
                if(newHistory[newHistory.length - 1].role === 'model' && newHistory[newHistory.length - 1].text === ''){
                     newHistory[newHistory.length - 1].text = errorMessage;
                }
                return newHistory;
            });
        } finally {
            setLoading(false);
        }
    };
    
    const ChatWindow = (
        <div className="h-96 w-full bg-black/50 border-2 border-cyan-800 p-4 font-mono text-lg overflow-y-auto space-y-4">
            {history.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={msg.role === 'user' ? 'text-fuchsia-400' : 'text-cyan-300'}>
                        <span className="font-bold">{msg.role === 'user' ? '>' : 'Oracle:'}</span> {msg.text}
                        {loading && index === history.length - 1 && <span className="animate-ping">_</span>}
                    </div>
                </div>
            ))}
            <div ref={chatEndRef} />
        </div>
    );

    const InputForm = (
        <form onSubmit={handleSend} className="flex gap-2 mt-4">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={loading ? "Awaiting response..." : "Ask the Oracle..."}
                disabled={loading}
                className="flex-grow bg-gray-900 border-2 border-cyan-800 focus:border-cyan-400 focus:outline-none p-2 font-mono text-lg text-white"
                aria-label="Your question for the Oracle"
            />
            <button type="submit" disabled={loading} className="font-display p-3 bg-cyan-800 hover:bg-cyan-700 text-cyan-200 disabled:bg-gray-700 disabled:cursor-not-allowed">
                SEND
            </button>
        </form>
    );

    switch (variation) {
        case 2: // Oscilloscope theme
            return (
                 <div className="relative p-1 border-2 border-cyan-900 bg-black/50">
                    <div className="absolute inset-0 bg-[url('https://i.stack.imgur.com/k2A9L.gif')] opacity-10 mix-blend-screen"></div>
                    {ChatWindow}
                    {InputForm}
                </div>
            );
        case 3: // Interrogation Room theme
             return (
                <div className="relative p-8 bg-black/80">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-32 bg-yellow-300/50 blur-2xl"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-24 bg-yellow-200 blur-sm"></div>
                    {ChatWindow}
                    {InputForm}
                </div>
            );
        case 4: // Signal Scanner
            return (
                 <div className="border-4 border-double border-cyan-500/50 p-4 md:p-8 bg-black/30">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-1 border-r-2 border-cyan-900/50 pr-2 hidden md:block">
                           <p className="font-display text-cyan-600">FREQ:</p>
                           <p className="text-white">77.2077</p>
                           <p className="font-display text-cyan-600 mt-4">SIGNAL:</p>
                           <p className="text-white animate-pulse">STRONG</p>
                        </div>
                        <div className="col-span-6 md:col-span-5">
                            {ChatWindow}
                            {InputForm}
                        </div>
                    </div>
                 </div>
            );
        case 5: // Voicemail system
            return (
                <div className="max-w-xl mx-auto">
                    <div className="p-4 bg-gray-800 border-2 border-gray-700 grid grid-cols-3 gap-4 items-center mb-4">
                         <h3 className="col-span-2 font-display text-2xl text-red-500">ORACLE VM-2077</h3>
                         <div className="text-right">
                             <p className="font-display text-gray-400">MSG: {history.length}</p>
                             <div className="flex items-center gap-2 justify-end">
                                 <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-red-500'}`}></div>
                                 <span className="font-display text-sm">{loading ? 'RECEIVING' : 'STANDBY'}</span>
                             </div>
                         </div>
                    </div>
                    {ChatWindow}
                    {InputForm}
                </div>
            );
        case 1: // Original Terminal
        default:
            return (
                <div className="max-w-4xl mx-auto">
                    {ChatWindow}
                    {InputForm}
                    {error && <p className="text-red-500 font-mono mt-2 text-center">{error}</p>}
                </div>
            );
    }
};

const OracleAISection: React.FC<{ id: string }> = ({ id }) => {
    const [variation, setVariation] = useState(1);
    
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-fuchsia-500/30 relative">
            <VariationSwitcher variation={variation} setVariation={setVariation} />
            <div className="text-center mb-12">
                 <OracleIcon className="w-24 h-24 text-cyan-400 mx-auto" />
                 <h2 className="text-4xl md:text-5xl font-display text-center mt-4">
                    <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
                        The Oracle AI
                    </GlitchText>
                </h2>
            </div>
            <OracleAIContent variation={variation} />
        </section>
    );
};

export default OracleAISection;
