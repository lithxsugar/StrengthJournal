import React, { createContext, useContext, useState, useEffect } from 'react';

type FontFamily = 'sans' | 'serif' | 'mono';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    const saved = localStorage.getItem('app_font_family');
    return (saved as FontFamily) || 'serif';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('app_font_size');
    return (saved as FontSize) || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('app_font_family', fontFamily);
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('app_font_size', fontSize);
    document.documentElement.setAttribute('data-size', fontSize);
  }, [fontSize]);

  return (
    <SettingsContext.Provider value={{ fontFamily, setFontFamily, fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
