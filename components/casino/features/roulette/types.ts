
export interface RouletteNumber {
  value: string; // '0', '00', '1'...'36'
  color: 'red' | 'black' | 'green';
  column: 1 | 2 | 3 | null;
  dozen: 1 | 2 | 3 | null;
  isEven: boolean | null; // null for 0, 00
}

export enum RouletteGameState {
  BETTING,
  SPINNING,
  PAYOUT,
}

export interface RouletteSettings {
  minBet: number;
  maxBet: number;
  wheelType: 'american' | 'european'; // For future use
}

// Re-using Log types for consistency
export type LogType = 'action' | 'game' | 'state' | 'info' | 'decision' | 'payout' | 'error';

export interface LogEntry {
  timestamp: string;
  type: LogType;
  message: string;
  data?: any;
}
