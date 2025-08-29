import React from 'react';

interface GameControlsProps {
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  onSurrender: () => void;
  canDouble: boolean;
  canSplit: boolean;
  canSurrender: boolean;
  isLoading: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = 
({ onClick, disabled, children, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 text-sm sm:px-5 sm:py-2 sm:text-lg font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const GameControls: React.FC<GameControlsProps> = ({ onHit, onStand, onDouble, onSplit, onSurrender, canDouble, canSplit, canSurrender, isLoading }) => {
  return (
    <div className="flex justify-center flex-wrap gap-2 sm:gap-4 p-2 sm:p-4">
      <ActionButton onClick={onHit} disabled={isLoading} className="bg-green-600 text-white">Hit</ActionButton>
      <ActionButton onClick={onStand} disabled={isLoading} className="bg-red-700 text-white">Stand</ActionButton>
      <ActionButton onClick={onDouble} disabled={isLoading || !canDouble} className="bg-blue-600 text-white">Double</ActionButton>
      <ActionButton onClick={onSplit} disabled={isLoading || !canSplit} className="bg-purple-600 text-white">Split</ActionButton>
      {canSurrender && (
        <ActionButton onClick={onSurrender} disabled={isLoading} className="bg-gray-600 text-white">Surrender</ActionButton>
      )}
    </div>
  );
};

export default GameControls;