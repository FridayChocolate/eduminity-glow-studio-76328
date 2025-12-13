import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { FontProvider } from "@/hooks/useFont";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <FontProvider>
      <App />
    </FontProvider>
  </HelmetProvider>
);
