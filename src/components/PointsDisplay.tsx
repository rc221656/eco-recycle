import { Card } from "@/components/ui/card";
import { Coins, TrendingUp } from "lucide-react";

interface PointsDisplayProps {
  points: number;
}

const PointsDisplay = ({ points }: PointsDisplayProps) => {
  return (
    <Card className="sticky top-4 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Eco Points</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{points}</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PointsDisplay;
