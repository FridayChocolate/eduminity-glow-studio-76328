import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FontStyle = 
  | "default" 
  | "orbitron" 
  | "rajdhani" 
  | "exo2" 
  | "audiowide"
  | "playfair" 
  | "merriweather" 
  | "crimson"
  | "space-grotesk"
  | "jetbrains";

interface FontOption {
  id: FontStyle;
  name: string;
  family: string;
  category: "sci-fi" | "classic" | "modern";
  preview: string;
}

export const fontOptions: FontOption[] = [
  { id: "default", name: "Inter", family: "'Inter', sans-serif", category: "modern", preview: "Clean & Modern" },
  { id: "orbitron", name: "Orbitron", family: "'Orbitron', sans-serif", category: "sci-fi", preview: "FUTURISTIC" },
  { id: "rajdhani", name: "Rajdhani", family: "'Rajdhani', sans-serif", category: "sci-fi", preview: "Tech Style" },
  { id: "exo2", name: "Exo 2", family: "'Exo 2', sans-serif", category: "sci-fi", preview: "Space Age" },
  { id: "audiowide", name: "Audiowide", family: "'Audiowide', sans-serif", category: "sci-fi", preview: "RETRO SCI-FI" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif", category: "classic", preview: "Elegant Serif" },
  { id: "merriweather", name: "Merriweather", family: "'Merriweather', serif", category: "classic", preview: "Traditional" },
  { id: "crimson", name: "Crimson Pro", family: "'Crimson Pro', serif", category: "classic", preview: "Literary Style" },
  { id: "space-grotesk", name: "Space Grotesk", family: "'Space Grotesk', sans-serif", category: "modern", preview: "Geometric" },
  { id: "jetbrains", name: "JetBrains Mono", family: "'JetBrains Mono', monospace", category: "modern", preview: "Code Style" },
];

interface FontContextType {
  font: FontStyle;
  setFont: (font: FontStyle) => void;
  currentFontFamily: string;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFontState] = useState<FontStyle>(() => {
    const stored = localStorage.getItem("eduminity-font");
    return (stored as FontStyle) || "default";
  });

  const setFont = (newFont: FontStyle) => {
    setFontState(newFont);
    localStorage.setItem("eduminity-font", newFont);
  };

  const currentFontFamily = fontOptions.find(f => f.id === font)?.family || fontOptions[0].family;

  useEffect(() => {
    // Apply font to CSS variable and html element for global inheritance
    document.documentElement.style.setProperty("--font-family", currentFontFamily);
    document.documentElement.style.fontFamily = currentFontFamily;
    document.body.style.fontFamily = currentFontFamily;
    
    // Force all elements to inherit the font, except preview elements
    const style = document.getElementById('dynamic-font-style') || document.createElement('style');
    style.id = 'dynamic-font-style';
    style.textContent = `
      *:not([data-font-preview]):not([data-font-preview] *) { font-family: ${currentFontFamily} !important; }
      code, pre, .font-mono { font-family: 'JetBrains Mono', monospace !important; }
    `;
    if (!document.getElementById('dynamic-font-style')) {
      document.head.appendChild(style);
    }
  }, [currentFontFamily]);

  return (
    <FontContext.Provider value={{ font, setFont, currentFontFamily }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
};
