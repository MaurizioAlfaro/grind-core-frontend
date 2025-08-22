
import React from 'react';
import { ITEMS } from '../../constants/index';
import { ConsumableItem } from '../../types';
import { WikiSection } from './components/WikiSection';

const BuffEntry: React.FC<{ name: string; icon: string; description: string; effect: string; duration: string; }> = ({ name, icon, description, effect, duration }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-md">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-md text-3xl">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-white">{name}</h4>
            <p className="text-sm text-cyan-300">{effect}</p>
            <p className="text-xs text-gray-400 italic">"{description}"</p>
        </div>
        <p className="text-sm font-bold text-yellow-400">{duration}</p>
    </div>
);

export const BuffsWiki: React.FC = () => {
    const consumableBuffs = Object.values(ITEMS)
        .filter(item => item.type === 'Consumable' && (item as ConsumableItem).buffEffect)
        .map(item => item as ConsumableItem);

    const initialBoost = {
        name: 'Initial Insight',
        icon: '🚀',
        description: 'A surge of insight from your first successful operations has unlocked new efficiencies.',
        effect: '15x Mission Speed',
        duration: '10 Minutes',
    };

    return (
        <div className="space-y-4">
            <WikiSection title="Consumable Buffs" startExpanded>
                <p>These temporary enhancements can be purchased from the Store or found as loot. Using one will grant its effect for a limited time. You can have a maximum of 5 active buffs at once.</p>
                <div className="space-y-2 mt-4">
                    {consumableBuffs.map(item => {
                        let effect = '';
                        switch (item.buffEffect!.type) {
                            case 'xp': effect = `+${(item.buffEffect!.value - 1) * 100}% XP`; break;
                            case 'gold': effect = `+${(item.buffEffect!.value - 1) * 100}% Gold`; break;
                            case 'loot': effect = `+${(item.buffEffect!.value - 1) * 100}% Loot Chance`; break;
                            case 'speed': effect = `${((1 - item.buffEffect!.value) * 100).toFixed(0)}% Faster Missions`; break;
                            case 'power': effect = `+${item.buffEffect!.value} Power`; break;
                        }

                        return (
                            <BuffEntry
                                key={item.id}
                                name={item.name}
                                icon={item.icon}
                                description={item.description}
                                effect={effect}
                                duration={`${item.buffEffect!.durationSeconds / 60} Minutes`}
                            />
                        );
                    })}
                </div>
            </WikiSection>
            <WikiSection title="Special Buffs">
                <p>These are unique buffs granted by special game events.</p>
                <div className="space-y-2 mt-4">
                    <BuffEntry {...initialBoost} />
                </div>
            </WikiSection>
        </div>
    );
};