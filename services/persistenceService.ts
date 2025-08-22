import type { GameState } from '../types';

const GAME_STATE_KEY = 'grindCoreRpgState';

export const persistenceService = {
  saveGameState: (state: GameState): void => {
    // Deprecated: State is now saved on the server.
  },

  loadGameState: (): GameState | null => {
    // Deprecated: State is now loaded from the server.
    return null;
  },

  clearGameState: (): void => {
    try {
        localStorage.removeItem(GAME_STATE_KEY);
    } catch (error) {
        console.error("Failed to clear old game state:", error);
    }
  }
};
