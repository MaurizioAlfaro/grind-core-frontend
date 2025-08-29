import React, { useState, useEffect } from 'react';
import GlitchText from './GlitchText';
import VariationSwitcher from './VariationSwitcher';
import { ReptileSpriteIcon, MutationIcon } from './Icons';

// Countdown Timer Logic
const useCountdown = (targetDate: string) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, raw: countDown };
};


const CountdownContent: React.FC<{ variation: number }> = ({ variation }) => {
    const [progress, setProgress] = useState(0);
    // Setting a future date for the countdown. Eg: 2 weeks from now
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    const { days, hours, minutes, seconds, raw } = useCountdown(twoWeeksFromNow.toISOString());

    useEffect(() => {
        if (variation === 1) {
            setProgress(0); // reset
            const timer = setTimeout(() => {
                setProgress(60);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [variation]);
    
    const formatTime = (time: number) => String(time < 0 ? 0 : time).padStart(2, '0');

    // For variation 10
    const totalDuration = 14 * 24 * 60 * 60 * 1000;
    const chargePercentage = Math.min(100, Math.max(0, (1 - raw / totalDuration) * 100));
    
    switch (variation) {
        case 2: // Signal Lost
            return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900 via-fuchsia-900 to-lime-900 animate-pulse opacity-20"></div>
                     <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_6px)]"></div>
                     <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-red-500 text-shadow-neon-fuchsia">
                        <GlitchText>SIGNAL LOST</GlitchText>
                    </h1>
                    <p className="font-display text-2xl text-yellow-400 mt-4 tracking-wider">RE-ESTABLISHING CONNECTION</p>
                </div>
            );

        case 3: // Blueprint
            return (
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center p-8 bg-blue-900/20">
                    <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)', backgroundSize: '2rem 2rem'}}></div>
                    <div className="w-full max-w-2xl border-2 border-cyan-400 p-8 relative bg-[#0d0a1a]/80">
                        <h1 className="font-display text-4xl sm:text-5xl text-cyan-300">CONFIDENTIAL</h1>
                        <p className="text-xl text-gray-300 mt-8 font-mono">// OPERATION: WASTELAND ARCADE</p>
                        <p className="text-xl text-gray-300 mt-2 font-mono">// PROJECT: REPTILIANZ</p>
                        <p className="text-xl text-gray-300 mt-8 font-mono">// LAUNCH_SEQUENCE:</p>
                        <p className="text-3xl text-lime-400 my-2 font-mono animate-pulse">INITIATING...</p>
                    </div>
                </div>
            );

        case 4: // Arcade Maintenance
            return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                     <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-yellow-400">
                        <GlitchText>OUT OF ORDER</GlitchText>
                    </h1>
                    <p className="font-display text-2xl text-cyan-400 mt-4">MAINTENANCE IN PROGRESS</p>
                     <p className="text-xl text-gray-400 mt-12">[ Technicians are currently recalibrating the simulation... ]</p>
                </div>
            );
        case 5: // Countdown Clock
            return (
                 <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-8">ARRIVAL IMMINENT</p>
                    <div className="flex gap-4 md:gap-8">
                        <div className="text-center">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(days)}</p>
                            <p className="font-display text-xl text-gray-400">DAYS</p>
                        </div>
                         <div className="font-display text-5xl md:text-8xl text-lime-400">:</div>
                         <div className="text-center">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(hours)}</p>
                            <p className="font-display text-xl text-gray-400">HOURS</p>
                        </div>
                         <div className="font-display text-5xl md:text-8xl text-lime-400">:</div>
                         <div className="text-center">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(minutes)}</p>
                            <p className="font-display text-xl text-gray-400">MINUTES</p>
                        </div>
                         <div className="font-display text-5xl md:text-8xl text-lime-400">:</div>
                         <div className="text-center">
                            <p className="font-display text-5xl md:text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                            <p className="font-display text-xl text-gray-400">SECONDS</p>
                        </div>
                    </div>
                 </div>
            );
        case 6: // Hibernation Mode
            const BlinkingEye = () => (
                <svg width="256" height="128" viewBox="0 0 256 128" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className="animate-blink w-64 h-32 md:w-[256px] md:h-[128px]">
                    <style>{`.animate-blink { animation: blink-animation 5s infinite step-end; } @keyframes blink-animation { 0% { opacity: 1; } 2% { opacity: 0; } 4% { opacity: 1; } 100% { opacity: 1; } }`}</style>
                    <path d="M128 4C64 4 4 64 4 64S64 124 128 124S252 64 252 64S192 4 128 4Z" fill="#1A2E0F"/>
                    <path d="M128 24C88 24 40 64 40 64S88 104 128 104S216 64 216 64S168 24 128 24Z" fill="#365314"/>
                    <path d="M128 44C108 44 80 64 80 64S108 84 128 84S176 64 176 64S148 44 128 44Z" fill="#84CC16"/>
                    <path d="M128 56V72H112V56H128Z" fill="#D9F99D"/>
                </svg>
            );
            return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <BlinkingEye />
                    <p className="font-display text-2xl text-lime-400 mt-8">HIBERNATION CYCLE ENDING...</p>
                    <p className="font-mono text-xl text-gray-400 mt-2">{`${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                </div>
            );

        case 7: // Wasteland Radio
            return (
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
                    <div className="w-full max-w-2xl border-4 border-double border-yellow-500 bg-yellow-900/30 p-4">
                        <div className="flex justify-between items-center border-b-2 border-yellow-700 pb-2 mb-4">
                            <h2 className="font-display text-2xl text-yellow-400">WASTELAND RADIO</h2>
                            <p className="font-mono text-yellow-500">FREQ: 77.2077 Mhz</p>
                        </div>
                        <div className="h-20 bg-black/50 my-4 flex items-center justify-center text-lime-400 text-3xl font-mono overflow-hidden relative">
                           <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#0d0a1a_2px,#0d0a1a_4px)] opacity-50"></div>
                           <p className="animate-pulse">SIGNAL STABLE</p>
                        </div>
                        <div className="bg-black/50 p-2 font-display text-xl text-red-500 whitespace-nowrap overflow-hidden">
                           <p className="animate-marquee-slow">+++ NEW ARRIVALS DETECTED +++ ETA: {days}D:{hours}H:{minutes}M +++ STANDBY FOR TRANSMISSION +++</p>
                        </div>
                    </div>
                </div>
            );
            
        case 8: // Classified Document
            const Redacted = ({children}: {children: React.ReactNode}) => <span className="bg-black text-black select-none">{children}</span>;
            return (
                 <div className="relative z-10 flex items-center justify-center w-full h-full p-8">
                     <div className="w-full max-w-2xl bg-[#fefce8] text-black font-mono p-8 border-4 border-red-500">
                        <h1 className="text-4xl font-bold text-center border-b-2 border-black pb-2 mb-4">TOP SECRET // EYES ONLY</h1>
                        <p><strong>SUBJECT:</strong> PROJECT REPTILIANZ</p>
                        <p><strong>STATUS:</strong> <Redacted>CONTAINMENT BREACH INEVITABLE</Redacted></p>
                        <p className="my-4">Specimens exhibit <Redacted>UNEXPECTED SENTIENCE AND MUTATIVE</Redacted> properties. Airdrop protocol is the only remaining option to <Redacted>prevent a singularity event.</Redacted></p>
                        <p className="mt-8"><strong>RELEASE PROTOCOL INITIATES IN:</strong></p>
                        <p className="text-3xl text-red-600 font-bold text-center my-4 animate-pulse">{`${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                        <div className="text-right mt-8">
                            <p className="font-bold text-5xl text-red-500/50 -rotate-12">CLASSIFIED</p>
                        </div>
                     </div>
                 </div>
            );

        case 9: // Security System
            return (
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-4">
                    <div className="w-full max-w-5xl text-center">
                        <div className="bg-red-900/80 border-y-4 border-red-500 p-2 mb-4">
                            <h1 className="font-display text-4xl text-red-400 animate-pulse">SYSTEM ARMED - PERIMETER LOCKDOWN</h1>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-4 border-gray-600 p-2 bg-black/50">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-video bg-black relative">
                                    <img src={`https://picsum.photos/seed/cam${i}/400/225`} className="w-full h-full object-cover opacity-30"/>
                                    <div className="absolute inset-0 bg-black/50"></div>
                                    <p className="absolute top-1 left-1 font-mono text-sm text-red-400">CAM 0{i}</p>
                                    <p className="absolute bottom-1 right-1 font-mono text-sm text-green-400">REC</p>
                                </div>
                            ))}
                        </div>
                         <p className="font-display text-2xl text-cyan-400 mt-4">SYSTEM DEACTIVATION IN: {`${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                    </div>
                </div>
            );

        case 10: // Power Core Charging
            return (
                 <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                         <MutationIcon className="w-full h-full text-fuchsia-500/30 animate-spin-slow" />
                         <MutationIcon className="absolute inset-0 w-full h-full text-fuchsia-500/50 animate-pulse" style={{ animationDuration: '3s' }}/>
                    </div>
                    <p className="font-display text-2xl text-fuchsia-400 mt-4">REACTOR CORE CHARGING</p>
                    <div className="w-full max-w-md border-2 border-fuchsia-400 p-1 my-4">
                        <div className="bg-fuchsia-400 h-6 transition-all duration-1000" style={{ width: `${chargePercentage}%`}}></div>
                    </div>
                    <p className="font-display text-xl text-white">{chargePercentage.toFixed(2)}%</p>
                    <p className="font-mono text-lg text-gray-400 mt-2">FULL POWER IN: {`${formatTime(days)}D ${formatTime(hours)}H`}</p>
                 </div>
            );
        case 11: // Retro Computer Desktop
            return (
                <div className="relative z-10 flex items-center justify-center w-full h-full p-4 bg-cyan-900/50">
                    <div className="grid grid-cols-4 w-full h-full max-w-6xl max-h-[800px] gap-4">
                        <div className="col-span-1 flex flex-col items-center gap-4 py-4">
                            <div className="text-center text-lime-300"><ReptileSpriteIcon className="w-16 h-16"/><p className="font-display text-sm">REPTILIANZ.DAT</p></div>
                             <div className="text-center text-lime-300"><MutationIcon className="w-16 h-16"/><p className="font-display text-sm">MUTATE.EXE</p></div>
                        </div>
                        <div className="col-span-3 bg-black/50 border-2 border-gray-600 p-1">
                            <div className="bg-gray-800 p-1 font-display text-white">SYSTEM_UPDATE.BOX</div>
                            <div className="p-4 font-mono text-lime-400">
                                <p>&gt; A critical system update is in progress.</p>
                                <p>&gt; New protocols will be installed.</p>
                                <p className="text-yellow-400 mt-8">&gt; Do not turn off the system.</p>
                                <p className="mt-8">&gt; Automatic reboot in:</p>
                                <p className="font-display text-3xl text-cyan-400 my-4 animate-pulse">{`${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}<span className="animate-ping">_</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 12: // Bomb Defusal
            return (
                 <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                     <div className="w-full max-w-xl border-8 border-gray-700 bg-gray-800 p-4 relative">
                        <div className="absolute -top-4 -left-8 w-4 h-16 bg-red-500/50 transform -rotate-45"></div>
                        <div className="absolute -bottom-4 -right-8 w-4 h-16 bg-blue-500/50 transform -rotate-45"></div>
                        <p className="font-display text-2xl text-yellow-400">CONTAINMENT PROTOCOL</p>
                        <div className="bg-black my-4 p-4 border-2 border-gray-900">
                             <p className="font-display text-9xl text-red-500" style={{ textShadow: '0 0 10px #f00' }}>
                               {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
                            </p>
                        </div>
                         <p className="font-display text-xl text-cyan-400">EXTRACTION IMMINENT. HOLD POSITION.</p>
                     </div>
                 </div>
            );
        case 13: // Vending Machine
            return (
                 <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                     <div className="w-96 h-[600px] bg-red-800 border-4 border-black grid grid-rows-6 p-4 gap-4">
                        <div className="row-span-1 bg-yellow-400/80 flex items-center justify-center">
                            <h2 className="font-display text-4xl text-black -skew-y-3">REPTILIANZ</h2>
                        </div>
                        <div className="row-span-3 bg-black/50 border-2 border-cyan-900 grid grid-cols-2 gap-2 p-2">
                             <div className="bg-cyan-800 flex items-center justify-center"><ReptileSpriteIcon className="w-24 h-24 opacity-50"/></div>
                             <div className="bg-cyan-800 flex items-center justify-center"><ReptileSpriteIcon className="w-24 h-24 opacity-50"/></div>
                             <div className="bg-cyan-800 flex items-center justify-center"><ReptileSpriteIcon className="w-24 h-24 opacity-50"/></div>
                             <div className="bg-cyan-800 flex items-center justify-center"><ReptileSpriteIcon className="w-24 h-24 opacity-50"/></div>
                        </div>
                        <div className="row-span-2 bg-gray-700 border-2 border-black flex flex-col items-center justify-center p-4 gap-2">
                            <p className="font-display text-3xl text-lime-400">RESTOCKING</p>
                            <div className="bg-black p-2 w-full text-center">
                                <p className="font-mono text-3xl text-lime-300 animate-pulse">{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                            </div>
                            <p className="font-display text-xl text-yellow-400">PLEASE WAIT</p>
                        </div>
                     </div>
                 </div>
            );
        case 14: // High Score Entry
             return (
                 <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <div className="w-full max-w-2xl font-display text-white">
                        <h1 className="text-6xl text-cyan-400 text-shadow-neon-cyan mb-8">HIGH SCORES</h1>
                        <div className="text-2xl space-y-2 text-left">
                            <div className="flex justify-between"><span>1. ORACLE</span> <span className="text-fuchsia-400">9999999</span></div>
                            <div className="flex justify-between"><span>2. GLITCH</span> <span className="text-fuchsia-400">8543210</span></div>
                            <div className="flex justify-between"><span>3. UNIT_734</span> <span className="text-fuchsia-400">6012876</span></div>
                            <div className="flex justify-between animate-pulse">
                                <span>4. &gt; NEW CHALLENGER &lt;</span>
                                <span className="text-lime-400">{raw < 0 ? 0 : raw}</span>
                            </div>
                        </div>
                        <p className="text-lime-400 text-3xl mt-12">INSERT COIN TO CONTINUE</p>
                        <p className="text-yellow-400 text-xl mt-2">Next game starts in: {`${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                    </div>
                 </div>
            );

        case 15: // Satellite Lock-On
            const TargetingReticle = () => (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <div className="w-64 h-64 relative">
                        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-red-500 -translate-x-1/2 -translate-y-full"></div>
                        <div className="absolute bottom-0 left-1/2 w-px h-1/2 bg-red-500 -translate-x-1/2 translate-y-full"></div>
                        <div className="absolute left-0 top-1/2 h-px w-1/2 bg-red-500 -translate-y-1/2 -translate-x-full"></div>
                        <div className="absolute right-0 top-1/2 h-px w-1/2 bg-red-500 -translate-y-1/2 translate-x-full"></div>
                        <div className="w-full h-full border-2 border-red-500 rounded-full animate-ping-slow"></div>
                    </div>
                </div>
            );
             return (
                <div className="relative z-10 flex flex-col items-center justify-end text-center w-full h-full p-8">
                     <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: "url('https://picsum.photos/seed/mapview/1920/1080')"}}></div>
                     <TargetingReticle/>
                     <div className="bg-black/80 p-4 border-t-4 border-red-500 w-full max-w-4xl">
                        <h2 className="font-display text-4xl text-red-500">SATELLITE LOCK-ON COMPLETE</h2>
                        <p className="font-display text-2xl text-white mt-2">PAYLOAD DEPLOYMENT IN: {`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</p>
                     </div>
                </div>
            );
        case 16: // Bouncing Arrival
            return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4 md:mb-8">ARRIVAL IMMINENT</p>
                    
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>

                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4 md:mt-8">HIBERNATION CYCLE ENDING...</p>

                    <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 md:gap-8 mt-4">
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(days)}</p>
                            <p className="font-display text-xl text-gray-400">DAYS</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(hours)}</p>
                            <p className="font-display text-xl text-gray-400">HOURS</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(minutes)}</p>
                            <p className="font-display text-xl text-gray-400">MINUTES</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                            <p className="font-display text-xl text-gray-400">SECONDS</p>
                        </div>
                    </div>
                </div>
            );
        case 17: // v16 Responsive: Stacked Timer
            return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4 md:mb-8">ARRIVAL IMMINENT</p>
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>
                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4 md:mt-8">HIBERNATION CYCLE ENDING...</p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-x-2 md:gap-x-4 mt-4">
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(days)}</p>
                            <p className="font-display text-xl text-gray-400">DAYS</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 hidden md:flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(hours)}</p>
                            <p className="font-display text-xl text-gray-400">HOURS</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 hidden md:flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400">{formatTime(minutes)}</p>
                            <p className="font-display text-xl text-gray-400">MINUTES</p>
                        </div>
                        <div className="font-display text-5xl md:text-8xl text-lime-400 hidden md:flex items-center">:</div>
                        <div className="text-center p-2">
                            <p className="font-display text-5xl md:text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                            <p className="font-display text-xl text-gray-400">SECONDS</p>
                        </div>
                    </div>
                </div>
            );
        
        case 18: // v16 Responsive: Compact Grid
             return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4">ARRIVAL IMMINENT</p>
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>
                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4">HIBERNATION CYCLE ENDING...</p>
                     <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center gap-4 mt-4 w-full max-w-sm md:max-w-none">
                        <div className="text-center p-1">
                            <p className="font-display text-5xl md:text-7xl text-lime-400">{formatTime(days)}</p>
                            <p className="font-display text-lg md:text-xl text-gray-400">DAYS</p>
                        </div>
                        <div className="text-center p-1">
                            <p className="font-display text-5xl md:text-7xl text-lime-400">{formatTime(hours)}</p>
                            <p className="font-display text-lg md:text-xl text-gray-400">HOURS</p>
                        </div>
                        <div className="text-center p-1">
                            <p className="font-display text-5xl md:text-7xl text-lime-400">{formatTime(minutes)}</p>
                            <p className="font-display text-lg md:text-xl text-gray-400">MINUTES</p>
                        </div>
                        <div className="text-center p-1">
                            <p className="font-display text-5xl md:text-7xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                            <p className="font-display text-lg md:text-xl text-gray-400">SECONDS</p>
                        </div>
                    </div>
                </div>
            );

        case 19: // v16 Responsive: Wrapped Flex
             return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4 md:mb-8">ARRIVAL IMMINENT</p>
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>
                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4 md:mt-8">HIBERNATION CYCLE ENDING...</p>
                    <div className="w-full flex flex-wrap justify-center items-baseline gap-x-2 sm:gap-x-4 mt-4">
                        <div className="text-center p-1">
                            <p className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400">{formatTime(days)}</p>
                            <p className="font-display text-base md:text-xl text-gray-400">DAYS</p>
                        </div>
                        <div className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400">:</div>
                        <div className="text-center p-1">
                            <p className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400">{formatTime(hours)}</p>
                            <p className="font-display text-base md:text-xl text-gray-400">HOURS</p>
                        </div>
                        <div className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400 hidden sm:block">:</div>
                        <div className="text-center p-1 mt-2 sm:mt-0">
                            <p className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400">{formatTime(minutes)}</p>
                            <p className="font-display text-base md:text-xl text-gray-400">MINUTES</p>
                        </div>
                        <div className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400">:</div>
                        <div className="text-center p-1 mt-2 sm:mt-0">
                            <p className="font-display text-4xl sm:text-6xl md:text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                            <p className="font-display text-base md:text-xl text-gray-400">SECONDS</p>
                        </div>
                    </div>
                </div>
            );
        
        case 20: // v16 Responsive: Digital Clock
             return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4 md:mb-8">ARRIVAL IMMINENT</p>
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>
                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4 md:mt-8">HIBERNATION CYCLE ENDING...</p>
                     <div className="mt-4 text-center">
                        {/* Mobile View */}
                        <div className="md:hidden">
                            <p className="font-display text-4xl sm:text-5xl text-lime-400 animate-pulse">
                                {`${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}
                            </p>
                            <div className="flex justify-around text-xs text-gray-400 mt-1 font-display w-full max-w-xs mx-auto">
                                <span>DAYS</span><span>HRS</span><span>MIN</span><span>SEC</span>
                            </div>
                        </div>
                        
                        {/* Desktop View (same as v16) */}
                        <div className="hidden md:flex flex-wrap justify-center items-center gap-x-8">
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(days)}</p>
                                <p className="font-display text-xl text-gray-400">DAYS</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(hours)}</p>
                                <p className="font-display text-xl text-gray-400">HOURS</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(minutes)}</p>
                                <p className="font-display text-xl text-gray-400">MINUTES</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                                <p className="font-display text-xl text-gray-400">SECONDS</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        
        case 21: // v16 Responsive: Hybrid 2x2
             return (
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
                    <p className="font-display text-3xl text-fuchsia-400 text-shadow-neon-fuchsia mb-4 md:mb-8">ARRIVAL IMMINENT</p>
                    <div className="my-4 animate-bounce">
                        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
                    </div>
                    <p className="font-display text-xl md:text-2xl text-lime-400 mt-4 md:mt-8">HIBERNATION CYCLE ENDING...</p>
                     <div className="mt-4">
                        {/* Mobile and Tablet: 2x2 layout */}
                        <div className="flex flex-col items-center gap-2 lg:hidden">
                            <div className="flex justify-center items-center gap-x-2 sm:gap-x-4">
                                <div className="text-center p-2">
                                    <p className="font-display text-5xl sm:text-6xl text-lime-400">{formatTime(days)}</p>
                                    <p className="font-display text-lg sm:text-xl text-gray-400">DAYS</p>
                                </div>
                                <div className="font-display text-5xl sm:text-6xl text-lime-400 flex items-center">:</div>
                                <div className="text-center p-2">
                                    <p className="font-display text-5xl sm:text-6xl text-lime-400">{formatTime(hours)}</p>
                                    <p className="font-display text-lg sm:text-xl text-gray-400">HOURS</p>
                                </div>
                            </div>
                            <div className="flex justify-center items-center gap-x-2 sm:gap-x-4">
                                <div className="text-center p-2">
                                    <p className="font-display text-5xl sm:text-6xl text-lime-400">{formatTime(minutes)}</p>
                                    <p className="font-display text-lg sm:text-xl text-gray-400">MINUTES</p>
                                </div>
                                <div className="font-display text-5xl sm:text-6xl text-lime-400 flex items-center">:</div>
                                <div className="text-center p-2">
                                    <p className="font-display text-5xl sm:text-6xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                                    <p className="font-display text-lg sm:text-xl text-gray-400">SECONDS</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: original v16 layout */}
                        <div className="hidden lg:flex flex-wrap justify-center items-center gap-x-8">
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(days)}</p>
                                <p className="font-display text-xl text-gray-400">DAYS</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(hours)}</p>
                                <p className="font-display text-xl text-gray-400">HOURS</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400">{formatTime(minutes)}</p>
                                <p className="font-display text-xl text-gray-400">MINUTES</p>
                            </div>
                            <div className="font-display text-8xl text-lime-400 flex items-center">:</div>
                            <div className="text-center p-2">
                                <p className="font-display text-8xl text-lime-400 animate-pulse">{formatTime(seconds)}</p>
                                <p className="font-display text-xl text-gray-400">SECONDS</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 1: // System Initializing
        default:
            return (
                <div className="relative z-10 flex flex-col justify-center text-left w-full max-w-4xl h-full p-8">
                    <p className="font-display text-lime-400 mb-2 w-full">&gt; BOOTING WASTELAND_ARCADE.EXE...</p>
                    <p className="font-display text-lime-400 mb-2 w-full">&gt; LOADING REPTILIANZ_CORE...</p>
                    <div className="w-full border-2 border-lime-400 p-1 my-4">
                        <div className="bg-lime-400 h-6 transition-all duration-1000" style={{ width: `${progress}%`}}></div>
                    </div>
                    <p className="font-display text-lime-400 mb-8 w-full">&gt; INITIALIZATION {progress}% COMPLETE</p>
                    <p className="font-display text-2xl text-cyan-400 w-full animate-pulse">&gt; ETA: UNKNOWN<span className="animate-ping">_</span></p>
                </div>
            );
    }
};

const CountdownPage: React.FC = () => {
    const [variation, setVariation] = useState(1);

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center bg-[#0d0a1a]">
            {/* Background and overlays from App.tsx */}
            <div className="fixed top-0 left-0 w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: `url(https://picsum.photos/seed/countdown/1920/1080)`}}>
                <div className="w-full h-full bg-gradient-to-t from-[#0d0a1a] via-transparent to-black/30"></div>
            </div>
            <div className="fixed top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] pointer-events-none z-[100]"></div>
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99]" style={{ boxShadow: 'inset 0 0 150px 20px rgba(0,0,0,0.85)' }}></div>
            
            <VariationSwitcher variation={variation} setVariation={setVariation} />
            <CountdownContent variation={variation} />
        </div>
    );
};

export default CountdownPage;