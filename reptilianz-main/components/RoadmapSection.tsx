import React from 'react';
import { RoadmapItem } from '../types';
import GlitchText from './GlitchText';

const roadmapItems: RoadmapItem[] = [
    { level: 'LVL 1', title: 'Free Airdrop', description: 'Genesis collection airdropped to the community.', status: 'completed' },
    { level: 'LVL 2', title: 'Rarity Ranking', description: 'Official rarity tools and listings go live.', status: 'current' },
    { level: 'LVL 3', title: 'Wasteland Lore', description: 'Expanded universe and story chapters released.', status: 'upcoming' },
    { level: 'LVL 4', title: '???', description: 'Top secret mutation protocol initiated.', status: 'upcoming' },
];

const getStatusStyles = (status: RoadmapItem['status']) => {
    switch (status) {
        case 'completed':
            return 'border-cyan-400 bg-cyan-900/50 text-cyan-300';
        case 'current':
            return 'border-lime-400 bg-lime-900/50 text-lime-300 animate-pulse box-shadow-neon-lime';
        case 'upcoming':
            return 'border-gray-600 bg-gray-900/50 text-gray-500';
    }
};

const RoadmapCard: React.FC<{item: RoadmapItem}> = ({ item }) => (
    <div className={`p-6 border-4 border-double ${getStatusStyles(item.status)}`}>
        <p className="font-display text-2xl mb-2">{item.level}</p>
        <h3 className="font-display text-xl mb-4 uppercase tracking-widest">{item.title}</h3>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">{item.description}</p>
    </div>
);

const RoadmapSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section id={id} className="py-20 md:py-32 border-t-2 border-cyan-500/30 relative">
            <h2 className="text-4xl md:text-5xl font-display text-center mb-16">
                <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
                    Level Select
                </GlitchText>
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
                {roadmapItems.map((item, index) => (
                    <React.Fragment key={item.level}>
                        <div className="flex-1">
                            <RoadmapCard item={item} />
                        </div>
                        {index < roadmapItems.length - 1 && (
                            <div className="hidden md:flex items-center text-3xl font-display text-gray-600">
                                &gt;&gt;
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
};

export default RoadmapSection;