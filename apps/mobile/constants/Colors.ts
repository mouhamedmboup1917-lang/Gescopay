export const Colors = {
  // Primary Teal
  primary: '#00A8A8',
  primaryLight: '#33BBBB',
  primaryDark: '#007575',
  primaryBg: 'rgba(0, 168, 168, 0.1)',

  // Dark Navy
  navy: '#0A2342',
  navyLight: '#143567',
  navyDark: '#060F1C',

  // Orange Accent
  orange: '#FF7A00',
  orangeLight: '#FF9933',
  orangeDark: '#CC6200',
  orangeBg: 'rgba(255, 122, 0, 0.1)',

  // Semantic
  success: '#22C55E',
  successBg: 'rgba(34, 197, 94, 0.1)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  info: '#3B82F6',
  infoBg: 'rgba(59, 130, 246, 0.1)',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  muted: '#94A3B8',
  mutedDark: '#64748B',
  border: '#E2E8F0',
  borderDark: '#CBD5E1',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Dark Mode
  dark: {
    background: '#0A0F1C',
    surface: '#111827',
    surfaceSecondary: '#1F2937',
    border: '#1F2937',
    borderDark: '#374151',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },

  // Gradients (as arrays for LinearGradient)
  gradients: {
    primary: ['#00A8A8', '#007575'],
    navy: ['#0A2342', '#143567'],
    navyPrimary: ['#0A2342', '#00A8A8'],
    orange: ['#FF7A00', '#FF9933'],
    card: ['#143567', '#0A2342'],
    cardGold: ['#FF7A00', '#0A2342'],
    success: ['#22C55E', '#16A34A'],
  },

  // Wallet Brand Colors
  wallets: {
    wave: '#1B6FE4',
    orangeMoney: '#FF6600',
    freeMoney: '#00B050',
    qmoney: '#E30613',
    africellMoney: '#FF0000',
    airtelMoney: '#EC1C24',
    mtnMomo: '#FFCC00',
  },
} as const;

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'Inter',
    medium: 'Inter',
    semiBold: 'Inter',
    bold: 'Inter',
  },

  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Font sizes
  sizes: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  primary: {
    shadowColor: '#00A8A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    shadowColor: '#0A2342',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;
