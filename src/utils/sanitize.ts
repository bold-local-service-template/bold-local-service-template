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

export function safeLink(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('#')
  ) {
    return trimmed;
  }
  return '';
}

export function safeImageUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/png') ||
    trimmed.startsWith('data:image/jpeg') ||
    trimmed.startsWith('data:image/webp') ||
    trimmed.startsWith('data:image/svg+xml')
  ) {
    return trimmed;
  }
  return '';
}

export function safeMapEmbedUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://www.google.com/maps')) {
    return trimmed;
  }
  return '';
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
