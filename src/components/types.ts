export interface PlayerType {
  name: string;
  race: string;
  class: string;
  level: string;
  hp: string;
  ac: string;
  backstory: string;
  notes: string;
  stats: {
    str: string;
    dex: string;
    con: string;
    int: string;
    wis: string;
    cha: string;
  };
  inventory: string[]; // Add this line
}

export const emptyPlayer: PlayerType = {
  name: "",
  race: "",
  class: "",
  level: "",
  hp: "",
  ac: "",
  backstory: "",
  notes: "",
  stats: {
    str: "",
    dex: "",
    con: "",
    int: "",
    wis: "",
    cha: "",
  },
  inventory: Array(7).fill(""), // Initialize with 7 empty slots
};

export const importPlayerFromFile = (file: File): Promise<PlayerType> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const player = JSON.parse(e.target?.result as string);
        resolve(player);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};