/**
 * GescoPay — Responsive Design System
 * Fluid layouts, adaptive grids, flexible typography for all screen sizes.
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Breakpoints ───────────────────────────────────────────────────────────────
export const BP = {
  xs: 0,      // < 360px  (small phones)
  sm: 360,    // ≥ 360px  (normal phones)
  md: 768,    // ≥ 768px  (tablets)
  lg: 1024,   // ≥ 1024px (laptops / large tablets)
  xl: 1280,   // ≥ 1280px (desktop)
} as const;

export const isPhone  = SCREEN_W < BP.md;
export const isTablet = SCREEN_W >= BP.md && SCREEN_W < BP.lg;
export const isDesktop = SCREEN_W >= BP.lg;
export const isWeb = Platform.OS === 'web';
export const isSmallPhone = SCREEN_W < 375;

// ─── Responsive value helper ───────────────────────────────────────────────────
/** Returns a value scaled to the current screen width. Base is 390px (iPhone 14). */
export function rw(size: number): number {
  const scale = SCREEN_W / 390;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}

/** Returns a value capped between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Responsive font size: scales smoothly, capped for readability. */
export function rf(size: number, min?: number, max?: number): number {
  const scaled = rw(size);
  return clamp(scaled, min ?? size * 0.75, max ?? size * 1.35);
}

// ─── Layout constants ─────────────────────────────────────────────────────────
/** Screen width. */
export const SW = SCREEN_W;

/** Horizontal padding: 16px phone, 24px tablet, 40px desktop. */
export const PADDING_H = isDesktop ? 40 : isTablet ? 24 : 20;

/** Card width: full-bleed on phone, half on tablet, constrained on desktop. */
export const CARD_W = isDesktop
  ? Math.min(SCREEN_W * 0.4, 480)
  : isTablet
  ? (SCREEN_W - PADDING_H * 2 - 16) / 2
  : SCREEN_W - PADDING_H * 2;

/** Maximum content width (centers on wide screens). */
export const MAX_W = 600;

/** Content container style for wide-screen centering. */
export const contentContainer = {
  width: '100%' as const,
  maxWidth: MAX_W,
  alignSelf: 'center' as const,
  paddingHorizontal: PADDING_H,
};

// ─── Grid helpers ──────────────────────────────────────────────────────────────
/** Number of grid columns. */
export function gridCols(phone: number, tablet?: number, desktop?: number): number {
  if (isDesktop) return desktop ?? tablet ?? phone;
  if (isTablet) return tablet ?? phone;
  return phone;
}

/** Width of a single grid column with gap. */
export function colWidth(cols: number, gap = 12): number {
  return (SCREEN_W - PADDING_H * 2 - gap * (cols - 1)) / cols;
}

// ─── Typography scale ──────────────────────────────────────────────────────────
export const TS = {
  /** Headline — balance, large amounts */
  hero:  rf(48, 36, 64),
  /** Page title */
  h1:    rf(24, 20, 32),
  /** Section title */
  h2:    rf(18, 16, 24),
  /** Card title */
  h3:    rf(16, 14, 20),
  /** Body text */
  body:  rf(14, 13, 16),
  /** Caption / label */
  sm:    rf(12, 11, 14),
  /** Badge / micro label */
  xs:    rf(11, 10, 12),
} as const;

// ─── Touch targets ─────────────────────────────────────────────────────────────
/** Minimum touch target size (48×48 as per WCAG / Apple HIG). */
export const TOUCH_MIN = 48;
export const TOUCH_SM  = 40;
export const TOUCH_LG  = 56;
