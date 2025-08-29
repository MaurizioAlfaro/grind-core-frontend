import React from "react";
import { StyledButton } from "./StyledButton";

interface ConnectWalletModalProps {
  onConnect: () => void;
  onClose: () => void;
}

const Benefit: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4 text-left">
    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center text-2xl text-cyan-400">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-400">{children}</p>
    </div>
  </div>
);

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  onConnect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border-2 border-purple-500/80 shadow-2xl shadow-purple-500/20 w-full max-w-lg animate-fade-in-up">
        <div className="p-8 text-center">
          <img
            src="https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/33.jpeg"
            alt="Reptilianz Dealer"
            className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 mb-4 object-cover"
          />
          <h2 className="text-3xl font-orbitron font-bold text-purple-400 mb-2">
            Secure Your Progress
          </h2>
          <p className="text-gray-300 mb-8">
            Connect your Solana wallet to enable cloud saves and unlock
            exclusive bonuses for Reptilianz NFT holders.
          </p>

          <div className="space-y-6 mb-8">
            <Benefit icon="☁️" title="Cloud Save & Sync">
              Link your wallet to save your progress securely. Play on any
              device, anywhere, without losing a second of your grind.
            </Benefit>
            <Benefit icon="👑" title="Reptilianz Holder Bonuses">
              As a verified owner of a Reptilianz NFT, you are entitled to
              exclusive, permanent bonuses:
              <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                <li>
                  <span className="font-bold text-green-400">100% more XP</span>{" "}
                  from all sources.
                </li>
                <li>
                  <span className="font-bold text-yellow-400">
                    100% more Gold
                  </span>{" "}
                  from all sources.
                </li>
                <li>
                  <span className="font-bold text-blue-400">
                    50% more Item Drop Chance
                  </span>
                  .
                </li>
              </ul>
            </Benefit>
          </div>

          <div className="space-y-3">
            <StyledButton
              onClick={onConnect}
              variant="primary"
              className="w-full !bg-purple-600 hover:!bg-purple-700 !shadow-purple-500/30"
            >
              <div className="flex items-center justify-center gap-2">
                <span>🔗</span>
                <span>Connect Wallet</span>
              </div>
            </StyledButton>

            <StyledButton
              onClick={onClose}
              variant="secondary"
              className="w-full"
            >
              Maybe Later
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};
