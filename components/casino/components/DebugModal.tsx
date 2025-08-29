
import React from 'react';
import { Card, GameSettings, LogEntry, LogType } from '../features/blackjack/types';

interface DebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Card[];
  settings: GameSettings;
  log: LogEntry[];
  onClearLog: () => void;
}

const logTypeColors: { [key in LogType]: string } = {
  action: 'text-blue-300',
  game: 'text-white',
  state: 'text-cyan-300',
  info: 'text-gray-400',
  decision: 'text-yellow-300',
  payout: 'text-green-300',
  error: 'text-red-400',
};

const DebugModal: React.FC<DebugModalProps> = ({ isOpen, onClose, deck, settings, log, onClearLog }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-yellow-400">Debug Info</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4 overflow-y-auto pr-2">
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-lg">Game State</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Cards Remaining: <span className="text-cyan-400 font-mono">{deck.length}</span></p>
            </div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-lg">Current Settings</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Deck Count: <span className="text-cyan-400">{settings.deckCount}</span></li>
              <li>Dealer Hits on Soft 17: <span className="text-cyan-400">{settings.hitSoft17 ? 'Yes' : 'No'}</span></li>
              <li>Surrender Enabled: <span className="text-cyan-400">{settings.surrenderEnabled ? 'Yes' : 'No'}</span></li>
              <li>Reveal Dealer Card: <span className="text-cyan-400">{settings.showDealerCard ? 'Yes' : 'No'}</span></li>
            </ul>
          </div>

           <div className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Game Log</h3>
                <button onClick={onClearLog} className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md shadow-md transition-colors">Clear Log</button>
              </div>
              <div className="max-h-80 overflow-y-auto bg-gray-900 p-2 rounded text-xs font-mono space-y-1 border border-gray-600">
                {log.length === 0 ? (
                  <p className="text-gray-500 italic">Log is empty. Start a new round to see events.</p>
                ) : (
                  log.map((entry, index) => (
                    <div key={`${entry.timestamp}-${index}`} className="flex items-start">
                      <span className="text-gray-500 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      <span className={`ml-2 font-bold w-20 text-center flex-shrink-0 ${logTypeColors[entry.type] || 'text-white'}`}>[{entry.type.toUpperCase()}]</span>
                      <span className="ml-2 break-words w-full">{entry.message}</span>
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugModal;
