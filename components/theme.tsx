import { createContext, useContext, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'somber';

type ThemeColors = {
  screenBg: string;
  surfaceBg: string;
  surfaceBorder: string;
  text: string;
  mutedText: string;
  accent: string;
  accentActive: string;
  accentText: string;
  icon: string;
  chatUserBubble: string;
  chatUserText: string;
  chatAssistantBubble: string;
  chatAssistantText: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  divider: string;
  arrowBubbleBg: string;
  arrowBubbleBorder: string;
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleMode: () => void;
};

const lightColors: ThemeColors = {
  screenBg: '#f4f5f7',
  surfaceBg: '#e4e4e7',
  surfaceBorder: '#a1a1aa',
  text: '#0f172a',
  mutedText: '#64748b',
  accent: '#6336f7',
  accentActive: '#7348ff',
  accentText: '#ffffff',
  icon: '#111827',
  chatUserBubble: '#0f172a',
  chatUserText: '#ffffff',
  chatAssistantBubble: '#e2e8f0',
  chatAssistantText: '#0f172a',
  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputText: '#0f172a',
  inputPlaceholder: '#94a3b8',
  divider: '#dbe2ea',
  arrowBubbleBg: '#f4f4f5',
  arrowBubbleBorder: '#a1a1aa',
};

const somberColors: ThemeColors = {
  screenBg: '#0b0f14',
  surfaceBg: '#171b25',
  surfaceBorder: '#2a3340',
  text: '#e5e7eb',
  mutedText: '#9aa4b2',
  accent: '#3f2a86',
  accentActive: '#4d33a3',
  accentText: '#f3f4f6',
  icon: '#e5e7eb',
  chatUserBubble: '#1f2937',
  chatUserText: '#f9fafb',
  chatAssistantBubble: '#101720',
  chatAssistantText: '#e5e7eb',
  inputBg: '#121826',
  inputBorder: '#2a3340',
  inputText: '#e5e7eb',
  inputPlaceholder: '#7b8696',
  divider: '#1f2833',
  arrowBubbleBg: '#0f141d',
  arrowBubbleBorder: '#2a3340',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo(
    () => ({
      mode,
      colors: mode === 'somber' ? somberColors : lightColors,
      toggleMode: () => setMode((prev) => (prev === 'light' ? 'somber' : 'light')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
