import { useState, useEffect, useCallback } from "react";
import {
  walletAuthService,
  WalletAuthResponse,
} from "../services/walletAuthService";

export interface WalletAuthState {
  isAuthenticated: boolean;
  walletAddress: string | null;
  player: WalletAuthResponse["player"] | null;
  isLoading: boolean;
  error: string | null;
}

export const useWalletAuth = () => {
  const [state, setState] = useState<WalletAuthState>({
    isAuthenticated: false,
    walletAddress: null,
    player: null,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = walletAuthService.getToken();
    const walletAddress = walletAuthService.getWalletAddress();

    if (token && walletAddress) {
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        walletAddress,
        isLoading: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  const connectWallet = useCallback(
    async (walletAddress: string, signature: string, message: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const authResponse = await walletAuthService.authenticate(
          walletAddress,
          signature,
          message
        );

        setState({
          isAuthenticated: true,
          walletAddress: authResponse.player.walletAddress,
          player: authResponse.player,
          isLoading: false,
          error: null,
        });

        return authResponse;
      } catch (error: any) {
        const errorMessage = error.message || "Failed to connect wallet";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  const disconnectWallet = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await walletAuthService.disconnect();

      setState({
        isAuthenticated: false,
        walletAddress: null,
        player: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error);
      // Still clear local state even if server request fails
      setState({
        isAuthenticated: false,
        walletAddress: null,
        player: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    clearError,
  };
};
