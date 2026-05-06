export const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#a5b4fc',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  background: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#16213e',
  card: '#1e1e35',
  cardLight: '#252542',

  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#475569',

  border: '#2d2d4e',
  borderLight: '#3d3d6e',

  priorityHigh: '#ef4444',
  priorityMedium: '#f59e0b',
  priorityLow: '#10b981',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const PRIORITY_CONFIG = {
  high: { color: COLORS.priorityHigh, label: 'High', icon: 'arrow-up-circle' },
  medium: { color: COLORS.priorityMedium, label: 'Medium', icon: 'remove-circle-outline' },
  low: { color: COLORS.priorityLow, label: 'Low', icon: 'arrow-down-circle' },
};

export const CATEGORY_ICONS = [
  'folder', 'briefcase', 'heart', 'cart', 'home', 'school',
  'fitness', 'restaurant', 'airplane', 'musical-notes',
  'book', 'code-slash', 'star', 'flag', 'gift',
];

export const CATEGORY_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];