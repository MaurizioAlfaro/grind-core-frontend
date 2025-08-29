
import { RouletteNumber } from "../types";

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export const getNumberProperties = (value: string): RouletteNumber => {
  if (value === '0' || value === '00') {
    return { value, color: 'green', column: null, dozen: null, isEven: null };
  }
  const num = parseInt(value);
  const color = RED_NUMBERS.includes(num) ? 'red' : 'black';
  
  let column: 1 | 2 | 3;
  if (num % 3 === 0) column = 1;
  else if ((num + 1) % 3 === 0) column = 2;
  else column = 3;

  let dozen: 1 | 2 | 3;
  if (num <= 12) dozen = 1;
  else if (num <= 24) dozen = 2;
  else dozen = 3;

  return {
    value,
    color,
    column,
    dozen,
    isEven: num % 2 === 0,
  };
};

export const isWinningBet = (betType: string, winningNumber: RouletteNumber): boolean => {
    const [type, ...args] = betType.split('_');

    switch(type) {
        case 'straight':
            return winningNumber.value === args[0];
        case 'split': {
            const numbers = args[0].split('-');
            return numbers.includes(winningNumber.value);
        }
        case 'street': {
            const numbers = args[0].split('-');
            return numbers.includes(winningNumber.value);
        }
        case 'corner': {
            const numbers = args[0].split('-');
            return numbers.includes(winningNumber.value);
        }
        case 'sixLine': {
            const numbers = args[0].split('-');
            return numbers.includes(winningNumber.value);
        }
        case 'column':
            return winningNumber.column === parseInt(args[0]);
        case 'dozen':
            return winningNumber.dozen === parseInt(args[0]);
        case 'red':
            return winningNumber.color === 'red';
        case 'black':
            return winningNumber.color === 'black';
        case 'even':
            return winningNumber.isEven === true;
        case 'odd':
            return winningNumber.isEven === false;
        case 'low': // 1-18
            return winningNumber.dozen !== null && winningNumber.dozen <= 1.5;
        case 'high': // 19-36
            return winningNumber.dozen !== null && winningNumber.dozen > 1.5;
        default:
            return false;
    }
};
