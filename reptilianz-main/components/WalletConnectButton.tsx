import React, { useState } from "react";
import { useSolanaWallet } from "../hooks/useSolanaWallet";
import { PhantomIcon, SolanaIcon } from "./IconComponents";
import WalletButton from "./WalletButton";
import ConnectionStatus from "./ConnectionStatus";

const WalletConnectButton: React.FC = () => {
  const {
    availableProviders,
    publicKey,
    connectedWalletName,
    isConnected,
    connectWallet,
    disconnectWallet,
  } = useSolanaWallet();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  // Get icon component based on wallet name
  const getWalletIcon = (walletName: string) => {
    switch (walletName) {
      case "Phantom":
        return <PhantomIcon className="w-8 h-8" />;
      case "Solflare":
        return (
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
        );
      case "Backpack":
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
        );
      case "Surf":
        return (
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
            🌊
          </div>
        );
      case "Slope":
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
        );
      case "Exodus":
        return (
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            🚀
          </div>
        );
      default:
        return <SolanaIcon className="w-8 h-8" />;
    }
  };

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <ConnectionStatus
          publicKey={publicKey}
          onDisconnect={disconnectWallet}
          walletName={connectedWalletName}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWalletOptions(!showWalletOptions)}
        className="px-4 py-2 bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 hover:from-cyan-500/90 hover:to-fuchsia-500/90 text-white rounded border border-cyan-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 font-medium"
      >
        Connect Wallet
      </button>

      {showWalletOptions && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 border border-cyan-500/50 rounded-lg shadow-xl backdrop-blur-md z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Choose Wallet
            </h3>
            <div className="space-y-3">
              {availableProviders.length > 0 ? (
                availableProviders.map((provider) => (
                  <WalletButton
                    key={provider.name}
                    onClick={() => connectWallet(provider.name)}
                    title={provider.name}
                    description={provider.description}
                    icon={getWalletIcon(provider.name)}
                  />
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-400 mb-3">
                    No Solana wallets detected
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://phantom.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      Install Phantom
                    </a>
                    <a
                      href="https://solflare.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      Install Solflare
                    </a>
                    <a
                      href="https://backpack.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      Install Backpack
                    </a>
                    <a
                      href="https://surfwallet.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      Install Surf
                    </a>
                    <a
                      href="https://exodus.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-cyan-400 hover:text-cyan-300 underline text-sm"
                    >
                      Install Exodus
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
