import React from 'react';
import { StyledButton } from './StyledButton';

export type GameMode = 'early' | 'mid' | 'late';

interface GameModeSelectionModalProps {
  onSelectMode: (mode: GameMode) => void;
}

const ModeCard: React.FC<{ title: string, description: string, onSelect: () => void, buttonText: string }> = ({ title, description, onSelect, buttonText }) => (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center flex flex-col">
        <h3 className="text-2xl font-orbitron font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-400 mb-6 flex-grow">{description}</p>
        <StyledButton onClick={onSelect} className="w-full mt-auto">
            {buttonText}
        </StyledButton>
    </div>
);

export const GameModeSelectionModal: React.FC<GameModeSelectionModalProps> = ({ onSelectMode }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-800 rounded-xl border border-cyan-500/50 shadow-2xl w-full max-w-4xl animate-fade-in-up">
        <div className="p-8">
          <h2 className="text-4xl font-orbitron font-bold text-white mb-2 text-center">Welcome, Agent</h2>
          <p className="text-center text-gray-400 mb-8">Choose your starting point for the infiltration.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModeCard 
                  title="Early Game"
                  description="Start from the very beginning. Uncover the conspiracy from the ground up and experience the full journey."
                  onSelect={() => onSelectMode('early')}
                  buttonText="Begin"
              />
              <ModeCard 
                  title="Mid Game"
                  description="Jump into the action. Start as a seasoned agent with resources and unlocks to tackle mid-tier threats immediately."
                  onSelect={() => onSelectMode('mid')}
                  buttonText="Deploy"
              />
              <ModeCard 
                  title="Late Game"
                  description="Enter the endgame. Begin as a high-level operative with immense power and face the architects of reality."
                  onSelect={() => onSelectMode('late')}
                  buttonText="Execute"
              />
          </div>
        </div>
      </div>
    </div>
  );
};
