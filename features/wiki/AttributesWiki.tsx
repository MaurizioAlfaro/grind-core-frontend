

import React, { useState } from 'react';
import { ENCHANTABLE_ATTRIBUTES } from '../../constants/index';
import type { EnchantableAttribute } from '../../types';

type WikiTab = 'attributes' | 'mechanics' | 'items';

const EnchantmentCard: React.FC<{ attribute: EnchantableAttribute }> = ({ attribute }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const tierColorClasses: { [key: number]: string } = {
        1: 'bg-gray-700 text-gray-300',
        2: 'bg-green-900/80 text-green-300 border border-green-800',
        3: 'bg-blue-900/80 text-blue-300 border border-blue-800',
        4: 'bg-purple-900/80 text-purple-300 border border-purple-800',
        5: 'bg-orange-900/80 text-orange-300 border border-orange-800',
    };

    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 transition-all">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-800/50 rounded-t-lg"
                aria-expanded={isExpanded}
                aria-controls={`attribute-details-${attribute.id}`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{attribute.icon}</span>
                    <h4 className="text-lg font-bold font-orbitron text-cyan-300">{attribute.name}</h4>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isExpanded && (
                <div id={`attribute-details-${attribute.id}`} className="px-4 pb-4 border-t border-gray-700 animate-fade-in-up">
                    <div className="pt-4 space-y-2">
                        <p className="text-sm text-gray-400 mt-1">{attribute.baseDescription}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <h5 className="text-md font-bold text-gray-300">Tiers:</h5>
                        {attribute.tierValues.map((_value, index) => {
                             const tierLevel = index + 1;
                             return (
                                <div key={tierLevel} className={`flex items-center gap-3 text-sm p-2 rounded-md ${tierColorClasses[tierLevel] || 'bg-gray-700'}`}>
                                    <span className="font-bold w-12">Tier {tierLevel}</span>
                                    <span className="flex-1">{attribute.effectDescription(tierLevel)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};


export const EnchantmentsWiki: React.FC = () => {
    const attributesByCategory = Object.values(ENCHANTABLE_ATTRIBUTES).reduce((acc, attr) => {
        if (!acc[attr.category]) {
            acc[attr.category] = [];
        }
        acc[attr.category].push(attr);
        return acc;
    }, {} as Record<string, EnchantableAttribute[]>);

    const categoryOrder = ['Offense', 'Resource', 'Utility', 'Lab'];
    const sortedCategories = Object.entries(attributesByCategory).sort(([a], [b]) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        'Offense': true, // Start with Offense expanded
    });

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <div className="space-y-2">
            {sortedCategories.map(([category, attributes]) => (
                <div key={category} className="bg-gray-800/50 rounded-lg border border-gray-700">
                    <button
                        onClick={() => toggleCategory(category)}
                        className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-800/30 rounded-lg"
                        aria-expanded={expandedCategories[category]}
                        aria-controls={`category-details-${category.replace(/\s/g, '-')}`}
                    >
                        <h3 className="text-2xl font-orbitron text-yellow-400">{category}</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedCategories[category] ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    {expandedCategories[category] && (
                        <div id={`category-details-${category.replace(/\s/g, '-')}`} className="p-4 border-t border-gray-700/50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {attributes.sort((a,b) => a.name.localeCompare(b.name)).map(attr => (
                                    <EnchantmentCard key={attr.id} attribute={attr} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};