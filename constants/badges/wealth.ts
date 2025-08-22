
import type { Badge } from '../../types';

export const wealthBadges: { [key: string]: Badge } = {
    gold_100k: { id: 'gold_100k', name: 'Shell Corporation', description: 'Accumulate 100,000 Gold.', icon: '🏦', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    gold_500k: { id: 'gold_500k', name: 'Market Manipulation', description: 'Accumulate 500,000 Gold.', icon: '📈', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    gold_1m: { id: 'gold_1m', name: 'One Percent', description: 'Accumulate 1,000,000 Gold.', icon: '💎', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    gold_10m: { id: 'gold_10m', name: 'Hedge Fund Manager', description: 'Accumulate 10,000,000 Gold.', icon: '📊', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    gold_100m: { id: 'gold_100m', name: 'Dragon\'s Hoard', description: 'Accumulate 100,000,000 Gold.', icon: '🐲', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.02 }, bonusDescription: '+2% Global Gold' },
    
    dollars_1k: { id: 'dollars_1k', name: 'Side Hustle', description: 'Accumulate $1,000.', icon: '💵', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    dollars_10k: { id: 'dollars_10k', name: 'Paid Contractor', description: 'Accumulate $10,000.', icon: '💸', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.005 }, bonusDescription: '+0.5% Global Gold' },
    dollars_100k: { id: 'dollars_100k', name: 'War Profiteer', description: 'Accumulate $100,000.', icon: '🤑', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.01 }, bonusDescription: '+1% Global Gold' },
    dollars_1m: { id: 'dollars_1m', name: 'Master of Coin', description: 'Accumulate $1,000,000.', icon: '💰', category: 'Wealth', bonus: { type: 'MULTIPLY_GOLD', value: 1.02 }, bonusDescription: '+2% Global Gold' },
};
