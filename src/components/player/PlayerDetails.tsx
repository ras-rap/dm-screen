import { PlayerType } from "@/components/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const PlayerDetails = ({ player }: { player: PlayerType }) => (
  <div className="space-y-4">
    <div>
      <h4 className="font-medium mb-2">Stats</h4>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {Object.entries(player.stats).map(([stat, value]) => (
          <div key={stat} className="text-center">
            <Badge variant="outline" className="w-full">
              {stat.toUpperCase()}: {value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h4 className="font-medium mb-2">Backstory</h4>
      <Card className="p-4">
        <p className="whitespace-pre-wrap">{player.backstory || "No backstory available."}</p>
      </Card>
    </div>
    <div>
      <h4 className="font-medium mb-2">Notes</h4>
      <Card className="p-4">
        <p className="whitespace-pre-wrap">{player.notes || "No notes available."}</p>
      </Card>
    </div>
  </div>
);