
import React from 'react';
import { StyledButton } from '../../components/common/StyledButton';

interface InitialBoostModalProps {
  onClose: () => void;
}

export const InitialBoostModal: React.FC<InitialBoostModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border-2 border-yellow-500/80 shadow-2xl shadow-yellow-500/20 w-full max-w-md animate-fade-in-up">
        <div className="p-6 text-center">
          <div className="text-7xl mb-4">🚀</div>
          <h2 className="text-3xl font-orbitron font-bold text-yellow-400 mb-4">Initial Insight Gained!</h2>
          <p className="text-gray-300 mb-6">
            A surge of insight from your first successful operations reveals new efficiencies. Your mind races, unlocking pathways to hyper-productivity.
          </p>
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <p className="text-xl font-bold text-white">Reward: <span className="text-cyan-400">15x Mission Speed</span></p>
            <p className="text-gray-400">Duration: 10 Minutes</p>
          </div>
          <StyledButton onClick={onClose} className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600">
            Activate!
          </StyledButton>
        </div>
      </div>
    </div>
  );
};
