// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://grind-core-backend.onrender.com";
export const API_URL = `${API_BASE_URL}/api`;

// Fallback to localhost for development if no env var is set
export const getApiUrl = (endpoint: string) => {
  console.log("API_URL", import.meta.env.VITE_API_URL);
  const base =
    import.meta.env.VITE_API_URL || "https://grind-core-backend.onrender.com";
  return `${base}/api${endpoint}`;
};
