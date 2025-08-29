import * as controller from '../controllers/blackjack.controller';

export const initGame = () => controller.initGame();
export const updateSettings = (newSettings: any) => controller.updateSettings(newSettings);
export const deal = () => controller.deal();
export const nextRound = () => controller.nextRound();
export const hit = () => controller.hit();
export const stand = () => controller.stand();
export const double = () => controller.double();
export const split = () => controller.split();
export const surrender = () => controller.surrender();
export const decideInsurance = (accepted: boolean) => controller.decideInsurance(accepted);
export const decideEvenMoney = (accepted: boolean) => controller.decideEvenMoney(accepted);

// Betting routes
export const placeBet = (amount: number) => controller.placeBet(amount);
export const clearBet = () => controller.clearBet();
export const repeatBet = () => controller.repeatBet();
export const maxBet = () => controller.maxBet();
