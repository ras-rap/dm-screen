import React from 'react';
import { PlayerType, importPlayerFromFile } from '@/components/types';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PlayerModalProps {
  player: PlayerType;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  title: string;
  isDarkMode: boolean;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onInputChange, onSave, title, isDarkMode }) => (
  <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-black'}`}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 gap-4">
      <Input
        value={player.name}
        onChange={(e) => onInputChange('name', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <Input
        value={player.race}
        onChange={(e) => onInputChange('race', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <Input
        value={player.class}
        onChange={(e) => onInputChange('class', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <Input
        value={player.level}
        onChange={(e) => onInputChange('level', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <Input
        value={player.hp}
        onChange={(e) => onInputChange('hp', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <Input
        value={player.ac}
        onChange={(e) => onInputChange('ac', e.target.value)}
        className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
      />
      <div className="col-span-2">
        <h4 className="mb-2 font-medium">Stats</h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(player.stats).map(([stat, value]) => (
            <Input
              key={stat}
              placeholder={stat.toUpperCase()}
              value={value}
              onChange={(e) => onInputChange(`stats.${stat}`, e.target.value)}
              className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <Textarea
          value={player.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          className={`min-h-[100px] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="col-span-2">
        <h4 className="mb-2 font-medium">Inventory</h4>
        <div className="grid grid-cols-7 gap-2">
          {player.inventory.map((item, index) => (
            <Input
              key={index}
              placeholder={`Slot ${index + 1}`}
              value={item}
              onChange={(e) => onInputChange(`inventory.${index}`, e.target.value)}
              className={`${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <Textarea
          value={player.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          className={`min-h-[100px] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        />
      </div>
      <div className="col-span-2 flex justify-end mt-4 space-x-2">
        <Button onClick={onSave} className={`${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-black'}`}>
          Save
        </Button>
        <Button
          variant="outline"
          onClick={() => document.getElementById('import-player-input')?.click()}
          className={`${isDarkMode ? 'border-black text-black' : 'border-white text-black'}`}
        >
          Import Player
        </Button>
        <Input
          id="import-player-input"
          type="file"
          accept="application/json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              importPlayerFromFile(file).then((importedPlayer) => {
                Object.entries(importedPlayer).forEach(([key, value]) => {
                  onInputChange(key, value as string);
                });
              }).catch(console.error);
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  </DialogContent>
);