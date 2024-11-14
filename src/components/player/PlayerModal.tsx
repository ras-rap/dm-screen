import React from 'react';
import { PlayerType, importPlayerFromFile } from '@/components/types';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface PlayerModalProps {
  player: PlayerType;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  title: string;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onInputChange, onSave, title }) => (
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 gap-4">
      <Input
        value={player.name}
        onChange={(e) => onInputChange('name', e.target.value)}
      />
      <Input
        value={player.race}
        onChange={(e) => onInputChange('race', e.target.value)}
      />
      <Input
        value={player.class}
        onChange={(e) => onInputChange('class', e.target.value)}
      />
      <Input
        value={player.level}
        onChange={(e) => onInputChange('level', e.target.value)}
      />
      <Input
        value={player.hp}
        onChange={(e) => onInputChange('hp', e.target.value)}
      />
      <Input
        value={player.ac}
        onChange={(e) => onInputChange('ac', e.target.value)}
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
            />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <Textarea
          value={player.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="col-span-2">
        <h4 className="mb-2 font-medium">Inventory</h4>
        <div className="grid grid-cols-7 gap-2">
          {player.inventory.map((item, index) => (
            <input
              key={index}
              className="square-input"
              placeholder={`Slot ${index + 1}`}
              value={item}
              onChange={(e) => onInputChange(`inventory.${index}`, e.target.value)}
            />
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <h4 className="mb-2 font-medium">Notes</h4>
        <Textarea
          value={player.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="col-span-2 flex justify-end mt-4 space-x-2">
        <Button onClick={onSave}>
          Save
        </Button>
        <Button
          variant="outline"
          onClick={() => document.getElementById('import-player-input')?.click()}
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