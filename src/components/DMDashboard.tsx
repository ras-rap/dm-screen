import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { PlayerType, emptyPlayer } from './types';
import { DiceRoller } from '@/components/DiceRoller';
import { NotesSection } from '@/components/NotesSection';
import { PlayerCard } from '@/components/player/PlayerCard';
import { PlayerModal } from '@/components/player/PlayerModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import SettingsModal from '@/components/SettingsModal';
import { Tab } from '@headlessui/react';

const DMDashboard: React.FC = () => {
  const [notes, setNotes] = useState<string>("");
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [npcs, setNpcs] = useState<PlayerType[]>([]);
  const [enemies, setEnemies] = useState<PlayerType[]>([]);
  const [misc, setMisc] = useState<PlayerType[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [editingPlayer, setEditingPlayer] = useState<PlayerType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPlayer, setNewPlayer] = useState<PlayerType>(emptyPlayer);
  const [currentTab, setCurrentTab] = useState<string>('Players');

  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    const savedNpcs = localStorage.getItem('npcs');
    if (savedNpcs) {
      setNpcs(JSON.parse(savedNpcs));
    }
    const savedEnemies = localStorage.getItem('enemies');
    if (savedEnemies) {
      setEnemies(JSON.parse(savedEnemies));
    }
    const savedMisc = localStorage.getItem('misc');
    if (savedMisc) {
      setMisc(JSON.parse(savedMisc));
    }
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleAddEntity = (entityType: string) => {
    const entitySetter = {
      'Players': setPlayers,
      'NPCs': setNpcs,
      'Enemies': setEnemies,
      'Misc': setMisc,
    }[entityType];

    const entityState = {
      'Players': players,
      'NPCs': npcs,
      'Enemies': enemies,
      'Misc': misc,
    }[entityType];

    if (newPlayer.name) {
      const newEntity = { ...newPlayer, inventory: ["", "", "", "", "", "", ""] };
      if (entitySetter) {
        entitySetter((prev: PlayerType[]) => [...prev, newEntity]);
      }
      setNewPlayer(emptyPlayer);
      if (entityState) {
        localStorage.setItem(entityType.toLowerCase(), JSON.stringify([...entityState, newEntity]));
      }
    }
  };

  const handleRemoveEntity = (entityType: string, index: number) => {
    const entitySetter = {
      'Players': setPlayers,
      'NPCs': setNpcs,
      'Enemies': setEnemies,
      'Misc': setMisc,
    }[entityType];

    // const entityState = {
    //   'Players': players,
    //   'NPCs': npcs,
    //   'Enemies': enemies,
    //   'Misc': misc,
    // }[entityType];

    if (entitySetter) {
      entitySetter((prev: PlayerType[]) => {
        const updatedEntities = prev.filter((_, i) => i !== index);
        localStorage.setItem(entityType.toLowerCase(), JSON.stringify(updatedEntities));
        return updatedEntities;
      });
    }
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

  const saveEditing = (entityType: string) => {
    const entitySetter = {
      'Players': setPlayers,
      'NPCs': setNpcs,
      'Enemies': setEnemies,
      'Misc': setMisc,
    }[entityType];

    if (editingPlayer && editingIndex !== null && entitySetter) {
      entitySetter((prev: PlayerType[]) => prev.map((p, i) => 
        i === editingIndex ? editingPlayer : p
      ));
      setEditingPlayer(null);
      setEditingIndex(null);
    }
  };

  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('npcs', JSON.stringify(npcs));
    localStorage.setItem('enemies', JSON.stringify(enemies));
    localStorage.setItem('misc', JSON.stringify(misc));
    localStorage.setItem('notes', notes);
  }, [players, npcs, enemies, misc, notes]);

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
      npcs,
      enemies,
      misc,
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
        const initializeInventory = (entity: PlayerType) => ({
          ...entity,
          inventory: entity.inventory.length ? entity.inventory : ["", "", "", "", "", "", ""]
        });
        setNotes(campaignData.notes);
        setPlayers(campaignData.players.map(initializeInventory));
        setNpcs(campaignData.npcs.map(initializeInventory));
        setEnemies(campaignData.enemies.map(initializeInventory));
        setMisc(campaignData.misc.map(initializeInventory));
        localStorage.setItem('notes', campaignData.notes);
        localStorage.setItem('players', JSON.stringify(campaignData.players.map(initializeInventory)));
        localStorage.setItem('npcs', JSON.stringify(campaignData.npcs.map(initializeInventory)));
        localStorage.setItem('enemies', JSON.stringify(campaignData.enemies.map(initializeInventory)));
        localStorage.setItem('misc', JSON.stringify(campaignData.misc.map(initializeInventory)));
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
            <CardTitle>Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tab.Group>
              <Tab.List className="flex space-x-1 bg-blue-900/20 p-1">
                {['Players', 'NPCs', 'Enemies', 'Misc'].map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg
                      ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
                    }
                    onClick={() => setCurrentTab(category)}
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {['Players', 'NPCs', 'Enemies', 'Misc'].map((category) => (
                  <Tab.Panel key={category}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={`w-full mb-6 ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-black'}`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add New {category.slice(0, -1)}
                        </Button>
                      </DialogTrigger>
                      <PlayerModal 
                        player={newPlayer}
                        onInputChange={(field, value) => handleNewPlayerInputChange(field, value)}
                        onSave={() => handleAddEntity(category)}
                        title={`Add New ${category.slice(0, -1)}`}
                        isDarkMode={isDarkMode}
                      />
                    </Dialog>
                    <div className="space-y-4">
                      {({
                        'Players': players,
                        'NPCs': npcs,
                        'Enemies': enemies,
                        'Misc': misc,
                      }[category] as PlayerType[]).map((player, index) => (
                        <PlayerCard
                          key={index}
                          player={player}
                          onEdit={() => startEditing(player, index)}
                          onDelete={() => handleRemoveEntity(category, index)}
                          onExport={(player) => exportPlayer(player, 'json')}
                          onInventoryChange={(itemIndex, value) => onInventoryChange(index, itemIndex, value)}
                        />
                      ))}
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </CardContent>
        </Card>
      </div>

      {/* Edit Player Dialog */}
      {editingPlayer && (
        <Dialog open={!!editingPlayer} onOpenChange={() => setEditingPlayer(null)}>
          <PlayerModal
            player={editingPlayer}
            onInputChange={handleEditInputChange}
            onSave={() => saveEditing(currentTab)}
            title="Edit Player"
            isDarkMode={isDarkMode}
          />
        </Dialog>
      )}
    </div>
  );
};

export default DMDashboard;