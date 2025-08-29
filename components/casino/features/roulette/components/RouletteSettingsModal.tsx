
import React, { useState } from 'react';
import { RouletteSettings } from '../types';
import Accordion from './Accordion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: RouletteSettings) => void;
  currentSettings: RouletteSettings;
}

const RouletteSettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<RouletteSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  const updateSetting = <K extends keyof RouletteSettings>(key: K, value: RouletteSettings[K]) => {
      setSettings(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">Roulette Settings</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Accordion title="Table Rules">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Min Bet</label>
                        <input type="number" className="w-full p-2 bg-gray-900 rounded" value={settings.minBet} onChange={e => updateSetting('minBet', parseInt(e.target.value) || 1)} step="5" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Max Bet (per spot)</label>
                        <input type="number" className="w-full p-2 bg-gray-900 rounded" value={settings.maxBet} onChange={e => updateSetting('maxBet', parseInt(e.target.value) || 500)} step="10" />
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1">Wheel Type</label>
                    <select className="w-full p-2 bg-gray-900 rounded" value={settings.wheelType} onChange={(e) => updateSetting('wheelType', e.target.value as any)}>
                        <option value="american">American (0, 00)</option>
                        <option value="european" disabled>European (0) - Coming Soon</option>
                    </select>
                </div>
            </Accordion>
        </div>
        <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                Save & Restart
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Changing settings will restart the game.</p>
      </div>
    </div>
  );
};

export default RouletteSettingsModal;
