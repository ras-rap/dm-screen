import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Sun, Moon, Upload, Download, Settings } from 'lucide-react';

interface SettingsModalProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  exportCampaign: () => void;
  importCampaign: (file: File) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isDarkMode, setIsDarkMode, exportCampaign, importCampaign }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-2 border-slate-700 hover:border-slate-600 hover:bg-slate-800">
          <Settings className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-black'}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-md ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-black'}`}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
          >
            {isDarkMode ? 
              <Sun className="h-5 w-5 text-yellow-400" /> : 
              <Moon className="h-5 w-5" />
            }
            Toggle Dark Mode
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={exportCampaign}
            className={`w-full ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
          >
            <Download className="h-5 w-5" />
            Export Campaign
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => document.getElementById('import-campaign-input')?.click()}
            className={`w-full ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
          >
            <Upload className="h-5 w-5" />
            Import Campaign
          </Button>
          <input
            id="import-campaign-input"
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                importCampaign(file);
              }
            }}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;