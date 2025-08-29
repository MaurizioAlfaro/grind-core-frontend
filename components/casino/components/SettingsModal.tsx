
import React, { useState } from 'react';
import { GameSettings } from '../features/blackjack/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: GameSettings) => void;
  currentSettings: GameSettings;
}

const Accordion: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-gray-700 rounded-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 font-semibold text-left"
            >
                <span>{title}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <div className="p-3 border-t border-gray-600 space-y-4">{children}</div>}
        </div>
    )
}

const Toggle: React.FC<{label: string; checked: boolean; onChange: (checked: boolean) => void}> = ({label, checked, onChange}) => (
    <label className="flex items-center justify-between">
      <span className="font-semibold">{label}</span>
      <div className="relative inline-block w-12 h-6">
        <input type="checkbox" className="absolute w-0 h-0 opacity-0" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-600'}`}></span>
        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></span>
      </div>
    </label>
);

const RadioGroup: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: {value: string; label: string}[];
}> = ({ value, onChange, options}) => (
    <div className="flex space-x-2">
        {options.map(opt => (
            <button key={opt.value} onClick={() => onChange(opt.value)} className={`px-3 py-1 text-sm rounded-full transition-colors ${value === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-900'}`}>
                {opt.label}
            </button>
        ))}
    </div>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<GameSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };
  
  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
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
            
            <Accordion title="Table Rules">
                <div>
                    <label className="block font-semibold mb-1" htmlFor="deckCount">Number of Decks</label>
                    <select id="deckCount" className="w-full p-2 bg-gray-900 rounded border border-gray-600" value={settings.deckCount} onChange={(e) => updateSetting('deckCount', parseInt(e.target.value))}>
                        {[1, 2, 4, 6, 8].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="minBet">Min Bet</label>
                        <input type="number" id="minBet" className="w-full p-2 bg-gray-900 rounded border border-gray-600" value={settings.minBet} onChange={e => updateSetting('minBet', parseInt(e.target.value) || 1)} step="5" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1" htmlFor="maxBet">Max Bet</label>
                        <input type="number" id="maxBet" className="w-full p-2 bg-gray-900 rounded border border-gray-600" value={settings.maxBet} onChange={e => updateSetting('maxBet', parseInt(e.target.value) || 500)} step="10" />
                    </div>
                </div>
            </Accordion>

            <Accordion title="Player Actions">
                 <Toggle label="Dealer Hits on Soft 17" checked={settings.hitSoft17} onChange={v => updateSetting('hitSoft17', v)} />
                 <Toggle label="Double After Split (DAS)" checked={settings.doubleAfterSplit} onChange={v => updateSetting('doubleAfterSplit', v)} />
                 <Toggle label="Late Surrender" checked={settings.surrenderEnabled} onChange={v => updateSetting('surrenderEnabled', v)} />
                 <label className="block font-semibold">Double Down On...</label>
                 <RadioGroup value={settings.doubleDownRule} onChange={v => updateSetting('doubleDownRule', v as any)} options={[{value: 'any', label: 'Any Two Cards'}, {value: '9_10_11', label: '9, 10, 11 Only'}]} />
                 <label className="block font-semibold">Splitting Aces...</label>
                 <RadioGroup value={settings.splitAcesRule} onChange={v => updateSetting('splitAcesRule', v as any)} options={[{value: 'one_card', label: 'Receives One Card'}, {value: 'multiple_cards', label: 'Can Hit Again'}]} />
                 <div>
                    <label className="block font-semibold mb-1" htmlFor="maxResplits">Max Re-Splits (up to 4 hands total)</label>
                    <select id="maxResplits" className="w-full p-2 bg-gray-900 rounded border border-gray-600" value={settings.maxResplits} onChange={(e) => updateSetting('maxResplits', parseInt(e.target.value))}>
                        <option value="0">Disallow Re-splitting</option>
                        <option value="1">1 (2 hands total)</option>
                        <option value="2">2 (3 hands total)</option>
                        <option value="3">3 (4 hands total)</option>
                    </select>
                 </div>
            </Accordion>
            
            <Accordion title="Payouts & Bonuses">
                 <label className="block font-semibold">Blackjack Payout</label>
                 <RadioGroup value={settings.blackjackPayout} onChange={v => updateSetting('blackjackPayout', v as any)} options={[{value: '3_2', label: '3 to 2'}, {value: '6_5', label: '6 to 5'}]} />
                 <Toggle label="Offer Insurance" checked={settings.insuranceEnabled} onChange={v => updateSetting('insuranceEnabled', v)} />
                 <Toggle label="5-Card Charlie Wins" checked={settings.fiveCardCharlieWins} onChange={v => updateSetting('fiveCardCharlieWins', v)} />
                 <Toggle label="Perfect Pairs Side Bet" checked={settings.perfectPairsBonus} onChange={v => updateSetting('perfectPairsBonus', v)} />
                 <Toggle label="21+3 Side Bet" checked={settings.twentyOnePlusThreeBonus} onChange={v => updateSetting('twentyOnePlusThreeBonus', v)} />
            </Accordion>
            
            <Accordion title="Development/Debug">
                <Toggle label="Reveal Dealer's Hole Card" checked={settings.showDealerCard} onChange={v => updateSetting('showDealerCard', v)} />
            </Accordion>


        </div>
        <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                Save & Restart
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Changing settings will restart the game with a new deck.</p>
      </div>
    </div>
  );
};

export default SettingsModal;
