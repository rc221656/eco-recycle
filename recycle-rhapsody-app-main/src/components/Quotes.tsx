import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

const Quotes = () => {
  const quotes = [
    {
      text: "The greatest threat to our planet is the belief that someone else will save it.",
      author: "Robert Swan"
    },
    {
      text: "We don't need a handful of people doing zero waste perfectly. We need millions of people doing it imperfectly.",
      author: "Anne Marie Bonneau"
    },
    {
      text: "The Earth is what we all have in common.",
      author: "Wendell Berry"
    },
    {
      text: "Every piece of plastic ever made still exists somewhere on Earth.",
      author: "Environmental Fact"
    },
    {
      text: "Recycling is not just a good idea, it's the law of nature.",
      author: "Unknown"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div className="py-16 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Motivated</h2>
          <p className="text-muted-foreground text-lg">
            Words of wisdom for our eco journey
          </p>
        </div>

        <Card className="p-12 relative overflow-hidden">
          <Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10" />
          <Quote className="absolute bottom-8 right-8 w-16 h-16 text-primary/10 rotate-180" />
          
          <div className="relative z-10 text-center space-y-6 animate-fade-in" key={currentQuote}>
            <p className="text-2xl md:text-3xl font-medium italic leading-relaxed">
              "{quotes[currentQuote].text}"
            </p>
            <p className="text-lg text-muted-foreground">
              — {quotes[currentQuote].author}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentQuote 
                    ? "bg-primary w-8" 
                    : "bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quotes;
