import React from "react";
import type { PublicKey } from "@solana/web3.js";
import { SolanaIcon } from "./IconComponents";

interface ConnectionStatusProps {
  publicKey: PublicKey | null;
  onDisconnect: () => void;
  walletName?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  publicKey,
  onDisconnect,
  walletName,
}) => {
  if (!publicKey) {
    return (
      <div className="flex items-center justify-center space-x-2 p-3 text-sm text-yellow-300 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
            clipRule="evenodd"
          />
        </svg>
        <span>Wallet not connected.</span>
      </div>
    );
  }

  const formatAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md mx-auto">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-black rounded-full">
          <SolanaIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-cyan-400">
            {walletName ? `Connected to ${walletName}` : "Connected"}
          </p>
          <p className="font-mono text-lg text-white">
            {formatAddress(publicKey.toBase58())}
          </p>
        </div>
      </div>
      <button
        onClick={onDisconnect}
        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Disconnect
      </button>
    </div>
  );
};

export default ConnectionStatus;
