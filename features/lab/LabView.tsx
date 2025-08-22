

import React, { useState, useMemo, useEffect } from 'react';
import type { PlayerState, InventoryItem, SlottedParts, Homunculus, HomunculusTrait } from '../../types';
import { ITEMS, LAB_XP_REQUIREMENTS, LAB_LEVEL_PERKS, MAX_LAB_LEVEL, LAB_EQUIPMENT, CORE_COMPONENT_ID, ALL_REPTILIAN_PARTS, TRAIT_ICONS, HOMUNCULUS_RARITY_POWER_MULTIPLIER, POWER_PER_TRAIT_POINT, MAX_TRAIT_LEVEL, ZONES } from '../../constants/index';
import { Tabs } from '../../components/Tabs';
import { StyledButton } from '../../components/common/StyledButton';
import { XpIcon } from '../player/icons/XpIcon';
import { GoldIcon } from '../player/icons/GoldIcon';
import { PowerIcon } from '../player/icons/PowerIcon';
import { DollarIcon } from '../../components/icons/DollarIcon';
import { PartSelectionModal } from './PartSelectionModal';
import { clockService } from '../../services/clockService';
import { ItemRarity, ItemType } from '../../types';
import { ItemIcon } from '../../components/common/ItemIcon';

interface LabViewProps {
    player: PlayerState;
    onInvestXp: (amount: number) => void;
    onCreateHomunculus: (slottedParts: SlottedParts) => void;
    onPurchaseEquipment: (equipmentId: string) => void;
    onShowItemInfo: (itemId: string) => void;
    onStartHibernation: (homunculusId: number) => void;
    onClaimHibernation: (homunculusId: number) => void;
    onOpenFeedingModal: (homunculus: Homunculus) => void;
    onOpenWorkplaceModal: (homunculus: Homunculus) => void;
    onOpenEquippingModal: (homunculus: Homunculus) => void;
    onCollectPay: (homunculusId: number) => void;
}

type SlottedPartState = {
    core: string | null;
    material1: string | null;
    material2: string | null;
};
type SlotType = keyof SlottedPartState;


