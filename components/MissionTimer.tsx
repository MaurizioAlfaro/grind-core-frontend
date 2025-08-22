
import React from 'react';

interface MissionTimerProps {
  timeLeft: number;
  onClaim: () => void;
}

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const MissionTimer: React.FC<MissionTimerProps> = ({ timeLeft, onClaim }) => {
  const isComplete = timeLeft <= 0;

  return (
    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center">
      <h3 className="text-lg font-orbitron text-gray-400 mb-2">Active Mission</h3>
      {isComplete ? (
        <button
          onClick={onClaim}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
        >
          CLAIM REWARDS
        </button>
      ) : (
        <div className="text-4xl font-orbitron font-bold text-cyan-400 tracking-wider">
          {formatTime(timeLeft)}
        </div>
      )}
    </div>
  );
};
