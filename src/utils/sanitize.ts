/**
 * Utility functions for URL sanitization and safe link construction.
 * Rules:
 * - https, tel, mailto, and internal anchors (#) only
 * - wa.me only with numeric digits
 * - Google Maps embed only if starting with https://www.google.com/maps
 * - Images only data:image/(png|jpeg|webp) or https://
 */

export function cleanPhoneDigits(input: string): string {
  if (!input) return '';
  return input.replace(/[^\d]/g, '');
}

export function isValidLink(url: string, allowHash = false): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return true;
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:') ||
    (allowHash && trimmed.startsWith('#'))
  );
}

export function isValidHttpsUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return true;
  return trimmed.startsWith('https://') && trimmed.length > 8;
}

export function safeLink(url: string | undefined, allowHash = true): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:') ||
    (allowHash && trimmed.startsWith('#'))
  ) {
    return trimmed;
  }
  return '';
}

export function isValidImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return true;
  return (
    (trimmed.startsWith('https://') && trimmed.length > 8) ||
    trimmed.startsWith('data:image/png') ||
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/webp')
  );
}

export function safeImageUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    (trimmed.startsWith('https://') && trimmed.length > 8) ||
    trimmed.startsWith('data:image/png') ||
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/webp')
  ) {
    return trimmed;
  }
  return '';
}

export function isValidMapEmbedUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return true;
  return trimmed.startsWith('https://www.google.com/maps');
}

export function safeMapEmbedUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://www.google.com/maps')) {
    return trimmed;
  }
  return '';
}

export function isValidWhatsApp(val: string): boolean {
  const trimmed = val.trim();
  if (trimmed === '') return true;
  if (/^https?:\/\//i.test(trimmed)) {
    return /^https:\/\/wa\.me\/\d{5,}([/?#].*)?$/.test(trimmed);
  }
  return /^[\d\s+\-().]+$/.test(trimmed) && cleanPhoneDigits(trimmed).length >= 5;
}

export function isValidPhoneTel(val: string): boolean {
  const trimmed = val.trim();
  if (trimmed === '') return true;
  const body = trimmed.startsWith('tel:') ? trimmed.slice(4) : trimmed;
  return /^[\d\s+\-().]+$/.test(body) && cleanPhoneDigits(body).length >= 3;
}

export function isValidHexColor(val: string): boolean {
  const trimmed = val.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed);
}

export function buildWhatsAppQuoteUrl(
  whatsappDigitsOrUrl: string,
  template: string,
  tokens: {
    business?: string;
    service?: string;
    location?: string;
    property?: string;
    segment?: string;
  }
): string {
  const digits = cleanPhoneDigits(whatsappDigitsOrUrl);
  if (!digits) return '';

  let message = template || 'Hello {business}, I would like a quote for {service} in {location} ({property}, {segment}).';
  message = message.replace(/{business}/g, tokens.business || '');
  message = message.replace(/{service}/g, tokens.service || '');
  message = message.replace(/{location}/g, tokens.location || '');
  message = message.replace(/{property}/g, tokens.property || '');
  message = message.replace(/{segment}/g, tokens.segment || '');

  return `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`;
}
