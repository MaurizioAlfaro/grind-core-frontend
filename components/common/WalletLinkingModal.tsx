import React from "react";

interface WalletLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeepLocalData: () => void;
  onContinueWithWalletData: () => void;
  walletPlayerData: {
    level: number;
    gold: number;
    xp: number;
    power: number;
  };
  isLoading?: boolean;
}

export const WalletLinkingModal: React.FC<WalletLinkingModalProps> = ({
  isOpen,
  onClose,
  onKeepLocalData,
  onContinueWithWalletData,
  walletPlayerData,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Wallet Account Found! 🎯
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            We found an existing account associated with this wallet:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Level:</span>
              <span className="text-blue-600">{walletPlayerData.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gold:</span>
              <span className="text-yellow-600">{walletPlayerData.gold}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">XP:</span>
              <span className="text-green-600">{walletPlayerData.xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Power:</span>
              <span className="text-red-600">{walletPlayerData.power}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onKeepLocalData}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? "Processing..." : "Keep Local Data"}
          </button>

          <button
            onClick={onContinueWithWalletData}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isLoading ? "Processing..." : "Continue with Wallet Data"}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
