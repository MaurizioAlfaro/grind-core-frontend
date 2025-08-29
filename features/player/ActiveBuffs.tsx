import React from "react";
import type { ActiveBoost } from "../../types";
import { ITEMS } from "../../constants/index";
import { clockService } from "../../services/clockService";

interface ActiveBuffsProps {
  activeBoosts: ActiveBoost[];
  onViewBuff: (buff: ActiveBoost) => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
};

export const ActiveBuffs: React.FC<ActiveBuffsProps> = ({
  activeBoosts,
  onViewBuff,
}) => {
  if (activeBoosts.length === 0) {
    return null;
  }

  const now = clockService.getCurrentTime();

  // Create array of 5 slots, filling with buffs and empty placeholders
  const buffSlots = Array.from({ length: 5 }, (_, index) => {
    const buff = activeBoosts[index];
    if (!buff) {
      return { isEmpty: true };
    }

    let displayInfo: { name: string; icon: string } | undefined;

    if (buff.sourceId === "initial_boost") {
      displayInfo = { name: "Initial Insight (15x Speed)", icon: "🚀" };
    } else {
      const itemData = ITEMS[buff.sourceId];
      if (itemData) {
        displayInfo = { name: itemData.name, icon: itemData.icon };
      }
    }

    if (!displayInfo) return { isEmpty: true };

    const timeLeftSeconds = Math.max(0, Math.ceil((buff.endTime - now) / 1000));

    return {
      isEmpty: false,
      buff,
      displayInfo,
      timeLeftSeconds,
    };
  });

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase font-bold mb-2 text-center">
        Active Buffs
      </h3>
      <div className="grid grid-cols-5 gap-1 w-full">
        {buffSlots.map((slot, index) => {
          if (slot.isEmpty) {
            return (
              <div
                key={`empty-${index}`}
                className="h-12 bg-gray-900/20 rounded-lg border border-gray-700/30 opacity-50"
              />
            );
          }

          // TypeScript guard to ensure these properties exist
          if (
            !slot.buff ||
            !slot.displayInfo ||
            slot.timeLeftSeconds === undefined
          ) {
            return (
              <div
                key={`error-${index}`}
                className="h-12 bg-red-900/20 rounded-lg border border-red-700/30 opacity-50"
              />
            );
          }

          const { buff, displayInfo, timeLeftSeconds } = slot;

          return (
            <button
              key={buff.sourceId + buff.endTime}
              className="flex flex-col items-center gap-1 p-1 bg-gray-900/50 rounded-lg border border-cyan-500/30 hover:bg-cyan-900/50 hover:border-cyan-400 transition-colors min-w-0"
              title={displayInfo.name}
              onClick={() => onViewBuff(buff)}
            >
              <span className="text-sm">{displayInfo.icon}</span>
              <span className="text-xs font-mono text-cyan-300 truncate w-full text-center">
                {formatTime(timeLeftSeconds)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
