import { PublicKey } from "@solana/web3.js";

// Generic Solana wallet provider interface
export interface SolanaWalletProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  publicKey: PublicKey | null;
  connect: (options?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  off: (event: string, callback: (args: any) => void) => void;
  request: (method: string, params: any) => Promise<any>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
}

// Get any available Solana wallet provider
export const getWalletProvider = (): SolanaWalletProvider | undefined => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider && provider.isPhantom) {
      return provider as SolanaWalletProvider;
    }
  }

  // Check for other wallet providers
  if ("solflare" in window) {
    const provider = (window as any).solflare;
    if (provider && provider.isSolflare) {
      return provider as SolanaWalletProvider;
    }
  }

  if ("backpack" in window) {
    const provider = (window as any).backpack;
    if (provider && provider.isBackpack) {
      return provider as SolanaWalletProvider;
    }
  }

  return undefined;
};

// Get wallet provider name for display
export const getWalletProviderName = (
  provider: SolanaWalletProvider
): string => {
  if (provider.isPhantom) return "Phantom";
  if (provider.isSolflare) return "Solflare";
  if (provider.isBackpack) return "Backpack";
  return "Solana Wallet";
};

// Check if any wallet is available
export const isWalletAvailable = (): boolean => {
  return !!getWalletProvider();
};

// Get wallet installation URL
export const getWalletInstallUrl = (): string => {
  if ("solana" in window && (window as any).solana?.isPhantom) {
    return "https://phantom.app/";
  }
  if ("solflare" in window && (window as any).solflare?.isSolflare) {
    return "https://solflare.com/";
  }
  if ("backpack" in window && (window as any).backpack?.isBackpack) {
    return "https://backpack.app/";
  }
  // Default to Phantom
  return "https://phantom.app/";
};
