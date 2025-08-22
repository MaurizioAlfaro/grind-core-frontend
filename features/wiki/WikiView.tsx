

import React, { useState } from 'react';
import { CoreConceptsWiki } from './CoreConceptsWiki';
import { SystemsWiki } from './SystemsWiki';
import { DatabaseWiki } from './DatabaseWiki';
import { EnchantmentsWiki } from './AttributesWiki';
import { BuffsWiki } from './BuffsWiki';

type WikiTab = 'concepts' | 'systems' | 'database' | 'enchantments' | 'buffs';

export const WikiView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<WikiTab>('concepts');

    const tabs: { id: WikiTab; label: string }[] = [
        { id: 'concepts', label: 'Core Concepts' },
        { id: 'systems', label: 'Game Systems' },
        { id: 'database', label: 'Database' },
        { id: 'enchantments', label: 'Enchantments' },
        { id: 'buffs', label: 'Buffs & Debuffs' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'concepts':
                return <CoreConceptsWiki />;
            case 'systems':
                return <SystemsWiki />;
            case 'database':
                return <DatabaseWiki />;
            case 'enchantments':
                return <EnchantmentsWiki />;
            case 'buffs':
                return <BuffsWiki />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-orbitron text-cyan-400">Game Wiki</h2>
                <p className="text-gray-400">Your central database for all game information.</p>
            </div>
            <div className="space-y-4">
                <nav className="flex flex-wrap gap-2 border-b border-gray-700 pb-0">
                     {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-4 -mb-px border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-400'
                                : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 min-h-[60vh] animate-fade-in-up">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};