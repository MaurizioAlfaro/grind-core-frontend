
// This service provides a single source of truth for time, simulating a server clock.
export const clockService = {
  getCurrentTime: (): number => {
    return Date.now();
  },
};
