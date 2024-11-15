import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { PlayerType, emptyPlayer } from './types';
import { DiceRoller } from '../components/DiceRoller';
import { NotesSection } from '../components/NotesSection';
import { PlayerCard } from '../components/player/PlayerCard';
import { PlayerModal } from '../components/player/PlayerModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogTrigger } from '../components/ui/dialog';
import SettingsModal from '../components/SettingsModal';

const DMDashboard: React.FC = () => {
  const [notes, setNotes] = useState<string>("");
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayer, setNewPlayer] = useState<PlayerType>(emptyPlayer);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleAddPlayer = () => {
    if (newPlayer.name) {
      setPlayers(prev => [...prev, { ...newPlayer }]);
      setNewPlayer(emptyPlayer);
      localStorage.setItem('players', JSON.stringify([...players, { ...newPlayer }]));
    }
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(prev => {
      const updatedPlayers = prev.filter((_, i) => i !== index);
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });
  };

  const handleEditInputChange = (field: keyof PlayerType | string, value: string) => {
    if (!editingPlayer) return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditingPlayer(prev => {
        if (parent === 'inventory') {
          const updatedInventory = [...(prev!.inventory || Array(7).fill(""))];
          updatedInventory[parseInt(child)] = value;
          return {
            ...prev!,
            inventory: updatedInventory
          };
        } else {
          return {
            ...prev!,
            [parent]: {
              ...(prev![parent as keyof PlayerType] as Record<string, string>),
              [child]: value
            }
          };
        }
      });
    } else {
      setEditingPlayer(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleNewPlayerInputChange = (field: keyof PlayerType | string, value: string) => {
    setNewPlayer(prev => {
      const updatedPlayer: Partial<PlayerType> = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'inventory') {
          if (!updatedPlayer.inventory) {
            updatedPlayer.inventory = Array(7).fill("");
          }
          updatedPlayer.inventory[parseInt(child)] = value;
        } else {
          if (!updatedPlayer[parent as keyof PlayerType]) {
            (updatedPlayer[parent as keyof PlayerType] as { [key: string]: string }) = {};
          }
          (updatedPlayer[parent as keyof PlayerType] as Record<string, string>)[child] = value;
        }
      } else {
        (updatedPlayer as Record<string, string>)[field] = value;
      }
      return updatedPlayer as PlayerType;
    });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    localStorage.setItem('notes', value);
  };

  const startEditing = (player: PlayerType, index: number) => {
    setEditingPlayer({ ...player });
    setEditingIndex(index);
  };

  const saveEditing = () => {
    if (editingPlayer && editingIndex !== null) {
      setPlayers(prev => prev.map((p, i) => 
        i === editingIndex ? editingPlayer : p
      ));
      setEditingPlayer(null);
      setEditingIndex(null);
    }
  };

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('notes', notes);
  }, [players, notes]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [saveToLocalStorage]);

  const exportPlayer = (player: PlayerType, format: 'json' | 'text') => {
    const data = format === 'json' ? JSON.stringify(player, null, 2) : `
Name: ${player.name}
Race: ${player.race}
Class: ${player.class}
Level: ${player.level}
HP: ${player.hp}
AC: ${player.ac}
Backstory: ${player.backstory}
Notes: ${player.notes}
Stats:
  STR: ${player.stats.str}
  DEX: ${player.stats.dex}
  CON: ${player.stats.con}
  INT: ${player.stats.int}
  WIS: ${player.stats.wis}
  CHA: ${player.stats.cha}
`;

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${player.name}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onInventoryChange = (playerIndex: number, itemIndex: number, value: string) => {
    setPlayers(prev => {
      const updatedPlayers = [...prev];
      if (!updatedPlayers[playerIndex].inventory) {
        updatedPlayers[playerIndex].inventory = Array(7).fill("");
      }
      updatedPlayers[playerIndex].inventory[itemIndex] = value;
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });
  };

  const exportCampaign = () => {
    const campaignData = {
      notes,
      players,
    };

    const data = JSON.stringify(campaignData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCampaign = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const campaignData = JSON.parse(e.target?.result as string);
        setNotes(campaignData.notes);
        setPlayers(campaignData.players);
        localStorage.setItem('notes', campaignData.notes);
        localStorage.setItem('players', JSON.stringify(campaignData.players));
      } catch (error) {
        console.error('Error importing campaign:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${
      isDarkMode ? 'dark bg-slate-950' : 'bg-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DM Screen
          </h1>
          <SettingsModal 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            exportCampaign={exportCampaign} 
            importCampaign={importCampaign} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NotesSection notes={notes} onNotesChange={handleNotesChange} isDarkMode={isDarkMode} />
          <DiceRoller />
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Players</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className={`w-full mb-6 ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-black'}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Player
                </Button>
              </DialogTrigger>
              <PlayerModal 
                player={newPlayer}
                onInputChange={handleNewPlayerInputChange}
                onSave={handleAddPlayer}
                title="Add New Player"
                isDarkMode={isDarkMode}
              />
            </Dialog>
            <div className="space-y-4">
              {players.map((player, index) => (
                <PlayerCard
                  key={index}
                  player={player}
                  onEdit={() => startEditing(player, index)}
                  onDelete={() => handleRemovePlayer(index)}
                  onExport={(player) => exportPlayer(player, 'json')}
                  onInventoryChange={(itemIndex, value) => onInventoryChange(index, itemIndex, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Player Dialog */}
      {editingPlayer && (
        <Dialog open={!!editingPlayer} onOpenChange={() => setEditingPlayer(null)}>
          <PlayerModal
            player={editingPlayer}
            onInputChange={handleEditInputChange}
            onSave={saveEditing}
            title="Edit Player"
            isDarkMode={isDarkMode}
          />
        </Dialog>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Created by Ras_rap
      </footer>
    </div>
  );
};

export default DMDashboard;