const LabUpgradesPanel: React.FC<Pick<LabViewProps, 'player' | 'onInvestXp' | 'onPurchaseEquipment'>> = ({ player, onInvestXp, onPurchaseEquipment }) => {
    const [investAmount, setInvestAmount] = useState('');
    const isMaxLevel = player.labLevel >= MAX_LAB_LEVEL;
    const xpForNextLevel = isMaxLevel ? Infinity : LAB_XP_REQUIREMENTS[player.labLevel];
    const progress = isMaxLevel ? 100 : Math.min(100, (player.labXp / xpForNextLevel) * 100);

    const handleInvest = () => {
        const amount = parseInt(investAmount, 10);
        if (!isNaN(amount) && amount > 0) {
            onInvestXp(amount);
            setInvestAmount('');
        }
    };
    
    const handleSetMax = () => {
        setInvestAmount(String(player.xp));
    }

    return (
         <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
            <h3 className="text-lg font-orbitron text-cyan-400 text-center">Lab Level: {player.labLevel}</h3>
            {isMaxLevel ? (
                <p className="text-center text-yellow-400 font-bold">MAX LEVEL REACHED</p>
            ) : (
                <>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress to Level {player.labLevel + 1}</span>
                            <span>{player.labXp.toLocaleString()} / {xpForNextLevel.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                             <input 
                                type="number"
                                value={investAmount}
                                onChange={(e) => setInvestAmount(e.target.value)}
                                placeholder="Amount of XP"
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-500"
                            />
                            <button onClick={handleSetMax} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-cyan-800/80 hover:bg-cyan-700/80 px-2 py-1 rounded">MAX</button>
                        </div>
                        <StyledButton onClick={handleInvest} disabled={!investAmount || parseInt(investAmount) <= 0}>
                            Invest XP
                        </StyledButton>
                    </div>
                </>
            )}
            <div className="text-center space-y-1 pt-2">
                <p className="font-semibold text-gray-300">Current Level Perks:</p>
                <p className="text-sm text-green-400">{LAB_LEVEL_PERKS[player.labLevel].description}</p>
            </div>
            <div className="space-y-3 p-2">
                {Object.values(LAB_EQUIPMENT).map(equip => {
                    const isPurchased = player.purchasedLabEquipmentIds.includes(equip.id);
                    const canAfford = player.gold >= equip.cost;

                    return (
                        <div key={equip.id} className="p-3 bg-gray-900/50 rounded-lg flex items-center gap-4">
                            <span className="text-3xl">{equip.icon}</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{equip.name}</h4>
                                <p className="text-xs text-gray-400">{equip.description}</p>
                            </div>
                            {isPurchased ? (
                                <p className="text-green-400 font-bold">Purchased</p>
                            ) : (
                                <StyledButton onClick={() => onPurchaseEquipment(equip.id)} disabled={!canAfford}>
                                    <div className="flex items-center gap-2">
                                        <GoldIcon className="w-4 h-4" />
                                        <span>{equip.cost.toLocaleString()}</span>
                                    </div>
                                </StyledButton>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CraftingSlot: React.FC<{
    slotType: SlotType;
    itemId: string | null;
    onClick: (slot: SlotType) => void;
    label: string;
    size?: 'large' | 'small';
}> = ({ slotType, itemId, onClick, label, size = 'small' }) => {
    const item = itemId ? ITEMS[itemId] : null;

    const sizeClasses = size === 'large' 
        ? 'w-28 h-32'
        : 'w-24 h-28';

    return (
         <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => onClick(slotType)}
                className={`relative flex flex-col items-center justify-center p-2 bg-gray-900/50 rounded-lg border-2 hover:border-cyan-400 transition-all duration-300 ${item ? 'border-cyan-500' : 'border-dashed border-gray-600'} ${sizeClasses}`}
            >
                {item ? (
                    <>
                        <ItemIcon item={item} className="text-5xl" imgClassName="w-14 h-14 object-contain" />
                        <p className="text-xs text-center font-bold text-white mt-1">{item.name}</p>
                    </>
                ) : (
                    <span className="text-4xl text-gray-600">+</span>
                )}
            </button>
            <span className="text-xs text-gray-400 font-semibold">{label}</span>
         </div>
    );
};

const SynthesisPanel: React.FC<Pick<LabViewProps, 'onCreateHomunculus' | 'player' | 'onShowItemInfo'>> = ({ onCreateHomunculus, player, onShowItemInfo }) => {
    const [slottedParts, setSlottedParts] = useState<SlottedPartState>({ core: null, material1: null, material2: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectingForSlot, setSelectingForSlot] = useState<SlotType | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const canCreate = !!(slottedParts.core && slottedParts.material1 && slottedParts.material2);
    const partsSlottedCount = Object.values(slottedParts).filter(p => p !== null).length;

    const handleSlotClick = (slot: SlotType) => {
        if (slottedParts[slot]) {
            setSlottedParts(prev => ({ ...prev, [slot]: null }));
        } else {
            setSelectingForSlot(slot);
            setIsModalOpen(true);
        }
    };

    const handleSelectPart = (itemId: string) => {
        if (selectingForSlot) {
            setSlottedParts(prev => ({ ...prev, [selectingForSlot]: itemId }));
        }
        setIsModalOpen(false);
        setSelectingForSlot(null);
    };

    const handleCreate = () => {
        if (!canCreate) return;
        
        setIsCreating(true);
        onCreateHomunculus(slottedParts as SlottedParts);
        setSlottedParts({ core: null, material1: null, material2: null });

        setTimeout(() => setIsCreating(false), 500); // Animation duration
    };
    
    const vatBorderColor = useMemo(() => {
        switch(partsSlottedCount) {
            case 1: return 'border-cyan-700';
            case 2: return 'border-cyan-600';
            case 3: return 'border-cyan-500';
            default: return 'border-gray-700';
        }
    }, [partsSlottedCount]);
    
    return (
        <>
            {isModalOpen && selectingForSlot && (
                <PartSelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelectPart={handleSelectPart}
                    playerInventory={player.inventory}
                    slotType={selectingForSlot}
                    partsToExclude={Object.values(slottedParts).filter(p => p !== null) as string[]}
                    onShowItemInfo={onShowItemInfo}
                />
            )}
            <div className={`p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4 ${isCreating ? 'animate-lab-creation-flash' : ''}`}>
                <h3 className="text-lg font-orbitron text-cyan-400 text-center">Homunculus Synthesis</h3>
                
                <div className="flex justify-center items-end gap-4">
                    <CraftingSlot slotType="material1" itemId={slottedParts.material1} onClick={handleSlotClick} label="Material 1" />
                    <CraftingSlot slotType="core" itemId={slottedParts.core} onClick={handleSlotClick} label="Core Component" size="large"/>
                    <CraftingSlot slotType="material2" itemId={slottedParts.material2} onClick={handleSlotClick} label="Material 2" />
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <div className={`w-24 h-24 bg-gray-900 rounded-full flex flex-col items-center justify-center text-6xl border-4 transition-all ${canCreate ? 'animate-lab-pulse' : ''} ${vatBorderColor}`}>
                        🦎
                        <span className="text-xs font-bold text-white -mt-2">{partsSlottedCount}/3</span>
                    </div>
                     <div className="text-center">
                        <StyledButton onClick={handleCreate} disabled={!canCreate} variant="primary" className="w-40">
                            Create
                        </StyledButton>
                        {!canCreate && <p className="text-xs text-red-400 mt-1">Requires 1 Core & 2 Materials</p>}
                        {canCreate && (
                            <div className="flex items-center justify-center gap-1 text-green-400 font-bold mt-1">
                                <PowerIcon className="w-4 h-4"/>
                                <span className="text-sm">Creates a new Homunculus</span>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

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


const HomunculusCard: React.FC<{
    homunculus: Homunculus,
    onStartHibernation: (id: number) => void,
    onClaimHibernation: (id: number) => void,
    onOpenFeedingModal: (homunculus: Homunculus) => void,
    onOpenWorkplaceModal: (homunculus: Homunculus) => void,
    onOpenEquippingModal: (homunculus: Homunculus) => void,
    onCollectPay: (id: number) => void,
}> = ({ homunculus, onStartHibernation, onClaimHibernation, onOpenFeedingModal, onOpenWorkplaceModal, onOpenEquippingModal, onCollectPay }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [accumulatedPay, setAccumulatedPay] = useState(0);
    
    const workZone = homunculus.work ? ZONES.find(z => z.id === homunculus.work?.zoneId) : null;

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        
        const updateTimers = () => {
            const now = clockService.getCurrentTime();
            if (homunculus.hibernationEndTime) {
                const remaining = Math.max(0, homunculus.hibernationEndTime - now);
                setTimeLeft(remaining);
            }
            if (homunculus.work && workZone) {
                const elapsedMs = now - homunculus.work.startTime;
                const elapsedHours = elapsedMs / (1000 * 60 * 60);
                
                let wageMultiplier = 1.0;
                if (homunculus.equipment) {
                    for (const slot in homunculus.equipment) {
                        const itemId = homunculus.equipment[slot as keyof typeof homunculus.equipment];
                        if (itemId) {
                            const item = ITEMS[itemId];
                            if (item?.type === ItemType.HomunculusClothing) {
                                wageMultiplier += item.wageBonus;
                            }
                        }
                    }
                }
                setAccumulatedPay(Math.floor(elapsedHours * workZone.hourlyRate * wageMultiplier));
            } else {
                setAccumulatedPay(0);
            }
        };

        updateTimers();
        interval = setInterval(updateTimers, 1000);
        
        return () => clearInterval(interval);
    }, [homunculus, workZone]);

    const formatTime = (ms: number) => {
        if (ms <= 0) return "00:00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };
    
    const RarityColorMap: { [key in ItemRarity]: string } = {
        [ItemRarity.Common]: 'text-gray-400 border-gray-600',
        [ItemRarity.Rare]: 'text-blue-400 border-blue-500',
        [ItemRarity.Epic]: 'text-purple-500 border-purple-600',
        [ItemRarity.Legendary]: 'text-orange-500 border-orange-600',
    };
    
    const totalTraits = Object.values(homunculus.traits).reduce((sum, val) => sum + val, 0);
    const powerBonus = totalTraits * POWER_PER_TRAIT_POINT * HOMUNCULUS_RARITY_POWER_MULTIPLIER[homunculus.rarity];

    const renderNurseryStatus = () => {
        if (homunculus.hibernationEndTime) {
            const isReady = timeLeft <= 0;
            return (
                <div className="text-center space-y-2">
                    <div>
                        <p className="text-sm text-gray-400">Hibernating...</p>
                        <p className="text-2xl font-orbitron font-bold text-yellow-400">{formatTime(timeLeft)}</p>
                    </div>
                    {isReady ? (
                        <StyledButton onClick={() => onClaimHibernation(homunculus.id)} variant="success" className="w-full mt-2 animate-pulse">Emerge</StyledButton>
                    ) : (
                        <StyledButton onClick={() => onOpenFeedingModal(homunculus)} className="w-full">Feed</StyledButton>
                    )}
                </div>
            )
        }
        return <StyledButton onClick={() => onStartHibernation(homunculus.id)} className="w-full">Start Hibernation (24h)</StyledButton>
    }

    const renderHouseStatus = () => {
        return (
            <div className="mt-4 space-y-3">
                <div className="space-y-1.5 p-3 bg-gray-900/50 rounded-lg">
                    {Object.entries(homunculus.traits).map(([trait, value]) => (
                        <TraitProgressBar key={trait} trait={trait as HomunculusTrait} value={value} />
                    ))}
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    <StyledButton onClick={() => onOpenEquippingModal(homunculus)} variant="secondary" className="w-full">
                        Gear
                    </StyledButton>
                    <StyledButton onClick={() => onOpenWorkplaceModal(homunculus)} className="w-full">
                        Job
                    </StyledButton>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                    {workZone ? (
                        <div>
                            <p className="text-xs text-gray-400">Working as:</p>
                            <p className="font-semibold text-white">{workZone.jobName}</p>
                            <p className="text-xs text-gray-400">@ {workZone.name} (${workZone.hourlyRate}/hr)</p>
                            <StyledButton onClick={() => onCollectPay(homunculus.id)} variant="success" className="w-full mt-2" disabled={accumulatedPay <= 0}>
                                Collect Pay: ${accumulatedPay.toLocaleString()}
                            </StyledButton>
                        </div>
                    ) : (
                         <p className="text-center text-sm text-gray-500">Status: Idle</p>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className={`p-4 bg-gray-900/50 rounded-lg border-2 ${RarityColorMap[homunculus.rarity]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className={`font-bold font-orbitron ${RarityColorMap[homunculus.rarity]}`}>{homunculus.rarity} Reptilianz</h4>
                    <p className="text-xs text-gray-500">{homunculus.isAdult ? 'Adult' : (homunculus.hibernationEndTime ? 'Hibernating' : 'Baby')}</p>
                </div>
                <div className="flex items-center gap-1 text-red-400 font-bold">
                    <PowerIcon className="w-4 h-4" />
                    <span>+{powerBonus.toFixed(1)}</span>
                </div>
            </div>
             {homunculus.isAdult ? renderHouseStatus() : <div className="mt-4">{renderNurseryStatus()}</div>}
        </div>
    )
}

const NurseryPanel: React.FC<Omit<LabViewProps, 'onInvestXp' | 'onCreateHomunculus' | 'onPurchaseEquipment' | 'onShowItemInfo'>> = (props) => {
    const nurseryHomunculi = props.player.homunculi.filter(h => !h.isAdult);

    return (
        <div className="space-y-4">
            {nurseryHomunculi.length > 0 ? (
                nurseryHomunculi.map(h => (
                    <HomunculusCard 
                        key={h.id} 
                        homunculus={h} 
                        {...props}
                    />
                ))
            ) : (
                <div className="text-center p-8 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500">You have not created any Homunculi.</p>
                    <p className="text-gray-500 text-sm">Use the Synthesis tab to create one.</p>
                </div>
            )}
        </div>
    )
}

const HousePanel: React.FC<Omit<LabViewProps, 'onInvestXp' | 'onCreateHomunculus' | 'onPurchaseEquipment' | 'onShowItemInfo'>> = (props) => {
    const adultHomunculi = props.player.homunculi.filter(h => h.isAdult);

    return (
        <div className="space-y-4">
            {adultHomunculi.length > 0 ? (
                adultHomunculi.map(h => (
                    <HomunculusCard 
                        key={h.id} 
                        homunculus={h} 
                        {...props}
                    />
                ))
            ) : (
                 <div className="text-center p-8 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500">You have no adult Reptilianz.</p>
                    <p className="text-gray-500 text-sm">Emerge a creature from hibernation to house it here.</p>
                </div>
            )}
        </div>
    )
}


export const LabView: React.FC<LabViewProps> = (props) => {

    const tabs = [
        { label: 'Synthesis', content: <SynthesisPanel {...props} /> },
        { label: 'Nursery', content: <NurseryPanel {...props} /> },
        { label: 'House', content: <HousePanel {...props} /> },
        { label: 'Upgrades', content: <LabUpgradesPanel {...props} /> },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-orbitron text-cyan-400">The Bio-Forge</h2>
                <p className="text-gray-400 italic">"By repurposing their own technology, I can create a Homunculus bonded to my energy signature, permanently amplifying my power."</p>
            </div>
            <Tabs tabs={tabs} />
        </div>
    );
};
