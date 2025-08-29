
import { RouletteNumber, RouletteSettings } from './types';
import { getNumberProperties } from './utils/helpers';

export const AMERICAN_WHEEL_ORDER: string[] = [
    '0', '28', '9', '26', '30', '11', '7', '20', '32', '17', '5', '22', '34', '15', '3', '24', '36', '13', '1', 
    '00', '27', '10', '25', '29', '12', '8', '19', '31', '18', '6', '21', '33', '16', '4', '23', '35', '14', '2'
];

export const WHEEL_NUMBERS: RouletteNumber[] = AMERICAN_WHEEL_ORDER.map(getNumberProperties);

export const TABLE_LAYOUT_NUMBERS: string[][] = [
    ['3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33', '36'],
    ['2', '5', '8', '11', '14', '17', '20', '23', '26', '29', '32', '35'],
    ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31', '34'],
];

export const PAYOUTS: { [key: string]: number } = {
    straight: 35,
    split: 17,
    street: 11,
    corner: 8,
    sixLine: 5,
    column: 2,
    dozen: 2,
    color: 1,
    evenOdd: 1,
    highLow: 1,
};

export const INITIAL_ROULETTE_SETTINGS: RouletteSettings = {
  minBet: 5,
  maxBet: 1000,
  wheelType: 'american',
};

export const INITIAL_CHIPS = 1000;
export const CHIP_DENOMINATIONS = [1, 5, 10, 25, 100];
