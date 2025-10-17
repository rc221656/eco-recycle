import { Button } from "@/components/ui/button";
import { Leaf, Sparkles } from "lucide-react";

interface HeroProps {
  onScanClick: () => void;
}

const Hero = ({ onScanClick }: HeroProps) => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Earn Eco Points</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Turn Your{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Recycling
          </span>
          <br />
          Into Rewards
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Scan recyclable items, earn points, and redeem amazing rewards. 
          Join thousands making a difference for our planet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            onClick={onScanClick}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Scanning
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
