import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DiceButton = ({ sides, onRoll }: { sides: number; onRoll: (sides: number) => void }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          className="h-16 w-16 rounded-full text-lg font-bold relative hover:scale-105 transition-transform border-2"
          onClick={() => onRoll(sides)}
        >
          d{sides}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Roll a {sides}-sided die</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const DiceRoller = () => {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceHistory, setDiceHistory] = useState<string[]>([]);

  const rollDice = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setDiceResult(result);
    setDiceHistory(prev => [...prev, `d${sides}: ${result}`].slice(-5));
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Dice Roller</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 place-items-center mb-6">
          {[2, 4, 6, 8, 10, 12, 20, 100].map(sides => (
            <DiceButton key={sides} sides={sides} onRoll={rollDice} />
          ))}
        </div>
        
        {diceResult && (
          <div className="text-center mb-4">
            <Badge variant="secondary" className="text-2xl px-4 py-2">
              {diceResult}
            </Badge>
          </div>
        )}
        
        {diceHistory.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="font-semibold mb-2">History</h3>
              <div className="flex flex-wrap gap-2">
                {diceHistory.map((roll, i) => (
                  <Badge key={i} variant="outline">{roll}</Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};