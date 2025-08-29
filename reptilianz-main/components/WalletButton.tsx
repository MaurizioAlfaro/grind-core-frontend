import React from "react";

interface WalletButtonProps {
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onClick,
  title,
  description,
  icon,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center w-full p-6 space-x-6 text-left bg-gray-800 rounded-2xl border border-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
    >
      <div className="flex-shrink-0 p-3 bg-gray-900 rounded-lg">{icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </button>
  );
};

export default WalletButton;
