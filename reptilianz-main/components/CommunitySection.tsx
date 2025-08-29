import React from 'react';
import { TwitterIcon, SolanaIcon } from './Icons';
import GlitchText from './GlitchText';
import { SocialLink } from '../types';

const socialLinks: SocialLink[] = [
    { name: 'Twitter', url: 'https://x.com/repznft', Icon: TwitterIcon },
    { name: 'Magic Eden', url: 'https://magiceden.io/marketplace/reptilianz', Icon: SolanaIcon },
];

const CommunitySection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-fuchsia-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-12">
                <GlitchText className="text-fuchsia-400 text-shadow-neon-fuchsia">
                    Join The Horde
                </GlitchText>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {socialLinks.map(({ name, url, Icon }) => (
                    <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={name}
                        className="group text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <div className="p-5 bg-black/50 border-4 border-fuchsia-500/50 rounded-full group-hover:border-fuchsia-400 group-hover:animate-pulse transition-all duration-300">
                           <Icon className="w-16 h-16 md:w-20 md:h-20 text-fuchsia-400 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default CommunitySection;