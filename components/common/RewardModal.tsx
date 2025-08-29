import React from "react";
import type { Rewards } from "../../types";
import { ITEMS } from "../../constants/index";
import { GoldIcon } from "../../features/player/icons/GoldIcon";
import { XpIcon } from "../../features/player/icons/XpIcon";
import { DollarIcon } from "../icons/DollarIcon";
import { StyledButton } from "./StyledButton";
import { ItemIcon } from "./ItemIcon";

interface RewardModalProps {
  title: string;
  rewards: Rewards;
  onClose: () => void;
  player?: any; // Player state to check for Reptilianz NFT bonuses
}

const RarityColorMap: { [key: string]: string } = {
  Common: "border-gray-400",
  Rare: "border-blue-400",
  Epic: "border-purple-500",
  Legendary: "border-orange-500",
};

export const RewardModal: React.FC<RewardModalProps> = ({
  title,
  rewards,
  onClose,
  player,
}) => {
  // 🎭 Calculate base rewards and bonus display for Reptilianz NFT holders
  const hasReptilianzNFT =
    player?.ownsReptilianzNFT &&
    player?.reptilianzNFTs &&
    player.reptilianzNFTs.length > 0;

  // Calculate base rewards (divide by 2 if bonus is active, since rewards are already doubled)
  const baseXp = hasReptilianzNFT ? Math.floor(rewards.xp / 2) : rewards.xp;
  const baseGold = hasReptilianzNFT
    ? Math.floor(rewards.gold / 2)
    : rewards.gold;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <h2 className="text-3xl font-orbitron font-bold text-cyan-400 mb-4">
            {title}
          </h2>
          <p className="text-gray-400 mb-6">
            You have received the following rewards:
          </p>

          {/* 🎭 Reptilianz NFT Bonus Indicator */}
          {hasReptilianzNFT && (
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-400/50 rounded-lg p-3 mb-4">
              <div className="text-cyan-400 text-sm font-semibold">
                🎭 Reptilianz NFT Holder Bonus Active!
              </div>
              <div className="text-gray-300 text-xs mt-1">
                +100% XP and Gold from all rewards
              </div>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {rewards.xp > 0 && (
              <div className="flex items-center justify-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                <XpIcon className="w-8 h-8 text-green-400" />
                <div className="text-center">
                  <span className="text-xl font-bold text-green-400">
                    +{rewards.xp.toLocaleString()} XP
                  </span>
                  {hasReptilianzNFT && (
                    <div className="text-sm text-cyan-400 mt-1">
                      {baseXp} + {baseXp} (Holder) = {rewards.xp}
                    </div>
                  )}
                </div>
              </div>
            )}
            {rewards.gold > 0 && (
              <div className="flex items-center justify-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                <GoldIcon className="w-8 h-8 text-yellow-400" />
                <div className="text-center">
                  <span className="text-xl font-bold text-yellow-400">
                    +{rewards.gold.toLocaleString()} Gold
                  </span>
                  {hasReptilianzNFT && (
                    <div className="text-sm text-cyan-400 mt-1">
                      {baseGold} + {baseGold} (Holder) = {rewards.gold}
                    </div>
                  )}
                </div>
              </div>
            )}
            {rewards.dollars > 0 && (
              <div className="flex items-center justify-center gap-4 bg-gray-900/50 p-3 rounded-lg">
                <DollarIcon className="w-8 h-8 text-green-400" />
                <span className="text-xl font-bold text-green-400">
                  +${rewards.dollars.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {rewards.items.length > 0 && (
            <div>
              <h3 className="text-xl font-orbitron text-gray-300 mb-4">
                Items Found
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-lg">
                {rewards.items.map((item, index) => {
                  const itemData = ITEMS[item.itemId];
                  if (!itemData) return null;
                  return (
                    <div
                      key={`${item.itemId}-${index}`}
                      className={`flex flex-col items-center justify-center p-1 bg-gray-800 rounded-lg border-2 ${
                        RarityColorMap[itemData.rarity]
                      } h-20`}
                    >
                      <ItemIcon
                        item={itemData}
                        className="text-2xl"
                        imgClassName="w-8 h-8 object-contain"
                      />
                      <span className="text-[11px] text-center leading-tight mt-1">
                        {itemData.name}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[11px] text-cyan-400">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <StyledButton
            id="reward-modal-close-btn"
            onClick={onClose}
            className="mt-8 w-full"
          >
            Awesome!
          </StyledButton>
        </div>
      </div>
    </div>
  );
};
