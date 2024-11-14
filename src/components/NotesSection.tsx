import React from 'react';
import { Save } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const NotesSection = ({
  notes,
  onNotesChange
}: {
  notes: string;
  onNotesChange: (value: string) => void;
}) => (
  <Card className="border-2">
    <CardHeader>
      <CardTitle>Campaign Notes</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="min-h-[200px]"
        placeholder="Write your campaign notes here..."
      />
      <Button className="w-full">
        <Save className="mr-2 h-4 w-4" />
        Save Notes
      </Button>
    </CardContent>
  </Card>
);