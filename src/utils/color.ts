/**
 * Color utilities to compute derived shades and WCAG AA 4.5:1 compliant contrast text colors.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHex(hex: string): Rgb {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 30, g: 58, b: 36 };
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 30, g: 58, b: 36 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toPadded = (v: number) => clamp(v).toString(16).padStart(2, '0');
  return `#${toPadded(r)}${toPadded(g)}${toPadded(b)}`;
}

export function mixRgb(c1: Rgb, c2: Rgb, weight: number): Rgb {
  const w = Math.max(0, Math.min(1, weight));
  return {
    r: c1.r * (1 - w) + c2.r * w,
    g: c1.g * (1 - w) + c2.g * w,
    b: c1.b * (1 - w) + c2.b * w,
  };
}

export function darken(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  const black: Rgb = { r: 0, g: 0, b: 0 };
  return toHex(mixRgb(rgb, black, amount));
}

export function lighten(hex: string, amount: number): string {
  const rgb = parseHex(hex);
  const white: Rgb = { r: 255, g: 255, b: 255 };
  return toHex(mixRgb(rgb, white, amount));
}

// Relative luminance based on sRGB
export function getRelativeLuminance({ r, g, b }: Rgb): number {
  const srgb = [r / 255, g / 255, b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

// Compute contrast ratio between two luminance values
export function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Returns a high contrast text color (either dark #111827 or light #ffffff) achieving >= 4.5:1
export function getReadableTextColor(backgroundHex: string): string {
  const bgRgb = parseHex(backgroundHex);
  const bgLum = getRelativeLuminance(bgRgb);
  const darkText: Rgb = { r: 17, g: 24, b: 39 }; // #111827
  const lightText: Rgb = { r: 255, g: 255, b: 255 }; // #ffffff

  const darkLum = getRelativeLuminance(darkText);
  const lightLum = getRelativeLuminance(lightText);

  const darkRatio = getContrastRatio(bgLum, darkLum);
  const lightRatio = getContrastRatio(bgLum, lightLum);

  return darkRatio >= lightRatio ? '#111827' : '#ffffff';
}

export function applyBrandCssVariables(brand: {
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  fontStack?: string;
  radius?: number;
  density?: 'compact' | 'normal' | 'airy';
}) {
  if (typeof document === 'undefined') return;

  const primary = brand.primaryColor || '#1e3820';
  const secondary = brand.secondaryColor || darken(primary, 0.3);
  const accent = brand.accentColor || '#88e038';
  const radius = typeof brand.radius === 'number' ? brand.radius : 16;
  const density = brand.density || 'normal';

  const spaceUnit = density === 'compact' ? '6px' : density === 'airy' ? '10px' : '8px';
  const fontBody =
    brand.fontStack ||
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const accentText = getReadableTextColor(accent);
  const accentHover = lighten(accent, 0.15);
  const primaryText = getReadableTextColor(primary);
  const mintTint = lighten(primary, 0.94);
  const headDark = lighten(accent, 0.25);

  const root = document.documentElement;

  root.style.setProperty('--forest', primary);
  root.style.setProperty('--deep', secondary);
  root.style.setProperty('--lime', accent);
  root.style.setProperty('--lime-hover', accentHover);
  root.style.setProperty('--lime-text', accentText);
  root.style.setProperty('--primary-contrast', primaryText);
  root.style.setProperty('--mint', mintTint);
  root.style.setProperty('--head', primary);
  root.style.setProperty('--head-dark', headDark);
  root.style.setProperty('--radius', `${radius}px`);
  root.style.setProperty('--space-unit', spaceUnit);
  root.style.setProperty('--font-body', fontBody);
}
