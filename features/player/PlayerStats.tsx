import React from "react";
import type { PlayerState } from "../../types";
import { LEVEL_XP_REQUIREMENTS } from "../../constants/index";
import { PowerIcon } from "./icons/PowerIcon";
import { XpIcon } from "./icons/XpIcon";
import { GoldIcon } from "./icons/GoldIcon";
import { DollarIcon } from "../../components/icons/DollarIcon";

interface PlayerStatsProps {
  player: PlayerState;
}

const StatDisplay: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  id?: string;
}> = ({ icon, label, value, color, id }) => (
  <div
    id={id}
    className={`flex flex-col items-center justify-center p-1 rounded-lg bg-gray-800 border border-gray-700 ${color}`}
  >
    <div className="flex items-center gap-1">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-bold">{value}</span>
    </div>
    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
      {label}
    </span>
  </div>
);

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const xpForNextLevel = LEVEL_XP_REQUIREMENTS[player.level] || Infinity;
  const xpProgress =
    xpForNextLevel === Infinity ? 100 : (player.xp / xpForNextLevel) * 100;

  return (
    <div className="space-y-3">
      {player.reptilianzNFTs && player.reptilianzNFTs.length > 0 && (
        <p className="text-xs font-orbitron font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text">
          ✨ Verified Owner Bonus ✨
        </p>
      )}
      <div className="flex items-center gap-3">
        <h2
          id="player-stats-level"
          className="text-lg font-orbitron font-bold text-cyan-400 whitespace-nowrap"
        >
          LVL {player.level}
        </h2>
        <div id="player-stats-xp-bar" className="w-full">
          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
            <span>{player.xp.toLocaleString()}</span>
            <span>
              {xpForNextLevel === Infinity
                ? "MAX"
                : xpForNextLevel.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatDisplay
          id="player-stats-power"
          icon={<PowerIcon className="w-4 h-4 text-red-400" />}
          label="Power"
          value={player.power.toLocaleString()}
          color="text-red-400"
        />
        <StatDisplay
          id="player-stats-gold"
          icon={<GoldIcon className="w-4 h-4 text-yellow-400" />}
          label="Gold"
          value={player.gold.toLocaleString()}
          color="text-yellow-400"
        />
        <StatDisplay
          id="player-stats-xp"
          icon={<XpIcon className="w-4 h-4 text-green-400" />}
          label="XP"
          value={player.xp.toLocaleString()}
          color="text-green-400"
        />
        <StatDisplay
          id="player-stats-usd"
          icon={<DollarIcon className="w-4 h-4 text-green-500" />}
          label="USD"
          value={`$${player.dollars.toLocaleString()}`}
          color="text-green-500"
        />
      </div>
    </div>
  );
};
