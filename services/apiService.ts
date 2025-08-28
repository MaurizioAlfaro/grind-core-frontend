const API_URL = "http://localhost:5001/api";

// Simple function to get auth headers directly from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const post = async (endpoint: string, body: any) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return {
        success: false,
        message:
          data.message || `Request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    console.error("Network Error:", error);
    return {
      success: false,
      message: error.message || "A network error occurred.",
    };
  }
};

const get = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    console.error("Network Error:", error);
    throw error;
  }
};

export const apiService = {
  // Player
  getPlayer: () => get("/player"),
  resetPlayer: (body: any) => post("/player/reset", body),
  updateTutorialStep: (body: any) => post("/player/tutorial", body),
  unlockZone: (body: any) => post("/player/unlockZone", body),
  equipItem: (body: any) => post("/player/equip", body),
  unequipItem: (body: any) => post("/player/unequip", body),

  // Missions
  startMission: (body: any) => post("/missions/start", body),
  claimMission: (body: any) => post("/missions/claim", body),
  cancelMission: (body: any) => post("/missions/cancel", body),

  // Forge
  upgradeItem: (body: any) => post("/forge/upgrade", body),
  enchantItem: (body: any) => post("/forge/enchant", body),
  rerollEnchantment: (body: any) => post("/forge/reroll", body),

  // Store
  purchaseStoreItem: (body: any) => post("/store/purchase", body),
  useConsumableItem: (body: any) => post("/store/use", body),

  // Bosses
  fightBoss: (body: any) => post("/bosses/fight", body),

  // Lab
  investLabXp: (body: any) => post("/lab/invest", body),
  createHomunculus: (body: any) => post("/lab/create", body),
  purchaseLabEquipment: (body: any) => post("/lab/purchase", body),
  startHibernation: (body: any) => post("/lab/hibernate/start", body),
  claimHibernation: (body: any) => post("/lab/hibernate/claim", body),
  feedHomunculus: (body: any) => post("/lab/feed", body),
  assignToWork: (body: any) => post("/lab/work/assign", body),
  collectPay: (body: any) => post("/lab/work/collect", body),
  equipHomunculusItem: (body: any) => post("/lab/gear/equip", body),
  unequipHomunculusItem: (body: any) => post("/lab/gear/unequip", body),
};
