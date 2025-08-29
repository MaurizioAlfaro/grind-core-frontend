
import React from 'react';
import { RouletteSettings, LogEntry, LogType } from '../types';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RouletteSettings;
  log: LogEntry[];
  onClearLog: () => void;
}

const logTypeColors: { [key in LogType]: string } = {
  action: 'text-blue-300', game: 'text-white', state: 'text-cyan-300',
  info: 'text-gray-400', decision: 'text-yellow-300',
  payout: 'text-green-300', error: 'text-red-400',
};

const RouletteDebugModal: React.FC<DebugModalProps> = ({ isOpen, onClose, settings, log, onClearLog }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-yellow-400">Roulette Debug Info</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4 overflow-y-auto pr-2">
            <div className="bg-gray-700 p-3 rounded">
                <h3 className="font-semibold text-lg">Current Settings</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Wheel Type: <span className="text-cyan-400">{settings.wheelType}</span></li>
                    <li>Min Bet: <span className="text-cyan-400">${settings.minBet}</span></li>
                    <li>Max Bet: <span className="text-cyan-400">${settings.maxBet}</span></li>
                </ul>
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Game Log</h3>
              <button onClick={onClearLog} className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">Clear Log</button>
            </div>
            <div className="max-h-96 overflow-y-auto bg-gray-900 p-2 rounded text-xs font-mono space-y-1 border border-gray-600">
                {log.length === 0 ? <p className="text-gray-500 italic">Log is empty.</p>
                : log.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="flex items-start">
                    <span className="text-gray-500 w-20 shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className={`ml-2 font-bold w-20 text-center shrink-0 ${logTypeColors[entry.type] || 'text-white'}`}>
                    [{entry.type.toUpperCase()}]
                    </span>
                    <span className="ml-2 break-words w-full">{entry.message}</span>
                </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteDebugModal;
