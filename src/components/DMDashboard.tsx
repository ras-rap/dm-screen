import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import { PlayerType, emptyPlayer, importPlayerFromFile } from './types';
import { DiceRoller } from '@/components/DiceRoller';
import { NotesSection } from '@/components/NotesSection';
import { PlayerCard } from '@/components/player/PlayerCard';
import { PlayerModal } from '@/components/player/PlayerModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const DMDashboard = () => {
  const [notes, setNotes] = useState("");
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const handleInputChange = (index: number, field: string, value: string) => {
    setPlayers(prev => {
      const updatedPlayers = [...prev];
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'inventory') {
          if (!updatedPlayers[index].inventory) {
            updatedPlayers[index].inventory = Array(7).fill("");
          }
          updatedPlayers[index].inventory[parseInt(child)] = value;
        } else {
          if (!updatedPlayers[index][parent]) {
            updatedPlayers[index][parent] = {};
          }
          updatedPlayers[index][parent][child] = value;
        }
      } else {
        updatedPlayers[index][field] = value;
      }
      localStorage.setItem('players', JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });
  };

  const handleEditInputChange = (field: string, value: string) => {
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
              ...prev![parent as keyof PlayerType],
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

  const handleNewPlayerInputChange = (field: string, value: string) => {
    setNewPlayer(prev => {
      const updatedPlayer = { ...prev };
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!updatedPlayer[parent]) {
          updatedPlayer[parent] = {};
        }
        updatedPlayer[parent][child] = value;
      } else {
        updatedPlayer[field] = value;
      }
      return updatedPlayer;
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

  const saveToLocalStorage = () => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('notes', notes);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage();
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(interval);
  }, [players, notes]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const exportPlayers = (format: 'json' | 'text') => {
    const data = format === 'json' ? JSON.stringify(players, null, 2) : players.map(player => `
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
`).join('\n\n');

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `players.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const importPlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (file.type === 'application/json') {
        setPlayers(JSON.parse(content));
      } else {
        const importedPlayers = content.split('\n\n').map(playerText => {
          const player: PlayerType = { ...emptyPlayer };
          playerText.split('\n').forEach(line => {
            const [key, value] = line.split(': ').map(s => s.trim());
            if (key && value) {
              if (key.startsWith('Stats')) {
                const statKey = key.split(' ')[1].toLowerCase();
                player.stats[statKey as keyof PlayerType['stats']] = value;
              } else {
                player[key.toLowerCase() as keyof PlayerType] = value;
              }
            }
          });
          return player;
        });
        setPlayers(importedPlayers);
      }
      localStorage.setItem('players', JSON.stringify(players));
    };
    reader.readAsText(file);
  };

  const handleImportNewPlayer = (file: File) => {
    importPlayerFromFile(file).then((importedPlayer) => {
      setPlayers(prev => [...prev, importedPlayer]);
      localStorage.setItem('players', JSON.stringify([...players, importedPlayer]));
    }).catch(console.error);
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

  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${
      isDarkMode ? 'dark bg-slate-950' : 'bg-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DM Screen
          </h1>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="border-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800"
          >
            {isDarkMode ? 
              <Sun className="h-5 w-5 text-yellow-400" /> : 
              <Moon className="h-5 w-5" />
            }
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NotesSection notes={notes} onNotesChange={handleNotesChange} />
          <DiceRoller />
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Players</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mb-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Player
                </Button>
              </DialogTrigger>
              <PlayerModal 
                player={newPlayer}
                onInputChange={handleNewPlayerInputChange}
                onSave={handleAddPlayer}
                title="Add New Player"
                isDarkMode={isDarkMode} // Pass the isDarkMode prop
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

            {/* Keep the import/export section */}
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
          />
        </Dialog>
      )}
    </div>
  );
};

export default DMDashboard;