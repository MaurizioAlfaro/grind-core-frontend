import React from 'react';
import type { PlayerState, Homunculus, FoodItem, HomunculusTrait } from '../../types';
import { ITEMS, MAX_TRAIT_LEVEL, TRAIT_ICONS } from '../../constants/index';
import { StyledButton } from '../../components/common/StyledButton';
import { ItemType } from '../../types';

interface FeedingModalProps {
    homunculus: Homunculus;
    player: PlayerState;
    onFeed: (homunculusId: number, foodItemId: string) => void;
    onClose: () => void;
}

const RarityTextMap: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-500',
    Legendary: 'text-orange-500',
};

const TraitProgressBar: React.FC<{ trait: HomunculusTrait, value: number }> = ({ trait, value }) => {
    const progress = (value / MAX_TRAIT_LEVEL) * 100;

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-6 text-center" title={trait}>{TRAIT_ICONS[trait]}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-4 p-0.5">
                <div 
                    className="bg-yellow-400 h-full rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                >
                </div>
            </div>
             <span className="w-10 text-right font-mono text-white">{value}/{MAX_TRAIT_LEVEL}</span>
        </div>
    );
};

const FoodCard: React.FC<{
    food: FoodItem;
    quantity: number;
    onFeed: () => void;
    disabled: boolean;
}> = ({ food, quantity, onFeed, disabled }) => (
    <button
        onClick={onFeed}
        disabled={disabled}
        className="flex items-center w-full gap-3 p-2 bg-gray-900/50 rounded-md text-left hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <span className="text-3xl w-8 text-center">{food.icon}</span>
        <div className="flex-1">
            <p className={`font-semibold ${RarityTextMap[food.rarity]}`}>{food.name}</p>
            <p className="text-sm text-gray-500">+{food.value} {food.trait}</p>
        </div>
        <p className="text-sm font-bold text-cyan-400">x{quantity}</p>
    </button>
);


export const FeedingModal: React.FC<FeedingModalProps> = ({ homunculus, player, onFeed, onClose }) => {
    
    const availableFood = player.inventory
        .map(invItem => ({ item: ITEMS[invItem.itemId] as FoodItem, quantity: invItem.quantity }))
        .filter(({item, quantity}) => item && item.type === ItemType.Food && quantity > 0);
        
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
                <div className="p-6">
                    <h2 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2 text-center">Feed Reptilianz</h2>
                    <p className="text-center text-gray-400 mb-4">Increase traits while the creature hibernates.</p>

                    <div className="mb-4 p-3 bg-gray-900/50 rounded-lg space-y-1.5">
                        <h3 className="text-md font-orbitron text-gray-300 mb-2 text-center">Current Traits</h3>
                        {Object.entries(homunculus.traits).map(([trait, value]) => (
                            <TraitProgressBar key={trait} trait={trait as HomunculusTrait} value={value} />
                        ))}
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-900 rounded-lg">
                       {availableFood.length > 0 ? (
                           availableFood.map(({item, quantity}) => {
                                const currentTraitValue = homunculus.traits[item.trait] || 0;
                                const isDisabled = currentTraitValue >= MAX_TRAIT_LEVEL;
                               return (
                                   <FoodCard 
                                       key={item.id}
                                       food={item}
                                       quantity={quantity}
                                       onFeed={() => onFeed(homunculus.id, item.id)}
                                       disabled={isDisabled}
                                   />
                               );
                           })
                       ) : (
                           <p className="text-center text-gray-500 py-8">No food available.</p>
                       )}
                    </div>
                    
                    <StyledButton onClick={onClose} variant="secondary" className="mt-6 w-full">
                        Done
                    </StyledButton>
                </div>
            </div>
        </div>
    );
};