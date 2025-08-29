import React, { useState, useEffect } from 'react';

const Copyright = () => (
    <>
        <p className="text-lg text-gray-500">
            &copy; {new Date().getFullYear()} REPTILIANZ. All rights reserved.
        </p>
        <p className="text-md text-gray-600">
            BUILT FOR THE WASTELAND.
        </p>
    </>
);

const Footer: React.FC = () => {
    const [blinking, setBlinking] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setBlinking(prev => !prev);
        }, 700);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="relative py-12 px-4 border-t-4 border-double border-gray-700 mt-16">
            <div className="text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                    <p className={`font-display text-2xl text-yellow-400 transition-opacity duration-700 ${blinking ? 'opacity-100' : 'opacity-25'}`}>
                        INSERT COIN
                    </p>
                    <div className={`w-2 h-8 bg-yellow-400 transition-opacity duration-700 ${blinking ? 'opacity-100 animate-pulse' : 'opacity-25'}`}></div>
                </div>
               <Copyright />
            </div>
        </footer>
    );
};

export default Footer;