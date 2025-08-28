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

      return authResponse;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create new account";
      setIsLoading(false);
      setError(errorMessage);
      throw error;
    }
  };

  const handleWalletLogin = () => {
    // For now, just mock the wallet login
    console.log("Opening wallet login...");
    // In the future, this would open the wallet connection modal
    setShowLoginScreen(false);
    setAuthState("authenticated");
  };

  const handleRecoveryLogin = () => {
    // For now, just mock the recovery login
    console.log("Opening recovery phrase input...");
    // In the future, this would open a recovery phrase input modal
    setShowLoginScreen(false);
    setAuthState("authenticated");
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
