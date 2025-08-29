import { useState, useEffect, useCallback } from "react";
import type { SolanaWalletProvider, WalletProviderConfig } from "../types";
import { PublicKey } from "@solana/web3.js";

// Wallet provider configurations
const WALLET_PROVIDERS: WalletProviderConfig[] = [
  {
    name: "Phantom",
    icon: "🟣",
    description: "Connect with Phantom wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isPhantom) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isPhantom,
  },
  {
    name: "Solflare",
    icon: "🟡",
    description: "Connect with Solflare wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isSolflare) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isSolflare,
  },
  {
    name: "Backpack",
    icon: "🎒",
    description: "Connect with Backpack wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isBackpack) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isBackpack,
  },
  {
    name: "Surf",
    icon: "🌊",
    description: "Connect with Surf wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isSurf) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isSurf,
  },
  {
    name: "Slope",
    icon: "📱",
    description: "Connect with Slope wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isSlope) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isSlope,
  },
  {
    name: "Exodus",
    icon: "🚀",
    description: "Connect with Exodus wallet",
    getProvider: () => {
      if ("solana" in window && (window as any).solana?.isExodus) {
        return (window as any).solana;
      }
      return null;
    },
    isAvailable: () => "solana" in window && (window as any).solana?.isExodus,
  },
];

export const useSolanaWallet = () => {
  const [availableProviders, setAvailableProviders] = useState<
    WalletProviderConfig[]
  >([]);
  const [currentProvider, setCurrentProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connectedWalletName, setConnectedWalletName] = useState<string>("");

  useEffect(() => {
    // Detect available wallet providers
    const available = WALLET_PROVIDERS.filter((provider) =>
      provider.isAvailable()
    );
    setAvailableProviders(available);

    // Try to auto-connect to the first available provider
    if (available.length > 0) {
      const provider = available[0].getProvider();
      if (provider) {
        setCurrentProvider(provider);

        // Try to eagerly connect
        provider
          .connect({ onlyIfTrusted: true })
          .then(({ publicKey }: { publicKey: PublicKey }) => {
            setPublicKey(publicKey);
            setConnectedWalletName(available[0].name);
          })
          .catch((err) => {
            console.log("Eager connect failed:", err);
          });

        // Listen for account changes
        const onAccountChanged = (newPublicKey: PublicKey | null) => {
          setPublicKey(newPublicKey);
        };
        provider.on("accountChanged", onAccountChanged);

        return () => {
          provider.off("accountChanged", onAccountChanged);
        };
      }
    }
  }, []);

  const connectWallet = useCallback(
    async (providerName: string) => {
      const providerConfig = availableProviders.find(
        (p) => p.name === providerName
      );
      if (!providerConfig) {
        alert("Wallet provider not found!");
        return;
      }

      const provider = providerConfig.getProvider();
      if (!provider) {
        alert(`${providerName} wallet not found! Please install it.`);
        return;
      }

      try {
        const { publicKey } = await provider.connect();
        setPublicKey(publicKey);
        setCurrentProvider(provider);
        setConnectedWalletName(providerName);
      } catch (err) {
        console.error("Connection to wallet failed!", err);
      }
    },
    [availableProviders]
  );

  const disconnectWallet = useCallback(async () => {
    if (!currentProvider) return;
    try {
      await currentProvider.disconnect();
      setPublicKey(null);
      setCurrentProvider(null);
      setConnectedWalletName("");
    } catch (err) {
      console.error("Disconnection failed!", err);
    }
  }, [currentProvider]);

  return {
    availableProviders,
    currentProvider,
    publicKey,
    connectedWalletName,
    isConnected: !!publicKey,
    connectWallet,
    disconnectWallet,
  };
};
