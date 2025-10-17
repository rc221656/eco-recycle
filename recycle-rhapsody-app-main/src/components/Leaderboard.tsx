import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
}

const Leaderboard = () => {
  const leaders: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Green", points: 2840 },
    { rank: 2, name: "Alex Rivers", points: 2650 },
    { rank: 3, name: "Maya Earth", points: 2420 },
    { rank: 4, name: "John Forest", points: 2180 },
    { rank: 5, name: "Emma Ocean", points: 1950 },
  ];

  const getMedalColor = (rank: number) => {
    switch(rank) {
      case 1: return "text-[hsl(var(--gold))]";
      case 2: return "text-[hsl(var(--silver))]";
      case 3: return "text-[hsl(var(--bronze))]";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="py-16 px-4 bg-accent/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Eco Warriors</h2>
          <p className="text-muted-foreground text-lg">
            Leading the way in sustainable recycling
          </p>
        </div>

        <Card className="p-2">
          <div className="divide-y divide-border">
            {leaders.map((leader) => (
              <div
                key={leader.rank}
                className="p-6 flex items-center gap-6 hover:bg-accent/50 transition-colors"
              >
                <div className={`text-4xl font-bold w-12 text-center ${getMedalColor(leader.rank)}`}>
                  {leader.rank <= 3 ? (
                    <Medal className="w-10 h-10 mx-auto" />
                  ) : (
                    leader.rank
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{leader.name}</h3>
                  <p className="text-muted-foreground">Eco Warrior</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {leader.points.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
