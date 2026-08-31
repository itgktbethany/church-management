"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FontSize = "normal" | "large" | "xlarge";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");

  useEffect(() => {
    const saved = localStorage.getItem("app-font-size") as FontSize | null;
    if (saved) {
      setFontSizeState(saved);
      // Actual font size applying is handled by the inline script to avoid flashing
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const html = document.documentElement;
    if (size === "large") {
      html.style.fontSize = "112.5%"; // 18px
    } else if (size === "xlarge") {
      html.style.fontSize = "125%"; // 20px
    } else {
      html.style.fontSize = "100%"; // 16px
    }
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem("app-font-size", size);
    applyFontSize(size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
}
