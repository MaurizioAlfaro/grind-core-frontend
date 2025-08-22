
import type { InventoryItem } from '../../../types';

export const rollFromPool = (pool: { itemId: string; weight: number }[]): InventoryItem[] => {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for(const item of pool) {
        if (random < item.weight) {
            return [{ itemId: item.itemId, quantity: 1 }];
        }
        random -= item.weight;
    }
    return []; // Should not happen with valid pool
}