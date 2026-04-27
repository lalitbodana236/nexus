export type AppTheme = 'dark' | 'light';

export interface ThemeDefinition {
  id: AppTheme;
  label: string;
  icon: string;
  bodyClass: string;
}

export const APP_THEMES: Record<AppTheme, ThemeDefinition> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    icon: '☽',
    bodyClass: 'theme-dark'
  },
  light: {
    id: 'light',
    label: 'Light',
    icon: '☼',
    bodyClass: 'theme-light'
  }
};
