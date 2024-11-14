import React from 'react';
import { Edit2, Trash2, ChevronDown, Download } from 'lucide-react';
import { PlayerType } from '@/components/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PlayerDetails } from '@/components/player/PlayerDetails';

interface PlayerCardProps { 
  player: PlayerType;
  onEdit: () => void;
  onDelete: () => void;
  onExport: (player: PlayerType) => void;
  onInventoryChange: (index: number, value: string) => void;
}

export const PlayerCard = ({ player, onEdit, onDelete, onExport, onInventoryChange }: PlayerCardProps) => (
  <Card className="border-2">
    <CardContent className="pt-6">
      <Collapsible>
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            <div>
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <p className="text-sm text-muted-foreground">
                {player.race} {player.class}
              </p>
              <Badge variant="secondary">Level {player.level}</Badge>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-medium">HP</p>
                <Badge variant="destructive">{player.hp}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">AC</p>
                <Badge variant="secondary">{player.ac}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:text-blue-500"
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-100"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-green-500"
              onClick={() => onExport(player)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="mt-4">
          <PlayerDetails player={player} />
          <div className="mt-4">
            <h4 className="font-medium mb-2">Inventory</h4>
            <div className="grid grid-cols-7 gap-2">
              {player.inventory.map((item, index) => (
                <input
                  key={index}
                  className="square-input"
                  placeholder={`Slot ${index + 1}`}
                  value={item}
                  onChange={(e) => onInventoryChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
);