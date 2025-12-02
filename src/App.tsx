import "./App.css";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon, Gift, Users, Star } from "lucide-react"; // 👈 Recycle hata diya
import { Toaster } from "./components/ui/toaster";
import { motion } from "framer-motion";

export default function App() {
  const [theme, setTheme] = useState<string>(
    (typeof window !== "undefined" && localStorage.getItem("theme")) || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300 font-[Inter] relative overflow-x-hidden">
        {/* Sticky Navbar */}
        <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-[hsl(var(--background))/0.7] border-b border-[hsl(var(--border))]">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            {/* 👇 Yaha naya logo + text */}
            <h1 className="text-2xl font-extrabold text-[hsl(var(--primary))] flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Eco Recycle Reward logo"
                className="w-20 h-20 object-contain"
              />
              <span>Eco Recycle</span>
            </h1>

            <nav className="hidden md:flex gap-8 text-[hsl(var(--muted-foreground))] font-medium">
              <a href="#features" className="hover:text-[hsl(var(--primary))] transition">
                Features
              </a>
              <a href="#how" className="hover:text-[hsl(var(--primary))] transition">
                How it Works
              </a>
              <a href="#stats" className="hover:text-[hsl(var(--primary))] transition">
                Stats
              </a>
              <a href="#impact" className="hover:text-[hsl(var(--primary))] transition">
                Impact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full border border-border bg-muted hover:bg-accent transition-all duration-300 transform hover:scale-105"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="pt-24" /> {/* offset for navbar */}

        {/* Hero */}
        <section className="relative text-center py-24 px-6 bg-[var(--gradient-soft)] dark:bg-[var(--gradient-soft)] rounded-b-[3rem] border-b border-[hsl(var(--border))] overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-4"
          >
            Turn <span className="text-[hsl(var(--primary))]">Waste</span> Into Rewards
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto text-[hsl(var(--muted-foreground))] mb-8"
          >
            Earn points for everyday eco actions and redeem them for discounts, coupons, or
            donate to green causes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <button className="btn-primary">Get Started</button>
            <button className="btn-outline">Learn More</button>
          </motion.div>

          {/* decorative blobs - show only in light mode */}
          {theme !== "dark" && (
            <>
              <div className="blob blob-green top-10 left-6 w-[420px] h-[240px]" />
              <div className="blob blob-blue -bottom-16 right-8 w-[300px] h-[180px]" />
            </>
          )}
        </section>

        {/* How it works */}
        <section
          id="how"
          className="section bg-[var(--gradient-section)] border-y border-[hsl(var(--border))]"
        >
          <h2 className="text-4xl font-bold text-center mb-10">How it Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Identify", desc: "Upload or photograph waste; AI recognizes the material." },
              { step: "2", title: "Earn Points", desc: "Every correct action earns points instantly." },
              { step: "3", title: "Redeem", desc: "Use points for coupons, discounts or donate." },
            ].map((s) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold flex items-center justify-center text-lg">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-[hsl(var(--muted-foreground))]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="section grid md:grid-cols-3 gap-8 border-y border-[hsl(var(--border))]"
        >
          {[
            {
              icon: <Gift className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "AI Recognition",
              text: "Identify materials quickly and accurately.",
            },
            {
              icon: <Users className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "Instant Rewards",
              text: "Points credited immediately for verified actions.",
            },
            {
              icon: <Star className="w-8 h-8 mx-auto text-[hsl(var(--primary))]" />,
              title: "Community",
              text: "Join challenges, share progress and compete on leaderboards.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              {f.icon}
              <h3 className="text-2xl mt-3 mb-2">{f.title}</h3>
              <p className="text-[hsl(var(--muted-foreground))]">{f.text}</p>
            </motion.div>
          ))}
        </section>

        {/* Stats */}
        <section
          id="stats"
          className="section text-center bg-[hsl(var(--accent))]/10 border-y border-[hsl(var(--border))]"
        >
          <h2 className="text-4xl font-bold mb-10">By The Numbers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: "150+", label: "KG Recycled" },
              { value: "2,000+", label: "Points Earned" },
              { value: "500+", label: "Active Users" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-white/60 dark:bg-[hsl(var(--background))]/50 backdrop-blur-md"
              >
                <h3 className="text-4xl md:text-5xl font-extrabold text-[hsl(var(--primary))] mb-2">
                  {s.value}
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partners / logos */}
        <section className="section">
          <h3 className="text-2xl font-semibold text-center mb-6">Trusted by</h3>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            <div className="px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-white/60 dark:bg-[hsl(var(--background))]/50">
              Amazon
            </div>
            <div className="px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-white/60 dark:bg-[hsl(var(--background))]/50">
              Flipkart
            </div>
            <div className="px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-white/60 dark:bg-[hsl(var(--background))]/50">
              Zomato
            </div>
            <div className="px-6 py-3 rounded-lg border border-[hsl(var(--border))] bg-white/60 dark:bg-[hsl(var(--background))]/50">
              Local Shop
            </div>
          </div>
        </section>

        {/* Impact */}
        <section
          id="impact"
          className="section text-center bg-[hsl(var(--muted))] border border-[hsl(var(--border))]/50 shadow-inner rounded-3xl mt-8 mx-4"
        >
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
            transition={{ delay: 0.15 }}
            className="text-[hsl(var(--muted-foreground))] mb-6"
          >
            We help users turn small everyday actions into measurable environmental impact.
          </motion.p>
          <motion.button whileHover={{ scale: 1.04 }} className="btn-primary">
            Join the Movement
          </motion.button>
        </section>

        {/* Testimonials */}
        <section className="section text-center border-t border-[hsl(var(--border))] bg-gradient-to-b from-white to-[hsl(var(--accent))]/30">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Made recycling fun and rewarding!", name: "Aarav" },
              { quote: "I earn points for small actions—love it.", name: "Riya" },
              { quote: "Perfect for college and home use.", name: "Kunal" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-2xl bg-card border border-[hsl(var(--border))] shadow-[var(--shadow-card)]"
              >
                <Star className="w-6 h-6 mx-auto text-[hsl(var(--secondary))]" />
                <p className="italic mt-4 mb-3 text-[hsl(var(--muted-foreground))]">
                  “{t.quote}”
                </p>
                <h4 className="font-semibold text-[hsl(var(--primary))]">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-6 md:px-10">
          <div className="max-w-7xl mx-auto rounded-2xl p-8 bg-gradient-to-r from-[hsl(var(--primary))]/8 to-[hsl(var(--secondary))]/8 border border-[hsl(var(--border))] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">Ready to make a difference?</h3>
              <p className="text-[hsl(var(--muted-foreground))]">
                Start recycling and earn rewards today — small steps, big impact.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">Get Started</button>
              <button className="btn-outline">Explore Rewards</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative text-center py-10 mt-12 border-t border-transparent before:absolute before:top-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-[hsl(var(--primary))] before:to-[hsl(var(--secondary))]">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2025 Eco Recycle Reward · Recycle. Earn. Repeat.
          </p>
        </footer>

        {/* Router pages & toaster */}
        <Router />
        <Toaster />
      </main>
    </BrowserRouter>
  );
}
