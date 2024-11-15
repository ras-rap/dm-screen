import React, { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { PlayerType } from '../../components/types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { PlayerDetails } from '../../components/player/PlayerDetails';

interface PlayerCardProps { 
  player: PlayerType;
  onEdit: () => void;
  onDelete: () => void;
  onExport: (player: PlayerType) => void;
  onInventoryChange: (index: number, value: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete, onExport, onInventoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
                  <p>{player.hp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">AC</p>
                  <p>{player.ac}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={onEdit} className="hover:bg-blue-500">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onDelete} className="hover:bg-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => onExport(player)} className="hover:bg-green-500">
                <Download className="h-4 w-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="icon">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <PlayerDetails player={player} onInventoryChange={onInventoryChange} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};