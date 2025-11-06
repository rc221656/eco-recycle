import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coffee, ShoppingBag, DollarSign } from "lucide-react";

const Rewards = () => {
  const rewards = [
    {
      id: 1,
      name: "Café Voucher",
      points: 500,
      icon: Coffee,
      description: "$5 off at partner cafés",
      color: "from-amber-500 to-orange-500"
    },
    {
      id: 2,
      name: "Amazon Gift Card",
      points: 1000,
      icon: ShoppingBag,
      description: "$10 Amazon credit",
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: 3,
      name: "Flipkart Voucher",
      points: 1000,
      icon: Gift,
      description: "$10 shopping credit",
      color: "from-yellow-500 to-amber-500"
    },
    {
      id: 4,
      name: "Cash Back",
      points: 2000,
      icon: DollarSign,
      description: "$20 direct cashback",
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Redeem Your Rewards</h2>
          <p className="text-muted-foreground text-lg">
            Convert your eco points into exciting rewards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <Card key={reward.id} className="p-6 hover:shadow-xl transition-all group">
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">{reward.points}</span>
                      <span className="text-sm text-muted-foreground">points</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Redeem
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
