import React from "react";
import { WalletIcon, KeyIcon, UserIcon } from "./icons";

interface LoginScreenProps {
  onNewAccount: () => void;
  onWalletLogin: () => void;
  onRecoveryLogin: () => void;
}

const LoginOption: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "accent";
}> = ({ icon, title, description, onClick, variant = "primary" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500/50 hover:from-purple-700 hover:to-purple-900 shadow-purple-500/30";
      case "secondary":
        return "bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-500/50 hover:from-cyan-700 hover:to-cyan-900 shadow-cyan-500/30";
      case "accent":
        return "bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-500/50 hover:from-emerald-700 hover:to-emerald-900 shadow-emerald-500/30";
      default:
        return "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500/50 hover:from-purple-700 hover:to-purple-900 shadow-purple-500/30";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group w-full p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${getVariantStyles()}`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl text-white group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-purple-100 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNewAccount,
  onWalletLogin,
  onRecoveryLogin,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img
              src="/assets/images/misc/reptilianz_nft.png"
              alt="Reptilianz"
              className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500/50 shadow-2xl shadow-purple-500/30"
            />
          </div>
          <h1 className="text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-4">
            GRIND CORE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The ultimate idle RPG where your reptilian warriors grind, loot, and
            evolve in a world of endless possibilities.
          </p>
        </div>

        {/* Login Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <LoginOption
            icon={<UserIcon />}
            title="New Account"
            description="Start your journey as a fresh reptilian warrior. Create a new character and begin your adventure from scratch."
            onClick={onNewAccount}
            variant="primary"
          />

          <LoginOption
            icon={<WalletIcon />}
            title="Log in with Wallet"
            description="Connect your Solana wallet to access your existing account. Secure, fast, and blockchain-powered."
            onClick={onWalletLogin}
            variant="secondary"
          />

          <LoginOption
            icon={<KeyIcon />}
            title="Recovery Phrase"
            description="Restore your account using your recovery phrase. Never lose your progress again."
            onClick={onRecoveryLogin}
            variant="accent"
          />
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-400 text-sm">
          <p className="mb-2">
            🚀 Powered by Solana Blockchain • 🔒 Secure & Decentralized
          </p>
          <p>
            Connect your wallet to enable cloud saves, NFT bonuses, and
            cross-device synchronization.
          </p>
        </div>
      </div>
    </div>
  );
};
