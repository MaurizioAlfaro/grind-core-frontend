import { apiService } from "./apiService";

export interface WalletAuthResponse {
  token: string;
  player: {
    id: string;
    walletAddress?: string;
    guestId?: string;
    isWalletConnected: boolean;
    ownsReptilianzNFT: boolean;
    level: number;
    xp: number;
    gold: number;
    power: number;
  };
}

export interface NonceResponse {
  nonce: string;
  message: string;
  expiresAt: number;
}

class WalletAuthService {
  private token: string | null = localStorage.getItem("authToken");
  private walletAddress: string | null = localStorage.getItem("walletAddress");

  // Get stored token from localStorage
  constructor() {
    this.token = localStorage.getItem("authToken");
    this.walletAddress = localStorage.getItem("walletAddress");
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Get wallet address
  getWalletAddress(): string | null {
    return this.walletAddress;
  }

  // Get stored player data
  getStoredPlayerData(): any | null {
    const stored = localStorage.getItem("playerData");
    return stored ? JSON.parse(stored) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const guestId = localStorage.getItem("guestId");
    console.log(
      `[Auth] isAuthenticated check: this.token = ${
        this.token
      }, this.walletAddress = ${
        this.walletAddress
      }, guestId = ${guestId}, localStorage token = ${localStorage.getItem(
        "authToken"
      )}`
    );
    return !!this.token && (!!this.walletAddress || !!guestId);
  }

  // Get nonce from server
  async getNonce(walletAddress: string): Promise<NonceResponse> {
    const response = await fetch("http://localhost:5001/api/auth/nonce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      throw new Error("Failed to get nonce");
    }

    return response.json();
  }

  // Authenticate with wallet signature
  async authenticate(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<WalletAuthResponse> {
    const response = await fetch(
      "http://localhost:5001/api/auth/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature, message }),
      }
    );

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    const authData = await response.json();

    // Store authentication data
    this.token = authData.token;
    this.walletAddress = authData.player.walletAddress;
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("walletAddress", authData.player.walletAddress);

    return authData;
  }

  // Create new guest account
  async createNewAccount(): Promise<WalletAuthResponse> {
    const response = await fetch("http://localhost:5001/api/auth/new-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create new account");
    }

    const authData = await response.json();

    // Store authentication data
    this.token = authData.token;
    this.walletAddress = authData.player.walletAddress || null;
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("playerData", JSON.stringify(authData.player));

    if (authData.player.walletAddress) {
      localStorage.setItem("walletAddress", authData.player.walletAddress);
    }
    if (authData.player.guestId) {
      localStorage.setItem("guestId", authData.player.guestId);
    }

    return authData;
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    if (!this.token) {
      return;
    }

    try {
      await fetch("http://localhost:5001/api/auth/disconnect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error disconnecting:", error);
    } finally {
      // Clear local data regardless of server response
      this.clearAuth();
    }
  }

  // Clear authentication data
  clearAuth(): void {
    this.token = null;
    this.walletAddress = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("guestId");
    localStorage.removeItem("playerData");
  }

  // Get headers for authenticated requests
  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
}

export const walletAuthService = new WalletAuthService();
