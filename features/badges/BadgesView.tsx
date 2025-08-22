

import React, { useState, useMemo } from 'react';
import type { PlayerState, Badge } from '../../types';
import { BADGES } from '../../constants/badges';
import { BadgeInfoModal } from './BadgeInfoModal';
import { StyledButton } from '../../components/common/StyledButton';
import { LeaderboardIcon } from '../navigation/icons/LeaderboardIcon';
import type { AppView } from '../navigation/FooterNav';

interface BadgesViewProps {
    player: PlayerState;
    onNavigate: (view: AppView) => void;
}

const BadgeIconButton: React.FC<{ badge: Badge, isUnlocked: boolean, onClick: () => void }> = ({ badge, isUnlocked, onClick }) => {
    const isHiddenAndLocked = badge.isHidden && !isUnlocked;

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center w-14 h-14 rounded-lg border-2 transition-all hover:scale-110 hover:border-cyan-400 ${isUnlocked ? 'bg-cyan-900/30 border-cyan-500/50' : 'bg-gray-800/50 border-gray-700'}`}
            title={badge.name}
            aria-label={`View details for ${badge.name}`}
        >
            <div className={`text-3xl flex items-center justify-center`}>
                {isHiddenAndLocked ? <span className="text-gray-500">?</span> : <span className={!isUnlocked ? 'filter grayscale opacity-50' : ''}>{badge.icon}</span>}
            </div>
        </button>
    );
};

export const BadgesView: React.FC<BadgesViewProps> = ({ player, onNavigate }) => {
    const [viewingBadge, setViewingBadge] = useState<Badge | null>(null);

    const allBadges = Object.values(BADGES);
    const unlockedCount = player.unlockedBadgeIds.length;
    const totalVisibleBadges = allBadges.filter(b => !b.isHidden).length;

    const badgesByCategory = useMemo(() => {
        const grouped: { [category: string]: Badge[] } = {};
        allBadges.forEach(badge => {
            if (!grouped[badge.category]) {
                grouped[badge.category] = [];
            }
            grouped[badge.category].push(badge);
        });
        // Sort categories
        const categoryOrder = ['Progression', 'Wealth', 'Missions', 'Bosses', 'Collection', 'Forge', 'Lab', 'Store', 'Miscellaneous', 'Secret'];
        const sortedGrouped: { [category: string]: Badge[] } = {};
        categoryOrder.forEach(cat => {
            if (grouped[cat]) {
                sortedGrouped[cat] = grouped[cat];
            }
        });
        return sortedGrouped;
    }, [allBadges]);

    const bonusTotals = useMemo(() => {
        const totals = {
            power: 1.0,
            xp: 1.0,
            gold: 1.0,
            loot: 1.0,
            permPower: 0,
        };
        player.unlockedBadgeIds.forEach(badgeId => {
            const badge = BADGES[badgeId];
            if (badge?.bonus) {
                switch(badge.bonus.type) {
                    case 'MULTIPLY_POWER': totals.power *= badge.bonus.value; break;
                    case 'MULTIPLY_XP': totals.xp *= badge.bonus.value; break;
                    case 'MULTIPLY_GOLD': totals.gold *= badge.bonus.value; break;
                    case 'MULTIPLY_LOOT_CHANCE': totals.loot *= badge.bonus.value; break;
                    case 'ADD_PERMANENT_POWER': totals.permPower += badge.bonus.value; break;
                }
            }
        });
        return {
            power: (totals.power - 1) * 100,
            xp: (totals.xp - 1) * 100,
            gold: (totals.gold - 1) * 100,
            loot: (totals.loot - 1) * 100,
            permPower: totals.permPower,
        };
    }, [player.unlockedBadgeIds]);
    
    const hasAnyBonus = Object.values(bonusTotals).some(val => val > 0);


    return (
        <>
            {viewingBadge && (
                <BadgeInfoModal
                    badge={viewingBadge}
                    isUnlocked={player.unlockedBadgeIds.includes(viewingBadge.id)}
                    onClose={() => setViewingBadge(null)}
                />
            )}
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-orbitron text-cyan-400">Agent Accolades</h2>
                    <p className="text-gray-400">A collection of your accomplishments.</p>
                     <StyledButton onClick={() => onNavigate('leaderboard')} className="mt-4">
                        <div className="flex items-center justify-center gap-2">
                            <LeaderboardIcon className="w-5 h-5" />
                            <span>View Leaderboard</span>
                        </div>
                    </StyledButton>
                    <p className="mt-4 font-semibold text-cyan-400">
                        Unlocked: {unlockedCount} / {totalVisibleBadges}
                    </p>
                </div>
                
                 {hasAnyBonus && (
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h3 className="text-lg font-orbitron text-cyan-400 text-center mb-3">Total Bonuses from Badges</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-center">
                            {bonusTotals.power > 0.01 && <div><span className="font-bold text-white">+{bonusTotals.power.toFixed(2)}%</span> <span className="text-gray-400">Power</span></div>}
                            {bonusTotals.xp > 0.01 && <div><span className="font-bold text-white">+{bonusTotals.xp.toFixed(2)}%</span> <span className="text-gray-400">XP</span></div>}
                            {bonusTotals.gold > 0.01 && <div><span className="font-bold text-white">+{bonusTotals.gold.toFixed(2)}%</span> <span className="text-gray-400">Gold</span></div>}
                            {bonusTotals.loot > 0.01 && <div><span className="font-bold text-white">+{bonusTotals.loot.toFixed(2)}%</span> <span className="text-gray-400">Loot</span></div>}
                            {bonusTotals.permPower > 0 && <div><span className="font-bold text-white">+{bonusTotals.permPower}</span> <span className="text-gray-400">Perm. Power</span></div>}
                        </div>
                    </div>
                )}


                <div className="space-y-4">
                    {Object.entries(badgesByCategory).map(([category, badges]) => {
                         const unlockedInCategory = badges.filter(b => player.unlockedBadgeIds.includes(b.id)).length;
                         const totalInCategory = badges.filter(b => !b.isHidden).length;
                        return (
                             <div key={category} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                                <div className="flex justify-between items-baseline mb-3">
                                    <h3 className="text-lg font-orbitron text-cyan-400">{category}</h3>
                                    {totalInCategory > 0 && <span className="text-sm text-gray-400">{unlockedInCategory} / {totalInCategory}</span>}
                                </div>
                                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
                                    {badges.map(badge => (
                                        <BadgeIconButton
                                            key={badge.id}
                                            badge={badge}
                                            isUnlocked={player.unlockedBadgeIds.includes(badge.id)}
                                            onClick={() => setViewingBadge(badge)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};