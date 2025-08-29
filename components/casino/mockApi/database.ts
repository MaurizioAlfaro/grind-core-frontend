// Simulates network latency and provides a deep copy of the data
export const apiRequest = <T>(data: T, delay: number = 200): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Deep copy to prevent state mutation issues, simulating a real API response
      resolve(JSON.parse(JSON.stringify(data)));
    }, delay);
  });
};

const DB_KEY = 'casinoSuiteState';

type GameName = 'blackjack' | 'baccarat' | 'roulette' | 'chat';

const getDb = (): Record<string, any> => {
    try {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {};
    }
};

const saveDb = (db: Record<string, any>) => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Error saving to localStorage", error);
    }
};

export const loadGameState = <T>(gameName: GameName, initialState: T): T => {
    const db = getDb();
    // A simple merge to add new properties from initial state if they don't exist in saved state
    return db[gameName] ? { ...initialState, ...db[gameName] } : initialState;
};

export const saveGameState = <T>(gameName: GameName, state: T) => {
    const db = getDb();
    db[gameName] = state;
    saveDb(db);
};