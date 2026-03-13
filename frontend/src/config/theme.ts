export const themeConfig = {
  defaultTheme: 'system' as const,
  storageKey: 'furnish-vista-theme',
  themes: ['light', 'dark', 'system'] as const,
} as const;

export type Theme = (typeof themeConfig.themes)[number];
