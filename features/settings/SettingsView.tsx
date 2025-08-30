import React, { useState } from "react";
import type { PlayerState } from "../../types";
import { StyledButton } from "../../components/common/StyledButton";
import { walletAuthService } from "../../services/walletAuthService";
import { PhantomIcon } from "../navigation/icons/PhantomIcon";
import { GoldIcon } from "../player/icons/GoldIcon";
import { XpIcon } from "../player/icons/XpIcon";
import { CollectionIcon } from "../navigation/icons/CollectionIcon";
import { DisplayNameEditor } from "./DisplayNameEditor";

interface SettingsViewProps {
  player: PlayerState;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleNFT: () => void; // Dev only
  onLogout: () => void;
  isDevMode: boolean;
  onPlayerUpdate?: (newPlayerState: PlayerState) => void;
}

const StatusCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
    <h3 className="text-md font-orbitron text-gray-400 mb-3">{title}</h3>
    {children}
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({
  player,
  onConnect,
  onDisconnect,
  onToggleNFT,
  onLogout,
  isDevMode,
  onPlayerUpdate,
}) => {
  const [recoveryString, setRecoveryString] = useState<string | null>(null);
  const [isGeneratingRecovery, setIsGeneratingRecovery] = useState(false);

  const handleDisplayNameUpdate = (newPlayerState: PlayerState) => {
    // Update the player state in the parent component
    if (onPlayerUpdate) {
      onPlayerUpdate(newPlayerState);
    }
    console.log("Player state updated:", newPlayerState);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-orbitron text-cyan-400">
          Account Settings
        </h2>
        <p className="text-gray-400">Manage your connection and bonuses.</p>
      </div>

      <div className="space-y-4">
        <StatusCard title="Username">
          <DisplayNameEditor
            currentDisplayName={player.displayName}
            onUpdate={handleDisplayNameUpdate}
          />
        </StatusCard>

        <StatusCard title="Wallet Connection">
          {player.isWalletConnected ? (
            <div>
              <p className="font-semibold text-green-400">Wallet Connected</p>
              <p className="text-xs text-gray-500">
                Your progress is being saved to the cloud.
              </p>
              <p className="text-xs text-cyan-400 font-mono mt-2 break-all">
                {player.walletAddress}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-yellow-400">Not Connected</p>
                <p className="text-xs text-gray-500">
                  Connect to enable cloud saves & NFT bonuses.
                </p>
              </div>
              <StyledButton
                onClick={onConnect}
                className="!bg-purple-600 hover:!bg-purple-700 !shadow-purple-500/30"
              >
                <div className="flex items-center justify-center gap-2">
                  <PhantomIcon />
                  <span>Connect</span>
                </div>
              </StyledButton>
            </div>
          )}
        </StatusCard>

        <StatusCard title="Reptilianz NFT Bonuses">
          {player.ownsReptilianzNFT ? (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {player.reptilianzNFTs && player.reptilianzNFTs.length > 0 && (
                  <img
                    src={player.reptilianzNFTs[0].image}
                    alt="Reptilianz NFT"
                    className="w-16 h-16 rounded-lg border-2 border-yellow-400"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-400 mb-3">
                  HOLDER STATUS: <span className="text-yellow-300">ACTIVE</span>
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <XpIcon className="w-5 h-5 text-green-400" />
                    <span>+100% XP Bonus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GoldIcon className="w-5 h-5 text-yellow-400" />
                    <span>+100% Gold Bonus</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-red-400 mb-2">
                HOLDER STATUS: <span className="text-gray-500">INACTIVE</span>
              </p>
              <p className="text-sm text-gray-400">
                Connect your wallet and own a Reptilianz NFT to unlock powerful,
                permanent in-game bonuses.
              </p>
            </div>
          )}
          {/* Dev NFT toggle button commented out
          {isDevMode && player.isWalletConnected && (
            <StyledButton
              onClick={onToggleNFT}
              variant="secondary"
              className="w-full mt-4 text-xs"
            >
              (Dev) Toggle NFT Status
            </StyledButton>
          )}
          */}
        </StatusCard>

        <StatusCard title="Recovery String">
          <div className="space-y-4">
            {recoveryString ? (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Save this recovery string somewhere safe. You can use it to
                  restore your account on any device.
                </p>
                <div className="bg-gray-900 p-3 rounded border border-gray-600 font-mono text-sm break-all">
                  {recoveryString}
                </div>
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ Keep this secret and safe! Anyone with this string can
                  access your account.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Generate a recovery string to restore your account on other
                  devices.
                </p>
                <StyledButton
                  onClick={async () => {
                    try {
                      setIsGeneratingRecovery(true);
                      const result =
                        await walletAuthService.generateRecoveryString();
                      setRecoveryString(result.recoveryString);
                    } catch (error) {
                      console.error(
                        "Failed to generate recovery string:",
                        error
                      );
                    } finally {
                      setIsGeneratingRecovery(false);
                    }
                  }}
                  disabled={isGeneratingRecovery}
                  className="w-full"
                >
                  {isGeneratingRecovery
                    ? "Generating..."
                    : "Generate Recovery String"}
                </StyledButton>
              </div>
            )}
          </div>
        </StatusCard>

        <StatusCard title="Account Management">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-3">
                Log out of your account to return to the login screen.
              </p>
              <StyledButton
                onClick={onLogout}
                variant="danger"
                className="w-full"
              >
                Log Out
              </StyledButton>
            </div>
          </div>
        </StatusCard>
      </div>
    </div>
  );
};
