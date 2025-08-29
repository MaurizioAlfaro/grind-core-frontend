import { useState, useEffect } from "react";
import { walletAuthService } from "../services/walletAuthService";

export type AuthState = "loading" | "authenticated" | "unauthenticated";

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = walletAuthService.isAuthenticated();
    const storedPlayer = walletAuthService.getStoredPlayerData();

    console.log(
      `🔐 [Auth] isAuthenticated: ${isAuthenticated}, storedPlayer: ${!!storedPlayer}, showLogin: ${!(
        isAuthenticated && storedPlayer
      )}`
    );
    if (isAuthenticated && storedPlayer) {
      setAuthState("authenticated");
      setShowLoginScreen(false);
      setPlayer(storedPlayer);
      setWalletAddress(storedPlayer.walletAddress || null);
    } else {
      setAuthState("unauthenticated");
      setShowLoginScreen(true);
    }
  }, []);

  const handleNewAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse = await walletAuthService.createNewAccount();

      setPlayer(authResponse.player);
      setWalletAddress(authResponse.player.walletAddress || null);
      setIsLoading(false);
      setError(null);

      setShowLoginScreen(false);
      setAuthState("authenticated");

      // Force update gameState in useGameLoop to prevent infinite loading
      // This triggers the game to show immediately after new account creation
      window.dispatchEvent(
        new CustomEvent("recoveryAuthenticated", {
          detail: { player: authResponse.player },
        })
      );

      // Also trigger wallet modal after a delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("showWalletModal", {}));
      }, 3000);

      return authResponse;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create new account";
      setIsLoading(false);
      setError(errorMessage);
      throw error;
    }
  };

  const handleWalletLogin = async () => {
    try {
      // 1. Get wallet provider
      const provider = getProvider();
      if (!provider) {
        alert("Phantom wallet not found! Please install it.");
        window.open("https://phantom.app/", "_blank");
        return;
      }

      // 2. Connect wallet (shows native wallet dialog)
      const { publicKey } = await provider.connect();
      console.log("✅ Wallet connected:", publicKey.toString());

      // 3. Request nonce from backend
      console.log("🔄 Requesting nonce from backend...");
      const nonceResponse = await fetch(
        "http://localhost:5001/api/auth/nonce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
          }),
        }
      );

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce from server");
      }

      const { nonce, message } = await nonceResponse.json();
      console.log("✅ Nonce received:", nonce);
      console.log("📝 Message to sign:", message);

      // 4. Sign the message with nonce (shows native wallet dialog)
      const messageBytes = new TextEncoder().encode(message);
      const { signature } = await provider.signMessage(messageBytes);

      // 5. Log success
      console.log("✅ Message signed successfully");
      console.log("🔐 Signature:", Array.from(signature));
      console.log("📍 Wallet Address:", publicKey.toString());

      // 6. Authenticate with backend using signature
      console.log("🔄 Authenticating with backend...");
      const authResponse = await fetch(
        "http://localhost:5001/api/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: publicKey.toString(),
            signature: Array.from(signature),
            message: message,
          }),
        }
      );

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      const authData = await authResponse.json();
      console.log("✅ Authentication successful:", authData);

      // 7. Set authentication state
      setWalletAddress(publicKey.toString());
      setAuthState("authenticated");
      setShowLoginScreen(false);

      // 8. Store token and player data
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("playerData", JSON.stringify(authData.player));

      // Also store guestId separately for consistency with existing code
      if (authData.player.guestId) {
        localStorage.setItem("guestId", authData.player.guestId);
      }

      // 9. Force update gameState in useGameLoop to prevent infinite loading
      // This triggers the game to show immediately after wallet authentication
      window.dispatchEvent(
        new CustomEvent("recoveryAuthenticated", {
          detail: { player: authData.player },
        })
      );

      // Also trigger wallet modal after a delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("showWalletModal", {}));
      }, 3000);
    } catch (error: any) {
      console.error("Wallet authentication failed:", error);
      if (error.code === 4001) {
        alert("Wallet connection was rejected by user.");
      } else {
        alert(`Failed to authenticate with wallet: ${error.message}`);
      }
    }
  };

  // Helper function to get wallet provider
  const getProvider = () => {
    if ("solana" in window) {
      const provider = (window as any).solana;
      if (provider && provider.isPhantom) {
        return provider;
      }
    }
    return undefined;
  };

  const handleRecoveryLogin = async (recoveryString: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await walletAuthService.authenticateWithRecovery(
        recoveryString
      );

      setPlayer(authData.player);
      setWalletAddress(authData.player.walletAddress || null);
      setAuthState("authenticated");
      setShowLoginScreen(false);

      // Force update gameState in useGameLoop to prevent infinite loading
      // This triggers the game to show immediately after recovery
      window.dispatchEvent(
        new CustomEvent("recoveryAuthenticated", {
          detail: { player: authData.player },
        })
      );

      // Also trigger wallet modal after a delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("showWalletModal", {}));
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Recovery failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    walletAuthService.clearAuth();
    setAuthState("unauthenticated");
    setShowLoginScreen(true);
  };

  return {
    authState,
    showLoginScreen,
    player,
    walletAddress,
    isLoading,
    error,
    handleNewAccount,
    handleWalletLogin,
    handleRecoveryLogin,
    logout,
  };
};
