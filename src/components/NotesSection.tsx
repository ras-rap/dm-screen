import React from 'react';
import { Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const NotesSection = ({
  notes,
  onNotesChange,
  isDarkMode
}: {
  notes: string;
  onNotesChange: (value: string) => void;
  isDarkMode: boolean;
}) => (
  <Card className="border-2">
    <CardHeader>
      <CardTitle>Campaign Notes</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className={`min-h-[200px] ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
        placeholder="Write your campaign notes here..."
      />
      <Button className={`w-full ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-black'}`}>
        <Save className="mr-2 h-4 w-4" />
        Save Notes
      </Button>
    </CardContent>
  </Card>
);