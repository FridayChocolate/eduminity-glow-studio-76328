import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FontProvider } from "@/hooks/useFont";

createRoot(document.getElementById("root")!).render(
  <FontProvider>
    <App />
  </FontProvider>
);
