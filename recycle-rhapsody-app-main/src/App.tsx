import "./App.css";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* 🌗 Theme toggle button */}
        <div className="flex justify-end p-4">
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

        {/* ✅ Your pages */}
        <Router />

        {/* ✅ Toaster (fix for Eco Points messages) */}
        <Toaster />
      </main>
    </BrowserRouter>
  );
}

export default App;
