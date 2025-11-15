// === Theme restore: apply saved theme (dark/light) before React mounts ===
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// === Observe theme changes dynamically ===
window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    if (event.newValue === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);
