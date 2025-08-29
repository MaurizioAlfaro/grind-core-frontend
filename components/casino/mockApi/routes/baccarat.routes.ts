import * as controller from '../controllers/baccarat.controller';
import { BaccaratBetType, BaccaratSettings } from '../../features/baccarat/types';

export const initGame = () => controller.initGame();
export const updateSettings = (newSettings: BaccaratSettings) => controller.updateSettings(newSettings);
export const deal = () => controller.deal();
export const nextRound = () => controller.nextRound();

// Betting routes
export const placeBet = (betType: BaccaratBetType, amount: number) => controller.placeBet(betType, amount);
export const clearBets = () => controller.clearBets();
export const repeatLastBet = () => controller.repeatLastBet();
