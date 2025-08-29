
import { CHIP_DENOMINATIONS } from '../constants';

export const getChipsForBet = (bet: number): number[] => {
    const denominations = [...CHIP_DENOMINATIONS].sort((a, b) => b - a);
    const chips: number[] = [];
    let remaining = bet;
    
    for (const denom of denominations) {
        if (denom <= 0) continue;
        const count = Math.floor(remaining / denom);
        for (let i = 0; i < count; i++) {
            chips.push(denom);
        }
        remaining %= denom;
    }
    // Handle any remainder by adding smaller chips if possible
    if (remaining > 0) {
        for (const denom of denominations.reverse()) {
            if(remaining >= denom){
                chips.push(denom);
                remaining -= denom;
            }
        }
    }

    return chips;
}
