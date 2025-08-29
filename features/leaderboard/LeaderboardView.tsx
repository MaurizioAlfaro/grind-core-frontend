import React from "react";
import type { PlayerState } from "../../types";
import { LEADERBOARD_DATA, type LeaderboardEntry } from "../../constants/index";
import { PowerIcon } from "../player/icons/PowerIcon";

interface LeaderboardViewProps {
  player: PlayerState;
  onOpenProfile: (profile: LeaderboardEntry) => void;
}

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1)
    return (
      <span className="text-2xl" role="img" aria-label="1st place">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="text-2xl" role="img" aria-label="2nd place">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="text-2xl" role="img" aria-label="3rd place">
        🥉
      </span>
    );
  return <span className="text-gray-400 font-bold text-sm">#{rank}</span>;
};

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  player,
  onOpenProfile,
}) => {
  const processedData = LEADERBOARD_DATA.map((entry) => {
    if (entry.isPlayer) {
      return {
        ...entry,
        level: player.level,
        power: player.power,
        equipment: player.equipment,
        unlockedBadgeIds: Array.from(player.unlockedBadgeIds),
      };
    }
    return entry;
  })
    .sort((a, b) => b.power - a.power)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const playerEntry = processedData.find((e) => e.isPlayer);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-orbitron text-cyan-400">
          Global Rankings
        </h2>
        <p className="text-gray-400">
          See how you stack up against other agents.
        </p>
        <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-300 text-sm font-semibold">
            🚧 Coming Soon! 🚧
          </p>
          <p className="text-yellow-200 text-xs mt-1">
            Global rankings will be live in the next few days. This is a preview
            of how it will look!
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-2 space-y-2">
        {processedData.map((entry) => (
          <button
            key={entry.name}
            onClick={() => onOpenProfile(entry)}
            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-left ${
              entry.isPlayer
                ? "bg-cyan-900/50 border-2 border-cyan-500 hover:bg-cyan-900/70"
                : "bg-gray-900/50 hover:bg-gray-900/80"
            }`}
          >
            <div className="w-10 text-center flex-shrink-0">
              <RankIcon rank={entry.rank} />
            </div>
            <div className="flex-1">
              <p
                className={`font-bold ${
                  entry.isPlayer ? "text-cyan-300" : "text-white"
                }`}
              >
                {entry.name}
              </p>
              <p className="text-xs text-gray-400">Level {entry.level}</p>
            </div>
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <PowerIcon className="w-5 h-5" />
              <span>{entry.power.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>

      {playerEntry && (
        <div className="text-center text-gray-400 font-semibold">
          Your Rank:{" "}
          <span className="text-cyan-400 text-lg">#{playerEntry.rank}</span>
        </div>
      )}
    </div>
  );
};
