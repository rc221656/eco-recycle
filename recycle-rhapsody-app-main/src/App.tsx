import "./App.css";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Recycle, Star, Gift, Users } from "lucide-react";
import { Toaster } from "./components/ui/toaster";
import { motion } from "framer-motion";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300 font-[Inter] relative overflow-hidden">
        
        {/* 🌗 Sticky Navbar */}
        <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-[hsl(var(--background))/0.7] border-b border-[hsl(var(--border))]">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))] flex items-center gap-2">
              <Recycle className="w-6 h-6 text-[hsl(var(--secondary))]" />
              Eco Recycle
            </h1>

            <nav className="hidden md:flex gap-8 text-[hsl(var(--muted-foreground))] font-medium">
              <a href="#features" className="hover:text-[hsl(var(--primary))] transition">Features</a>
              <a href="#stats" className="hover:text-[hsl(var(--primary))] transition">Stats</a>
              <a href="#impact" className="hover:text-[hsl(var(--primary))] transition">Impact</a>
            </nav>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-border bg-muted hover:bg-accent transition-all duration-300 transform hover:scale-105"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </header>

        <div className="pt-24"></div> {/* offset for fixed navbar */}

        {/* 🌿 HERO */}
        <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-green-100 via-white to-green-50 dark:from-[hsl(142_25%_12%)] dark:via-[hsl(142_25%_10%)] dark:to-[hsl(142_25%_8%)] rounded-b-[3rem] border-b border-[hsl(var(--border))] overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-4 text-[hsl(var(--primary))]"
          >
            Turn Waste Into Rewards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl max-w-2xl text-[hsl(var(--muted-foreground))] mb-8"
          >
            Earn points for every eco-friendly action and redeem them for real benefits.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex gap-4"
          >
            <button className="btn-primary">Get Started</button>
            <button className="btn-outline">Learn More</button>
          </motion.div>

          {/* Background gradient blur */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[hsl(var(--primary))]/20 blur-3xl rounded-full" />
        </section>

        {/* 💎 FEATURES */}
        <section id="features" className="section grid md:grid-cols-3 gap-8 border-y border-[hsl(var(--border))] bg-[hsl(var(--accent))]/30">
          {[
            {
              icon: <Recycle className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "AI Recognition",
              text: "Our AI identifies waste types for smarter recycling.",
            },
            {
              icon: <Gift className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "Instant Rewards",
              text: "Earn points for every sustainable action in real time.",
            },
            {
              icon: <Users className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "Community Impact",
              text: "See collective progress and inspire eco-friendly habits.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="card text-center border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              {f.icon}
              <h3 className="text-2xl mt-3 mb-2">{f.title}</h3>
              <p className="text-[hsl(var(--muted-foreground))]">{f.text}</p>
            </motion.div>
          ))}
        </section>

        {/* 📊 STATS SECTION */}
        <section id="stats" className="section text-center bg-gradient-to-r from-[hsl(var(--primary))]/10 to-[hsl(var(--secondary))]/10 border-y border-[hsl(var(--border))]">
          <h2 className="text-4xl font-bold mb-10">Eco Recycle By Numbers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "150+", label: "KG Waste Recycled" },
              { value: "2000+", label: "Reward Points Earned" },
              { value: "500+", label: "Active Users" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-white/50 dark:bg-[hsl(var(--background))]/50 backdrop-blur-md"
              >
                <h3 className="text-5xl font-extrabold text-[hsl(var(--primary))] mb-2">{s.value}</h3>
                <p className="text-[hsl(var(--muted-foreground))] font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🌍 IMPACT */}
        <section className="section text-center bg-[hsl(var(--muted))] border border-[hsl(var(--border))]/50 shadow-inner rounded-3xl mt-16 mx-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            Our Impact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[hsl(var(--muted-foreground))] mb-10"
          >
            Together we’ve recycled{" "}
            <span className="text-[hsl(var(--primary))] font-semibold">
              150 kg
            </span>{" "}
            of waste and counting.
          </motion.p>
          <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
            Join the Movement
          </motion.button>
        </section>

        {/* ⭐ TESTIMONIALS */}
        <section className="section text-center border-t border-[hsl(var(--border))] bg-gradient-to-b from-white to-[hsl(var(--accent))]/30 dark:from-[hsl(142_25%_10%)] dark:to-[hsl(142_25%_8%)]">
          <h2 className="text-4xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Eco Recycle made me love recycling! The rewards are awesome.",
                name: "Aarav Singh",
              },
              {
                quote: "A fun and easy way to be sustainable every day!",
                name: "Riya Sharma",
              },
              {
                quote: "I use it weekly with friends. The leaderboard keeps us hooked!",
                name: "Kunal Mehta",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-6 rounded-2xl bg-card border border-[hsl(var(--border))] shadow-[var(--shadow-card)]"
              >
                <Star className="w-6 h-6 mx-auto text-[hsl(var(--secondary))]" />
                <p className="italic text-[hsl(var(--muted-foreground))] mt-4 mb-3">
                  “{t.quote}”
                </p>
                <h4 className="font-semibold text-[hsl(var(--primary))]">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🌈 FOOTER */}
        <footer className="relative text-center py-10 mt-20 border-t border-transparent before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-[hsl(var(--primary))] before:to-[hsl(var(--secondary))]">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2025 Eco Recycle Reward · Recycle. Earn. Repeat.
          </p>
        </footer>

        {/* router + toast */}
        <Router />
        <Toaster />
      </main>
    </BrowserRouter>
  );
}

export default App;
