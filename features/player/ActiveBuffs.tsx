import React, { useEffect, useState } from "react";
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
  const [currentTime, setCurrentTime] = useState(clockService.getCurrentTime());

  // Update time every second to refresh buff durations
  useEffect(() => {
    const interval = setInterval(() => {
      // Round down to the nearest second to ensure all buffs update simultaneously
      const now = clockService.getCurrentTime();
      const roundedTime = Math.floor(now / 1000) * 1000;
      setCurrentTime(roundedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (activeBoosts.length === 0) {
    return null;
  }

  // Use the state variable instead of calling clockService directly
  const now = currentTime;

  // Filter out expired buffs first
  const activeBuffs = activeBoosts.filter((buff) => {
    const timeLeftSeconds = Math.max(
      0,
      Math.floor((buff.endTime - now) / 1000)
    );
    return timeLeftSeconds > 0;
  });

  // If no active buffs after filtering, don't render anything
  if (activeBuffs.length === 0) {
    return null;
  }

  // Create array of slots, only for active buffs (max 5)
  const buffSlots = activeBuffs
    .slice(0, 5)
    .map((buff, index) => {
      let displayInfo: { name: string; icon: string } | undefined;

      if (buff.sourceId === "initial_boost") {
        displayInfo = { name: "Initial Insight (15x Speed)", icon: "🚀" };
      } else {
        const itemData = ITEMS[buff.sourceId];
        if (itemData) {
          displayInfo = { name: itemData.name, icon: itemData.icon };
        }
      }

      if (!displayInfo) return null;

      const timeLeftSeconds = Math.max(
        0,
        Math.floor((buff.endTime - now) / 1000)
      );

      return {
        buff,
        displayInfo,
        timeLeftSeconds,
      };
    })
    .filter(Boolean); // Remove any null entries

  return (
    <div>
      {/* <h3 className="text-xs text-gray-400 uppercase font-bold mb-2 text-center">
        Active Buffs
      </h3> */}
      <div className="grid grid-cols-5 gap-1 w-full">
        {buffSlots.map((slot, index) => {
          if (!slot) {
            return (
              <div
                key={`empty-${index}`}
                className="h-12 bg-gray-900/20 rounded-lg border border-gray-700/30 opacity-50"
              />
            );
          }

          const { buff, displayInfo, timeLeftSeconds } = slot;

          return (
            <button
              key={buff.sourceId + buff.endTime}
              className="flex flex-row items-center gap-1 p-1 bg-gray-900/50 rounded-lg border border-cyan-500/30 hover:bg-cyan-900/50 hover:border-cyan-400 transition-colors min-w-0"
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
        {/* Fill remaining slots with empty placeholders to maintain 5 columns */}
        {Array.from({ length: 5 - buffSlots.length }, (_, index) => (
          <div
            key={`remaining-empty-${index}`}
            className="h-12 bg-gray-900/20 rounded-lg border border-gray-700/30 opacity-50"
          />
        ))}
      </div>
    </div>
  );
};
