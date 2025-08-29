
import React, { useState } from 'react';
import { GameSettings } from '../../features/blackjack/types';
import Accordion from './Accordion';
import { Toggle, RadioGroup } from './SettingsFormControls';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: GameSettings) => void;
  currentSettings: GameSettings;
}

type SettingsUpdater = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;

const TableRules: React.FC<{s: GameSettings, u: SettingsUpdater}> = ({ s, u }) => (
  <>
    <div>
        <label className="block font-semibold mb-1" htmlFor="deckCount">Number of Decks</label>
        <select id="deckCount" className="w-full p-2 bg-gray-900 rounded" value={s.deckCount} onChange={(e) => u('deckCount', parseInt(e.target.value))}>
            {[1, 2, 4, 6, 8].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
    </div>
    <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block font-semibold mb-1" htmlFor="minBet">Min Bet</label>
            <input type="number" id="minBet" className="w-full p-2 bg-gray-900 rounded" value={s.minBet} onChange={e => u('minBet', parseInt(e.target.value) || 1)} step="5" />
        </div>
        <div>
            <label className="block font-semibold mb-1" htmlFor="maxBet">Max Bet</label>
            <input type="number" id="maxBet" className="w-full p-2 bg-gray-900 rounded" value={s.maxBet} onChange={e => u('maxBet', parseInt(e.target.value) || 500)} step="10" />
        </div>
    </div>
  </>
);

const PlayerActions: React.FC<{s: GameSettings, u: SettingsUpdater}> = ({s, u}) => (
    <>
        <Toggle label="Dealer Hits on Soft 17" checked={s.hitSoft17} onChange={v => u('hitSoft17', v)} />
        <Toggle label="Double After Split (DAS)" checked={s.doubleAfterSplit} onChange={v => u('doubleAfterSplit', v)} />
        <Toggle label="Late Surrender" checked={s.surrenderEnabled} onChange={v => u('surrenderEnabled', v)} />
        <label className="block font-semibold">Double Down On...</label>
        <RadioGroup value={s.doubleDownRule} onChange={v => u('doubleDownRule', v as any)} options={[{value: 'any', label: 'Any Two Cards'}, {value: '9_10_11', label: '9, 10, 11 Only'}]} />
    </>
);

const Payouts: React.FC<{s: GameSettings, u: SettingsUpdater}> = ({s, u}) => (
    <>
        <label className="block font-semibold">Blackjack Payout</label>
        <RadioGroup value={s.blackjackPayout} onChange={v => u('blackjackPayout', v as any)} options={[{value: '3_2', label: '3 to 2'}, {value: '6_5', label: '6 to 5'}]} />
        <Toggle label="Offer Insurance" checked={s.insuranceEnabled} onChange={v => u('insuranceEnabled', v)} />
    </>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<GameSettings>(currentSettings);
  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  const updateSetting: SettingsUpdater = (key, value) => {
      setSettings(prev => ({...prev, [key]: value}));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">Game Settings</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Accordion title="Table Rules"><TableRules s={settings} u={updateSetting} /></Accordion>
            <Accordion title="Player Actions"><PlayerActions s={settings} u={updateSetting} /></Accordion>
            <Accordion title="Payouts & Bonuses"><Payouts s={settings} u={updateSetting} /></Accordion>
        </div>
        <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">Save & Restart</button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Changing settings will restart the game.</p>
      </div>
    </div>
  );
};

export default SettingsModal;
