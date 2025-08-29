import * as controller from '../controllers/roulette.controller';
import { RouletteSettings } from '../../features/roulette/types';

export const initGame = () => controller.initGame();
export const updateSettings = (newSettings: RouletteSettings) => controller.updateSettings(newSettings);
export const spin = () => controller.spin();
export const calculatePayouts = () => controller.calculatePayouts();
export const nextRound = () => controller.nextRound();

// Betting routes
export const placeBet = (betType: string, amount: number) => controller.placeBet(betType, amount);
export const clearBets = () => controller.clearBets();
export const repeatLastBet = () => controller.repeatLastBet();
