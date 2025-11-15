import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import Scanner from "@/components/Scanner";
import PointsDisplay from "@/components/PointsDisplay";
import Leaderboard from "@/components/Leaderboard";
import Rewards from "@/components/Rewards";
import Quotes from "@/components/Quotes";

const Index = () => {
  const [points, setPoints] = useState(0);
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleScanClick = () => {
    scannerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints((prev) => prev + earnedPoints);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onScanClick={handleScanClick} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PointsDisplay points={points} />
      </div>

      <div ref={scannerRef}>
        <Scanner onPointsEarned={handlePointsEarned} />
      </div>

      <Leaderboard />
      <Rewards />
      <Quotes />

      <footer className="bg-card border-t py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
             2025 EcoRewards. Recycle your waste and get some rewards.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
