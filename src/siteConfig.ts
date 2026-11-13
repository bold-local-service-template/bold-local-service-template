import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyBrandCssVariables } from './utils/color';
import {
  cleanPhoneDigits,
  isValidHexColor,
  isValidHttpsUrl,
  isValidImageUrl,
  isValidLink,
  isValidMapEmbedUrl,
  isValidPhoneTel,
  isValidWhatsApp,
} from './utils/sanitize';

export type SectionId =
  | 'hero'
  | 'marquee'
  | 'work'
  | 'services'
  | 'why'
  | 'steps'
  | 'reviews'
  | 'faq'
  | 'find'
  | 'contact';

export interface SiteConfig {
  details: {
    businessName: string;
    logoText: string;
    tagline: string;
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    nav: {
      links: Array<{ label: string; target: string }>; // max 6
      ctaLabel: string;
      secondaryButtonLabel: string;
      secondaryButtonUrl: string;
    };
    hero: {
      title?: string;
      subtitle: string;
      showTitleText?: boolean;
    };
    quote: {
      enabled: boolean;
      segments: string[]; // max 3
      segmentLabel: string;
      services: string[]; // max 8
      locations: string[]; // max 8
      propertyTypes: string[]; // max 6
      serviceLabel: string;
      locationLabel: string;
      propertyLabel: string;
      buttonText: string;
      messageTemplate: string; // tokens {business} {service} {location} {property} {segment}
      defaultSegment: string;
      defaultService: string;
      defaultLocation: string;
      defaultProperty: string;
    };
    marquee: {
      items: string[]; // max 10
    };
    work: {
      tagLabel: string;
      title: string;
      description: string;
      totalProjectsLabel: string;
      instagramNotice: string;
      viewAllLabelTop: string;
      viewAllLabelBottom: string;
      projects: Array<{
        title: string;
        location: string;
        material: string;
        duration: string;
        area: string;
        image: string;
        imageAlt: string;
      }>; // max 8
    };
    services: {
      tagLabel: string;
      title: string;
      items: Array<{
        title: string;
        text: string;
        image: string;
      }>; // max 6
    };
    why: {
      tagLabel: string;
      title: string;
      leadText: string;
      features: Array<{
        title: string;
        text: string;
      }>; // max 4
    };
    steps: {
      tagLabel: string;
      title: string;
      items: Array<{
        badge: string;
        title: string;
        text: string;
        image: string;
      }>; // max 6
      ctaButtonText: string;
      ctaSubText: string;
    };
    reviews: {
      tagLabel: string;
      title: string;
      countLabel: string;
      items: Array<{
        initials: string;
        author: string;
        meta: string;
        serviceTag: string;
        text: string;
      }>; // max 12
    };
    faq: {
      tagLabel: string;
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>; // max 8
    };
    find: {
      tagLabel: string;
      title: string;
      mapsSearchUrl: string;
      mapsEmbedUrl: string;
      mapEnabled: boolean;
      buttonText: string;
      serviceAreas: string[]; // max 8
    };
    ctaMosaic: {
      title: string;
      callButtonText: string;
      images: Array<{
        src: string;
        alt: string;
      }>; // max 6
    };
    contact: {
      phone: string;
      phoneTel: string;
      email: string;
      address: string;
      openingHours: string;
      whatsappUrl: string;
      instagramUrl: string;
      instagramHandle: string;
      facebookUrl: string;
      tiktokUrl: string;
      youtubeUrl: string;
    };
    footer: {
      heading: string;
      subtitle: string;
      blurb: string;
      navTitle: string;
      servicesTitle: string;
      contactTitle: string;
      copyrightLine: string;
      rightsText: string;
      giantText: string;
    };
    creator: {
      enabled: boolean;
      url: string;
      label: string;
      brandTop: string;
      brandBottom: string;
    };
  };
  assets: {
    logoImage?: string;
    favicon?: string;
    heroImage?: string;
  };
  brand: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontStack: string;
    radius: number; // 0-28
    density: 'compact' | 'normal' | 'airy';
  };
  layout: {
    sectionsOn: Record<SectionId, boolean>;
    sectionOrder: string[];
    variants: Record<string, string>;
  };
}

export interface SkippedFieldError {
  path: string;
  reason: string;
}

export type ConfigShape = 'nested' | 'flat' | 'mixed' | 'none';

export interface OhDebugState {
  ohReadySentCount: number;
  lastMessageOrigin: string;
  ohConfigReceivedCount: number;
  lastOhConfigTime: string | null;
  lastPayloadBytes: number;
  topLevelKeys: string[];
  shapeDetected: ConfigShape;
  skippedFields: SkippedFieldError[];
  lastReceivedConfig: unknown;
}

export const defaultSiteConfig: SiteConfig = {
  details: {
    businessName: 'Your business name',
    logoText: 'Your business',
    tagline: 'Quality service you can trust',
    metaTitle: 'Your business name | Short description goes here',
    metaDescription: 'Short description goes here',
    ogTitle: 'Your business name | Short description goes here',
    ogDescription: 'Short description goes here',
    nav: {
      links: [
        { label: 'Home', target: '#home' },
        { label: 'Services', target: '#services' },
        { label: 'Our Work', target: '#work' },
        { label: 'About', target: '#why' },
        { label: 'Contact', target: '#contact' },
      ],
      ctaLabel: 'Get in touch',
      secondaryButtonLabel: '',
      secondaryButtonUrl: '',
    },
    hero: {
      subtitle: 'Short description goes here',
      showTitleText: true,
    },
    quote: {
      enabled: false,
      segments: [],
      segmentLabel: 'Category',
      services: [],
      locations: [],
      propertyTypes: [],
      serviceLabel: 'Service',
      locationLabel: 'Location',
      propertyLabel: 'Type',
      buttonText: 'Get Quote',
      messageTemplate:
        'Hello {business}, I would like a quote for {service} in {location} ({property}, {segment}).',
      defaultSegment: '',
      defaultService: '',
      defaultLocation: '',
      defaultProperty: '',
    },
    marquee: {
      items: ['Quality', 'Reliable', 'Professional', 'Guaranteed', 'Experienced', 'Dedicated'],
    },
    work: {
      tagLabel: 'Featured Projects',
      title: 'Our work',
      description: 'Short description goes here',
      totalProjectsLabel: '',
      instagramNotice: '',
      viewAllLabelTop: '',
      viewAllLabelBottom: '',
      projects: [],
    },
    services: {
      tagLabel: 'What We Do',
      title: 'Services',
      items: [
        {
          title: 'Consultation & Planning',
          text: 'Comprehensive initial consultation to understand your project needs and timeline.',
          image: '',
        },
        {
          title: 'Precision Execution',
          text: 'Quality workmanship delivered by experienced professionals using durable materials.',
          image: '',
        },
        {
          title: 'Maintenance & Care',
          text: 'Ongoing support, routine servicing, and prompt repairs when you need them.',
          image: '',
        },
      ],
    },
    why: {
      tagLabel: 'About Us',
      title: 'Why choose us',
      leadText: 'Short description goes here',
      features: [
        {
          title: 'Clear, Honest Pricing',
          text: 'Know the full scope and cost up front with no hidden extras.',
        },
        {
          title: 'Quality Workmanship',
          text: 'Dependable service and high standards on every project.',
        },
        {
          title: 'Fast Direct Communication',
          text: 'Quick responses and clear guidance every step of the way.',
        },
      ],
    },
    steps: {
      tagLabel: 'Process',
      title: 'How it works',
      items: [
        {
          badge: 'STEP 01',
          title: 'Send Details',
          text: 'Share your requirements and photos for an initial review with no paperwork.',
          image: '',
        },
        {
          badge: 'STEP 02',
          title: 'Free Estimate',
          text: 'Receive a clear price and proposal tailored to your property before work starts.',
          image: '',
        },
        {
          badge: 'STEP 03',
          title: 'Schedule & Work',
          text: 'Work begins on the agreed date with clean, tidy, and considerate progress throughout.',
          image: '',
        },
        {
          badge: 'STEP 04',
          title: 'Final Walkthrough',
          text: 'We inspect every detail together to guarantee complete satisfaction with the result.',
          image: '',
        },
      ],
      ctaButtonText: 'Get in touch',
      ctaSubText: 'Fast response and a clear next step.',
    },
    reviews: {
      tagLabel: 'Client Reviews',
      title: 'What clients say',
      countLabel: '',
      items: [],
    },
    faq: {
      tagLabel: 'Help & Info',
      title: 'Questions? Answered.',
      items: [
        {
          question: 'How do I request an estimate?',
          answer:
            'Send a message or call with a short description of your project. We review details and provide a clear plan.',
        },
        {
          question: 'Which areas do you cover?',
          answer:
            'We provide service to local residential and commercial properties. Contact us to confirm your location.',
        },
        {
          question: 'Are quotes free and without obligation?',
          answer: 'Yes, all initial estimates and consultations are completely free with zero obligation.',
        },
        {
          question: 'How quickly can work begin?',
          answer:
            'Timelines depend on project scope. Share your requirements and we will provide our current schedule.',
        },
      ],
    },
    find: {
      tagLabel: 'Location',
      title: 'Where to find us',
      mapsSearchUrl: '',
      mapsEmbedUrl: '',
      mapEnabled: false,
      buttonText: 'Open in Google Maps',
      serviceAreas: ['Central Area', 'North Region', 'East District', 'South Sector'],
    },
    ctaMosaic: {
      title: 'Ready to start your next project?',
      callButtonText: 'Call now',
      images: [],
    },
    contact: {
      phone: '',
      phoneTel: '',
      email: '',
      address: '',
      openingHours: '',
      whatsappUrl: '',
      instagramUrl: '',
      instagramHandle: '',
      facebookUrl: '',
      tiktokUrl: '',
      youtubeUrl: '',
    },
    footer: {
      heading: 'Ready to talk?',
      subtitle: 'Get in touch today for more information.',
      blurb: 'Quality workmanship, reliable service, and transparent communication.',
      navTitle: 'Navigation',
      servicesTitle: 'Services',
      contactTitle: 'Contact',
      copyrightLine: 'All rights reserved.',
      rightsText: 'Licensed and insured.',
      giantText: 'Your business name',
    },
    creator: {
      enabled: false,
      url: '',
      label: 'MADE BY',
      brandTop: 'Open',
      brandBottom: 'Hours',
    },
  },
  assets: {
    logoImage: '',
    favicon: '',
    heroImage: '',
  },
  brand: {
    primaryColor: '#1e3820',
    secondaryColor: '#122414',
    accentColor: '#88e038',
    fontStack:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    radius: 16,
    density: 'normal',
  },
  layout: {
    sectionsOn: {
      hero: true,
      marquee: true,
      work: true,
      services: true,
      why: true,
      steps: true,
      reviews: true,
      faq: true,
      find: true,
      contact: true,
    },
    sectionOrder: [
      'hero',
      'marquee',
      'work',
      'services',
      'why',
      'steps',
      'reviews',
      'faq',
      'find',
      'contact',
    ],
    variants: {},
  },
};

const VALID_SECTION_IDS: SectionId[] = [
  'hero',
  'marquee',
  'work',
  'services',
  'why',
  'steps',
  'reviews',
  'faq',
  'find',
  'contact',
];

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Extract the config object from an incoming OH_CONFIG message payload.
 * Supports:
 *   - Wrapped: { type: 'OH_CONFIG', version: 1, config: { ... } } (also payload / data)
 *   - Direct:  { type: 'OH_CONFIG', version: 1, details: { ... } } or { type: 'OH_CONFIG', version: 1, "details.hero.title": "..." }
 */
export function extractRawConfig(messageData: unknown): Record<string, unknown> | null {
  if (!isPlainObject(messageData)) return null;

  if ('config' in messageData && messageData.config !== undefined) {
    return isPlainObject(messageData.config) ? messageData.config : null;
  }
  if ('payload' in messageData && messageData.payload !== undefined) {
    return isPlainObject(messageData.payload) ? messageData.payload : null;
  }
  if ('data' in messageData && messageData.data !== undefined) {
    return isPlainObject(messageData.data) ? messageData.data : null;
  }

  const direct: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(messageData)) {
    if (key === 'type' || key === 'version' || UNSAFE_KEYS.has(key)) continue;
    direct[key] = value;
  }
  return direct;
}

export function detectConfigShape(rawObj: unknown): ConfigShape {
  if (!isPlainObject(rawObj)) return 'none';
  const keys = Object.keys(rawObj);
  if (keys.length === 0) return 'nested';
  const hasDotKeys = keys.some((k) => k.includes('.'));
  const hasNestedKeys = keys.some((k) => !k.includes('.'));
  if (hasDotKeys && hasNestedKeys) return 'mixed';
  if (hasDotKeys) return 'flat';
  return 'nested';
}

function setByPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = path.split('.');
  if (segments.some((s) => !s || UNSAFE_KEYS.has(s))) return;

  let cur: Record<string, unknown> | unknown[] = target;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;

    if (isLast) {
      if (Array.isArray(cur) && /^\d+$/.test(seg)) {
        cur[Number(seg)] = value;
      } else if (isPlainObject(cur)) {
        cur[seg] = value;
      }
      return;
    }

    const nextSeg = segments[i + 1];
    const nextIsIndex = /^\d+$/.test(nextSeg);

    if (Array.isArray(cur) && /^\d+$/.test(seg)) {
      const idx = Number(seg);
      const existing = cur[idx];
      if (
        existing === undefined ||
        existing === null ||
        (nextIsIndex ? !Array.isArray(existing) : !isPlainObject(existing))
      ) {
        cur[idx] = nextIsIndex ? [] : {};
      }
      cur = cur[idx] as Record<string, unknown> | unknown[];
    } else if (isPlainObject(cur)) {
      const existing = cur[seg];
      if (
        existing === undefined ||
        existing === null ||
        (nextIsIndex ? !Array.isArray(existing) : !isPlainObject(existing))
      ) {
        cur[seg] = nextIsIndex ? [] : {};
      }
      cur = cur[seg] as Record<string, unknown> | unknown[];
    } else {
      return;
    }
  }
}

function compactSparseArrays(node: unknown): unknown {
  if (Array.isArray(node)) {
    const dense: unknown[] = [];
    for (let i = 0; i < node.length; i++) {
      if (i in node && node[i] !== undefined) {
        dense.push(compactSparseArrays(node[i]));
      }
    }
    return dense;
  }
  if (isPlainObject(node)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      if (!UNSAFE_KEYS.has(k)) {
        out[k] = compactSparseArrays(v);
      }
    }
    return out;
  }
  return node;
}

/**
 * Normalise flat dot-keys (e.g. "details.hero.title", "details.faq.items.0.question",
 * "details.marquee.items.0") into the nested config shape, preserving nested objects
 * and mixed payloads.
 */
export function normalizeIncomingConfig(rawObj: unknown): Record<string, unknown> {
  if (!isPlainObject(rawObj)) return {};

  const result: Record<string, unknown> = {};

  // Pass 1: clone non-dot keys recursively
  for (const [key, value] of Object.entries(rawObj)) {
    if (UNSAFE_KEYS.has(key) || key.includes('.')) continue;
    if (isPlainObject(value)) {
      result[key] = normalizeIncomingConfig(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (isPlainObject(item) ? normalizeIncomingConfig(item) : item));
    } else {
      result[key] = value;
    }
  }

  // Pass 2: apply flat dot-keys by path
  for (const [key, value] of Object.entries(rawObj)) {
    if (UNSAFE_KEYS.has(key) || !key.includes('.')) continue;
    const normalizedVal = isPlainObject(value)
      ? normalizeIncomingConfig(value)
      : Array.isArray(value)
      ? value.map((item) => (isPlainObject(item) ? normalizeIncomingConfig(item) : item))
      : value;
    setByPath(result, key, normalizedVal);
  }

  return compactSparseArrays(result) as Record<string, unknown>;
}

/**
 * Field-level validation & merge onto defaults.
 * - undefined keeps the default
 * - "" explicitly removes that block (except brand colors / fontStack where "" keeps default)
 * - Arrays replace (never append)
 * - Invalid single field skips ONLY that field, keeps the rest, and records { path, reason }
 */
export function validateAndMergeConfigWithErrors(
  raw: unknown,
  base: SiteConfig = defaultSiteConfig
): { config: SiteConfig; skippedFields: SkippedFieldError[] } {
  const skippedFields: SkippedFieldError[] = [];

  if (!isPlainObject(raw)) {
    if (raw !== undefined) {
      skippedFields.push({ path: '(root)', reason: 'Config payload must be a plain object' });
    }
    return { config: base, skippedFields };
  }

  const recordSkip = (path: string, reason: string) => {
    skippedFields.push({ path, reason });
  };

  const getObj = (
    parent: Record<string, unknown>,
    key: string,
    path: string
  ): Record<string, unknown> => {
    const val = parent[key];
    if (val === undefined) return {};
    if (!isPlainObject(val)) {
      recordSkip(
        path,
        `Expected object, got ${val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val}`
      );
      return {};
    }
    return val;
  };

  const valText = (
    val: unknown,
    fallback: string,
    max: number,
    path: string,
    keepDefaultOnEmpty = false
  ): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '' && keepDefaultOnEmpty) {
      return fallback;
    }
    if (trimmed.length > max) {
      recordSkip(path, `Exceeds max length of ${max} chars (got ${trimmed.length})`);
      return fallback;
    }
    return trimmed;
  };

  const valOptionalText = (
    val: unknown,
    fallback: string | undefined,
    max: number,
    path: string
  ): string | undefined => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed.length > max) {
      recordSkip(path, `Exceeds max length of ${max} chars (got ${trimmed.length})`);
      return fallback;
    }
    return trimmed;
  };

  const valBool = (val: unknown, fallback: boolean, path: string): boolean => {
    if (val === undefined) return fallback;
    if (typeof val !== 'boolean') {
      recordSkip(path, `Expected boolean, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    return val;
  };

  const valLink = (
    val: unknown,
    fallback: string,
    path: string,
    opts?: { allowHash?: boolean; httpsOnly?: boolean; max?: number }
  ): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected URL string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return '';
    const maxLen = opts?.max ?? 500;
    if (trimmed.length > maxLen) {
      recordSkip(path, `URL exceeds max length of ${maxLen} chars`);
      return fallback;
    }
    if (opts?.httpsOnly) {
      if (!isValidHttpsUrl(trimmed)) {
        recordSkip(path, 'Invalid link (must start with https://)');
        return fallback;
      }
      return trimmed;
    }
    if (!isValidLink(trimmed, Boolean(opts?.allowHash))) {
      recordSkip(
        path,
        `Invalid link protocol (allowed: ${opts?.allowHash ? 'https://, tel:, mailto:, #' : 'https://, tel:, mailto:'})`
      );
      return fallback;
    }
    return trimmed;
  };

  const valImage = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected image URL string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return '';
    if (!isValidImageUrl(trimmed)) {
      recordSkip(path, 'Invalid image URL (allowed: https:// or data:image/(png|jpeg|webp))');
      return fallback;
    }
    return trimmed;
  };

  const valMapEmbed = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected map embed URL string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return '';
    if (trimmed.length > 1500) {
      recordSkip(path, 'Map embed URL exceeds max length of 1500 chars');
      return fallback;
    }
    if (!isValidMapEmbedUrl(trimmed)) {
      recordSkip(path, 'Map embed URL must start with https://www.google.com/maps');
      return fallback;
    }
    return trimmed;
  };

  const valWhatsApp = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected WhatsApp number or wa.me URL, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return '';
    if (trimmed.length > 150) {
      recordSkip(path, 'WhatsApp value exceeds max length of 150 chars');
      return fallback;
    }
    if (!isValidWhatsApp(trimmed)) {
      recordSkip(path, 'Invalid WhatsApp value (expected phone digits or https://wa.me/<digits>)');
      return fallback;
    }
    return trimmed;
  };

  const valPhoneTel = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected phone tel string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return '';
    if (trimmed.length > 30) {
      recordSkip(path, 'Phone tel exceeds max length of 30 chars');
      return fallback;
    }
    if (!isValidPhoneTel(trimmed)) {
      recordSkip(path, 'Invalid phone tel format');
      return fallback;
    }
    return trimmed;
  };

  const valColor = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordSkip(path, `Expected hex color string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') return fallback;
    if (!isValidHexColor(trimmed)) {
      recordSkip(path, 'Invalid hex color (expected #RGB or #RRGGBB)');
      return fallback;
    }
    return trimmed;
  };

  const valStringArray = (
    val: unknown,
    fallback: string[],
    maxItems: number,
    maxItemLen: number,
    path: string
  ): string[] => {
    if (val === undefined) return fallback;
    if (!Array.isArray(val)) {
      recordSkip(path, `Expected array, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    if (val.length > maxItems) {
      recordSkip(path, `Array exceeds max length of ${maxItems} (extra items truncated)`);
    }
    const out: string[] = [];
    val.slice(0, maxItems).forEach((item, idx) => {
      const cleaned = valText(item, '', maxItemLen, `${path}.${idx}`);
      if (cleaned) out.push(cleaned);
    });
    return out;
  };

  const d = getObj(raw, 'details', 'details');
  const a = getObj(raw, 'assets', 'assets');
  const b = getObj(raw, 'brand', 'brand');
  const l = getObj(raw, 'layout', 'layout');

  // Nav
  const navInput = getObj(d, 'nav', 'details.nav');
  let links = base.details.nav.links;
  if (navInput.links !== undefined) {
    if (!Array.isArray(navInput.links)) {
      recordSkip('details.nav.links', 'Expected array');
    } else {
      if (navInput.links.length > 6) {
        recordSkip('details.nav.links', 'Array exceeds max length of 6 (extra items truncated)');
      }
      const nextLinks: Array<{ label: string; target: string }> = [];
      navInput.links.slice(0, 6).forEach((item, idx) => {
        const itemPath = `details.nav.links.${idx}`;
        if (!isPlainObject(item)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const label = valText(item.label, '', 40, `${itemPath}.label`);
        const target = valLink(item.target, '', `${itemPath}.target`, { allowHash: true, max: 160 });
        if (label && target) {
          nextLinks.push({ label, target });
        }
      });
      links = nextLinks;
    }
  }

  // Hero
  const heroInput = getObj(d, 'hero', 'details.hero');

  // Quote
  const qInput = getObj(d, 'quote', 'details.quote');
  const quote: SiteConfig['details']['quote'] = {
    enabled: valBool(qInput.enabled, base.details.quote.enabled, 'details.quote.enabled'),
    segments: valStringArray(qInput.segments, base.details.quote.segments, 3, 40, 'details.quote.segments'),
    segmentLabel: valText(qInput.segmentLabel, base.details.quote.segmentLabel, 40, 'details.quote.segmentLabel'),
    services: valStringArray(qInput.services, base.details.quote.services, 8, 50, 'details.quote.services'),
    locations: valStringArray(qInput.locations, base.details.quote.locations, 8, 50, 'details.quote.locations'),
    propertyTypes: valStringArray(
      qInput.propertyTypes,
      base.details.quote.propertyTypes,
      6,
      50,
      'details.quote.propertyTypes'
    ),
    serviceLabel: valText(qInput.serviceLabel, base.details.quote.serviceLabel, 40, 'details.quote.serviceLabel'),
    locationLabel: valText(qInput.locationLabel, base.details.quote.locationLabel, 40, 'details.quote.locationLabel'),
    propertyLabel: valText(qInput.propertyLabel, base.details.quote.propertyLabel, 40, 'details.quote.propertyLabel'),
    buttonText: valText(qInput.buttonText, base.details.quote.buttonText, 40, 'details.quote.buttonText'),
    messageTemplate: valText(
      qInput.messageTemplate,
      base.details.quote.messageTemplate,
      500,
      'details.quote.messageTemplate'
    ),
    defaultSegment: valText(qInput.defaultSegment, base.details.quote.defaultSegment, 40, 'details.quote.defaultSegment'),
    defaultService: valText(qInput.defaultService, base.details.quote.defaultService, 50, 'details.quote.defaultService'),
    defaultLocation: valText(
      qInput.defaultLocation,
      base.details.quote.defaultLocation,
      50,
      'details.quote.defaultLocation'
    ),
    defaultProperty: valText(
      qInput.defaultProperty,
      base.details.quote.defaultProperty,
      50,
      'details.quote.defaultProperty'
    ),
  };

  // Marquee
  const mInput = getObj(d, 'marquee', 'details.marquee');
  const marqueeItems = valStringArray(
    mInput.items,
    base.details.marquee.items,
    10,
    60,
    'details.marquee.items'
  );

  // Work
  const wInput = getObj(d, 'work', 'details.work');
  let projects = base.details.work.projects;
  if (wInput.projects !== undefined) {
    if (!Array.isArray(wInput.projects)) {
      recordSkip('details.work.projects', 'Expected array');
    } else {
      if (wInput.projects.length > 8) {
        recordSkip('details.work.projects', 'Array exceeds max length of 8 (extra items truncated)');
      }
      const nextProjects: SiteConfig['details']['work']['projects'] = [];
      wInput.projects.slice(0, 8).forEach((p, idx) => {
        const itemPath = `details.work.projects.${idx}`;
        if (!isPlainObject(p)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const title = valText(p.title, '', 100, `${itemPath}.title`);
        const location = valText(p.location, '', 100, `${itemPath}.location`);
        const material = valText(p.material, '', 60, `${itemPath}.material`);
        const duration = valText(p.duration, '', 40, `${itemPath}.duration`);
        const area = valText(p.area, '', 40, `${itemPath}.area`);
        const image = valImage(p.image, '', `${itemPath}.image`);
        const imageAlt = valText(p.imageAlt, '', 120, `${itemPath}.imageAlt`);
        if (title.length > 0) {
          nextProjects.push({ title, location, material, duration, area, image, imageAlt });
        }
      });
      projects = nextProjects;
    }
  }

  // Services
  const sInput = getObj(d, 'services', 'details.services');
  let serviceItems = base.details.services.items;
  if (sInput.items !== undefined) {
    if (!Array.isArray(sInput.items)) {
      recordSkip('details.services.items', 'Expected array');
    } else {
      if (sInput.items.length > 6) {
        recordSkip('details.services.items', 'Array exceeds max length of 6 (extra items truncated)');
      }
      const nextServices: SiteConfig['details']['services']['items'] = [];
      sInput.items.slice(0, 6).forEach((s, idx) => {
        const itemPath = `details.services.items.${idx}`;
        if (!isPlainObject(s)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const title = valText(s.title, '', 80, `${itemPath}.title`);
        const text = valText(s.text, '', 400, `${itemPath}.text`);
        const image = valImage(s.image, '', `${itemPath}.image`);
        if (title.length > 0) {
          nextServices.push({ title, text, image });
        }
      });
      serviceItems = nextServices;
    }
  }

  // Why
  const whyInput = getObj(d, 'why', 'details.why');
  let whyFeatures = base.details.why.features;
  if (whyInput.features !== undefined) {
    if (!Array.isArray(whyInput.features)) {
      recordSkip('details.why.features', 'Expected array');
    } else {
      if (whyInput.features.length > 4) {
        recordSkip('details.why.features', 'Array exceeds max length of 4 (extra items truncated)');
      }
      const nextFeatures: SiteConfig['details']['why']['features'] = [];
      whyInput.features.slice(0, 4).forEach((f, idx) => {
        const itemPath = `details.why.features.${idx}`;
        if (!isPlainObject(f)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const title = valText(f.title, '', 80, `${itemPath}.title`);
        const text = valText(f.text, '', 400, `${itemPath}.text`);
        if (title.length > 0) {
          nextFeatures.push({ title, text });
        }
      });
      whyFeatures = nextFeatures;
    }
  }

  // Steps
  const stepsInput = getObj(d, 'steps', 'details.steps');
  let stepItems = base.details.steps.items;
  if (stepsInput.items !== undefined) {
    if (!Array.isArray(stepsInput.items)) {
      recordSkip('details.steps.items', 'Expected array');
    } else {
      if (stepsInput.items.length > 6) {
        recordSkip('details.steps.items', 'Array exceeds max length of 6 (extra items truncated)');
      }
      const nextSteps: SiteConfig['details']['steps']['items'] = [];
      stepsInput.items.slice(0, 6).forEach((st, idx) => {
        const itemPath = `details.steps.items.${idx}`;
        if (!isPlainObject(st)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const badge = valText(st.badge, '', 20, `${itemPath}.badge`);
        const title = valText(st.title, '', 80, `${itemPath}.title`);
        const text = valText(st.text, '', 500, `${itemPath}.text`);
        const image = valImage(st.image, '', `${itemPath}.image`);
        if (title.length > 0) {
          nextSteps.push({ badge, title, text, image });
        }
      });
      stepItems = nextSteps;
    }
  }

  // Reviews
  const revInput = getObj(d, 'reviews', 'details.reviews');
  let reviewItems = base.details.reviews.items;
  if (revInput.items !== undefined) {
    if (!Array.isArray(revInput.items)) {
      recordSkip('details.reviews.items', 'Expected array');
    } else {
      if (revInput.items.length > 12) {
        recordSkip('details.reviews.items', 'Array exceeds max length of 12 (extra items truncated)');
      }
      const nextReviews: SiteConfig['details']['reviews']['items'] = [];
      revInput.items.slice(0, 12).forEach((r, idx) => {
        const itemPath = `details.reviews.items.${idx}`;
        if (!isPlainObject(r)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const initials = valText(r.initials, '', 6, `${itemPath}.initials`);
        const author = valText(r.author, '', 60, `${itemPath}.author`);
        const meta = valText(r.meta, '', 80, `${itemPath}.meta`);
        const serviceTag = valText(r.serviceTag, '', 40, `${itemPath}.serviceTag`);
        const text = valText(r.text, '', 500, `${itemPath}.text`);
        if (text.length > 0) {
          nextReviews.push({ initials, author, meta, serviceTag, text });
        }
      });
      reviewItems = nextReviews;
    }
  }

  // FAQ
  const faqInput = getObj(d, 'faq', 'details.faq');
  let faqItems = base.details.faq.items;
  if (faqInput.items !== undefined) {
    if (!Array.isArray(faqInput.items)) {
      recordSkip('details.faq.items', 'Expected array');
    } else {
      if (faqInput.items.length > 8) {
        recordSkip('details.faq.items', 'Array exceeds max length of 8 (extra items truncated)');
      }
      const nextFaq: SiteConfig['details']['faq']['items'] = [];
      faqInput.items.slice(0, 8).forEach((q, idx) => {
        const itemPath = `details.faq.items.${idx}`;
        if (!isPlainObject(q)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const question = valText(q.question, '', 160, `${itemPath}.question`);
        const answer = valText(q.answer, '', 800, `${itemPath}.answer`);
        if (question.length > 0) {
          nextFaq.push({ question, answer });
        }
      });
      faqItems = nextFaq;
    }
  }

  // Find
  const fInput = getObj(d, 'find', 'details.find');
  const serviceAreas = valStringArray(
    fInput.serviceAreas,
    base.details.find.serviceAreas,
    8,
    50,
    'details.find.serviceAreas'
  );

  // CtaMosaic
  const cmInput = getObj(d, 'ctaMosaic', 'details.ctaMosaic');
  const rawMosaicList = cmInput['images'];
  let mosaicImages = base.details.ctaMosaic['images'];
  if (rawMosaicList !== undefined) {
    if (!Array.isArray(rawMosaicList)) {
      recordSkip('details.ctaMosaic.images', 'Expected array');
    } else {
      if (rawMosaicList.length > 6) {
        recordSkip('details.ctaMosaic.images', 'Array exceeds max length of 6 (extra items truncated)');
      }
      const nextMosaic: SiteConfig['details']['ctaMosaic']['images'] = [];
      rawMosaicList.slice(0, 6).forEach((img, idx) => {
        const itemPath = `details.ctaMosaic.images.${idx}`;
        if (!isPlainObject(img)) {
          recordSkip(itemPath, 'Expected object');
          return;
        }
        const src = valImage(img.src, '', `${itemPath}.src`);
        const alt = valText(img.alt, '', 100, `${itemPath}.alt`);
        nextMosaic.push({ src, alt });
      });
      mosaicImages = nextMosaic;
    }
  }

  // Contact
  const cInput = getObj(d, 'contact', 'details.contact');
  const contactPhone = valText(cInput.phone, base.details.contact.phone, 30, 'details.contact.phone');
  const phoneTelFallback =
    cInput.phone !== undefined ? cleanPhoneDigits(contactPhone) : base.details.contact.phoneTel;

  // Footer
  const footerInput = getObj(d, 'footer', 'details.footer');

  // Creator
  const crInput = getObj(d, 'creator', 'details.creator');
  const creatorUrl = valLink(crInput.url, base.details.creator.url, 'details.creator.url', {
    httpsOnly: true,
  });
  const requestedCreatorEnabled = valBool(
    crInput.enabled,
    base.details.creator.enabled,
    'details.creator.enabled'
  );
  if (requestedCreatorEnabled && !creatorUrl.startsWith('https://')) {
    recordSkip('details.creator.enabled', 'Creator badge disabled because creator.url must be a valid https:// URL');
  }
  const creatorEnabled = requestedCreatorEnabled && creatorUrl.startsWith('https://');

  // Brand
  const primaryColor = valColor(b.primaryColor, base.brand.primaryColor, 'brand.primaryColor');
  const secondaryColor = valColor(b.secondaryColor, base.brand.secondaryColor, 'brand.secondaryColor');
  const accentColor = valColor(b.accentColor, base.brand.accentColor, 'brand.accentColor');
  const fontStack = valText(b.fontStack, base.brand.fontStack, 200, 'brand.fontStack', true);

  let radius = base.brand.radius;
  if (b.radius !== undefined) {
    if (typeof b.radius !== 'number' || !Number.isFinite(b.radius) || b.radius < 0 || b.radius > 28) {
      recordSkip('brand.radius', 'Invalid radius (expected number between 0 and 28)');
    } else {
      radius = b.radius;
    }
  }

  let density = base.brand.density;
  if (b.density !== undefined) {
    if (b.density !== 'compact' && b.density !== 'normal' && b.density !== 'airy') {
      recordSkip('brand.density', 'Invalid density (expected "compact", "normal", or "airy")');
    } else {
      density = b.density;
    }
  }

  // Layout
  const sectionsOn = { ...base.layout.sectionsOn };
  if (l.sectionsOn !== undefined) {
    if (!isPlainObject(l.sectionsOn)) {
      recordSkip('layout.sectionsOn', 'Expected object');
    } else {
      for (const [sid, val] of Object.entries(l.sectionsOn)) {
        if (!VALID_SECTION_IDS.includes(sid as SectionId)) {
          recordSkip(`layout.sectionsOn.${sid}`, 'Unknown section ID');
          continue;
        }
        sectionsOn[sid as SectionId] = valBool(
          val,
          sectionsOn[sid as SectionId],
          `layout.sectionsOn.${sid}`
        );
      }
    }
  }

  let sectionOrder = base.layout.sectionOrder;
  if (l.sectionOrder !== undefined) {
    if (!Array.isArray(l.sectionOrder)) {
      recordSkip('layout.sectionOrder', 'Expected array');
    } else {
      const nextOrder: string[] = [];
      l.sectionOrder.forEach((id, idx) => {
        if (typeof id === 'string' && VALID_SECTION_IDS.includes(id as SectionId)) {
          nextOrder.push(id);
        } else {
          recordSkip(`layout.sectionOrder.${idx}`, 'Invalid section ID');
        }
      });
      sectionOrder = nextOrder;
    }
  }

  const variants: Record<string, string> = { ...base.layout.variants };
  if (l.variants !== undefined) {
    if (!isPlainObject(l.variants)) {
      recordSkip('layout.variants', 'Expected object');
    } else {
      for (const [vk, vv] of Object.entries(l.variants)) {
        const cleaned = valText(vv, '', 60, `layout.variants.${vk}`);
        if (cleaned) variants[vk] = cleaned;
      }
    }
  }

  const config: SiteConfig = {
    details: {
      businessName: valText(d.businessName, base.details.businessName, 80, 'details.businessName'),
      logoText: valText(d.logoText, base.details.logoText, 50, 'details.logoText'),
      tagline: valText(d.tagline, base.details.tagline, 140, 'details.tagline'),
      metaTitle: valText(d.metaTitle, base.details.metaTitle, 120, 'details.metaTitle'),
      metaDescription: valText(
        d.metaDescription,
        base.details.metaDescription,
        300,
        'details.metaDescription'
      ),
      ogTitle: valText(d.ogTitle, base.details.ogTitle, 120, 'details.ogTitle'),
      ogDescription: valText(d.ogDescription, base.details.ogDescription, 300, 'details.ogDescription'),
      nav: {
        links,
        ctaLabel: valText(navInput.ctaLabel, base.details.nav.ctaLabel, 40, 'details.nav.ctaLabel'),
        secondaryButtonLabel: valText(
          navInput.secondaryButtonLabel,
          base.details.nav.secondaryButtonLabel,
          40,
          'details.nav.secondaryButtonLabel'
        ),
        secondaryButtonUrl: valLink(
          navInput.secondaryButtonUrl,
          base.details.nav.secondaryButtonUrl,
          'details.nav.secondaryButtonUrl',
          { allowHash: true }
        ),
      },
      hero: {
        title: valOptionalText(heroInput.title, base.details.hero.title, 120, 'details.hero.title'),
        subtitle: valText(heroInput.subtitle, base.details.hero.subtitle, 400, 'details.hero.subtitle'),
        showTitleText: valBool(
          heroInput.showTitleText,
          base.details.hero.showTitleText ?? true,
          'details.hero.showTitleText'
        ),
      },
      quote,
      marquee: {
        items: marqueeItems,
      },
      work: {
        tagLabel: valText(wInput.tagLabel, base.details.work.tagLabel, 40, 'details.work.tagLabel'),
        title: valText(wInput.title, base.details.work.title, 80, 'details.work.title'),
        description: valText(wInput.description, base.details.work.description, 400, 'details.work.description'),
        totalProjectsLabel: valText(
          wInput.totalProjectsLabel,
          base.details.work.totalProjectsLabel,
          40,
          'details.work.totalProjectsLabel'
        ),
        instagramNotice: valText(
          wInput.instagramNotice,
          base.details.work.instagramNotice,
          160,
          'details.work.instagramNotice'
        ),
        viewAllLabelTop: valText(
          wInput.viewAllLabelTop,
          base.details.work.viewAllLabelTop,
          40,
          'details.work.viewAllLabelTop'
        ),
        viewAllLabelBottom: valText(
          wInput.viewAllLabelBottom,
          base.details.work.viewAllLabelBottom,
          40,
          'details.work.viewAllLabelBottom'
        ),
        projects,
      },
      services: {
        tagLabel: valText(sInput.tagLabel, base.details.services.tagLabel, 40, 'details.services.tagLabel'),
        title: valText(sInput.title, base.details.services.title, 80, 'details.services.title'),
        items: serviceItems,
      },
      why: {
        tagLabel: valText(whyInput.tagLabel, base.details.why.tagLabel, 40, 'details.why.tagLabel'),
        title: valText(whyInput.title, base.details.why.title, 80, 'details.why.title'),
        leadText: valText(whyInput.leadText, base.details.why.leadText, 400, 'details.why.leadText'),
        features: whyFeatures,
      },
      steps: {
        tagLabel: valText(stepsInput.tagLabel, base.details.steps.tagLabel, 40, 'details.steps.tagLabel'),
        title: valText(stepsInput.title, base.details.steps.title, 80, 'details.steps.title'),
        items: stepItems,
        ctaButtonText: valText(
          stepsInput.ctaButtonText,
          base.details.steps.ctaButtonText,
          40,
          'details.steps.ctaButtonText'
        ),
        ctaSubText: valText(
          stepsInput.ctaSubText,
          base.details.steps.ctaSubText,
          140,
          'details.steps.ctaSubText'
        ),
      },
      reviews: {
        tagLabel: valText(revInput.tagLabel, base.details.reviews.tagLabel, 40, 'details.reviews.tagLabel'),
        title: valText(revInput.title, base.details.reviews.title, 80, 'details.reviews.title'),
        countLabel: valText(revInput.countLabel, base.details.reviews.countLabel, 40, 'details.reviews.countLabel'),
        items: reviewItems,
      },
      faq: {
        tagLabel: valText(faqInput.tagLabel, base.details.faq.tagLabel, 40, 'details.faq.tagLabel'),
        title: valText(faqInput.title, base.details.faq.title, 80, 'details.faq.title'),
        items: faqItems,
      },
      find: {
        tagLabel: valText(fInput.tagLabel, base.details.find.tagLabel, 40, 'details.find.tagLabel'),
        title: valText(fInput.title, base.details.find.title, 80, 'details.find.title'),
        mapsSearchUrl: valLink(fInput.mapsSearchUrl, base.details.find.mapsSearchUrl, 'details.find.mapsSearchUrl', {
          allowHash: false,
        }),
        mapsEmbedUrl: valMapEmbed(
          fInput.mapsEmbedUrl,
          base.details.find.mapsEmbedUrl,
          'details.find.mapsEmbedUrl'
        ),
        mapEnabled: valBool(fInput.mapEnabled, base.details.find.mapEnabled, 'details.find.mapEnabled'),
        buttonText: valText(fInput.buttonText, base.details.find.buttonText, 50, 'details.find.buttonText'),
        serviceAreas,
      },
      ctaMosaic: {
        title: valText(cmInput.title, base.details.ctaMosaic.title, 100, 'details.ctaMosaic.title'),
        callButtonText: valText(
          cmInput.callButtonText,
          base.details.ctaMosaic.callButtonText,
          40,
          'details.ctaMosaic.callButtonText'
        ),
        images: mosaicImages,
      },
      contact: {
        phone: contactPhone,
        phoneTel: valPhoneTel(cInput.phoneTel, phoneTelFallback, 'details.contact.phoneTel'),
        email: valText(cInput.email, base.details.contact.email, 80, 'details.contact.email'),
        address: valText(cInput.address, base.details.contact.address, 160, 'details.contact.address'),
        openingHours: valText(
          cInput.openingHours,
          base.details.contact.openingHours,
          120,
          'details.contact.openingHours'
        ),
        whatsappUrl: valWhatsApp(
          cInput.whatsappUrl,
          base.details.contact.whatsappUrl,
          'details.contact.whatsappUrl'
        ),
        instagramUrl: valLink(
          cInput.instagramUrl,
          base.details.contact.instagramUrl,
          'details.contact.instagramUrl',
          { allowHash: false }
        ),
        instagramHandle: valText(
          cInput.instagramHandle,
          base.details.contact.instagramHandle,
          60,
          'details.contact.instagramHandle'
        ),
        facebookUrl: valLink(
          cInput.facebookUrl,
          base.details.contact.facebookUrl,
          'details.contact.facebookUrl',
          { allowHash: false }
        ),
        tiktokUrl: valLink(cInput.tiktokUrl, base.details.contact.tiktokUrl, 'details.contact.tiktokUrl', {
          allowHash: false,
        }),
        youtubeUrl: valLink(cInput.youtubeUrl, base.details.contact.youtubeUrl, 'details.contact.youtubeUrl', {
          allowHash: false,
        }),
      },
      footer: {
        heading: valText(footerInput.heading, base.details.footer.heading, 100, 'details.footer.heading'),
        subtitle: valText(footerInput.subtitle, base.details.footer.subtitle, 400, 'details.footer.subtitle'),
        blurb: valText(footerInput.blurb, base.details.footer.blurb, 400, 'details.footer.blurb'),
        navTitle: valText(footerInput.navTitle, base.details.footer.navTitle, 40, 'details.footer.navTitle'),
        servicesTitle: valText(
          footerInput.servicesTitle,
          base.details.footer.servicesTitle,
          40,
          'details.footer.servicesTitle'
        ),
        contactTitle: valText(
          footerInput.contactTitle,
          base.details.footer.contactTitle,
          40,
          'details.footer.contactTitle'
        ),
        copyrightLine: valText(
          footerInput.copyrightLine,
          base.details.footer.copyrightLine,
          100,
          'details.footer.copyrightLine'
        ),
        rightsText: valText(
          footerInput.rightsText,
          base.details.footer.rightsText,
          80,
          'details.footer.rightsText'
        ),
        giantText: valText(
          footerInput.giantText,
          base.details.footer.giantText,
          60,
          'details.footer.giantText'
        ),
      },
      creator: {
        enabled: creatorEnabled,
        url: creatorUrl,
        label: valText(crInput.label, base.details.creator.label, 20, 'details.creator.label'),
        brandTop: valText(crInput.brandTop, base.details.creator.brandTop, 20, 'details.creator.brandTop'),
        brandBottom: valText(
          crInput.brandBottom,
          base.details.creator.brandBottom,
          20,
          'details.creator.brandBottom'
        ),
      },
    },
    assets: {
      logoImage: valImage(a.logoImage, base.assets.logoImage ?? '', 'assets.logoImage'),
      favicon: valImage(a.favicon, base.assets.favicon ?? '', 'assets.favicon'),
      heroImage: valImage(a.heroImage, base.assets.heroImage ?? '', 'assets.heroImage'),
    },
    brand: {
      primaryColor,
      secondaryColor,
      accentColor,
      fontStack,
      radius,
      density,
    },
    layout: {
      sectionsOn,
      sectionOrder,
      variants,
    },
  };

  return { config, skippedFields };
}

export function validateAndMergeConfig(
  raw: unknown,
  base: SiteConfig = defaultSiteConfig
): SiteConfig {
  return validateAndMergeConfigWithErrors(raw, base).config;
}

export function updatePageMeta(config: SiteConfig) {
  if (typeof document === 'undefined') return;

  const fallbackTitle = [config.details.businessName, config.details.tagline].filter(Boolean).join(' | ');
  const title = config.details.metaTitle || fallbackTitle;
  document.title = title;

  const setMeta = (nameAttr: string, key: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${key}"]`);
    if (!el && content) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, key);
      document.head.appendChild(el);
    }
    if (el) {
      el.setAttribute('content', content);
    }
  };

  setMeta('name', 'description', config.details.metaDescription);
  setMeta('property', 'og:title', config.details.ogTitle || title);
  setMeta('property', 'og:description', config.details.ogDescription || config.details.metaDescription);

  if (config.assets.favicon) {
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = config.assets.favicon;
  }
}

// ---------------------------------------------------------------------------
// Module-level OH_CONFIG & OH_PING receiver (registered ONCE at app start)
// ---------------------------------------------------------------------------

const MAX_PAYLOAD_BYTES = 6 * 1024 * 1024;

let currentConfig: SiteConfig = defaultSiteConfig;
let debugState: OhDebugState = {
  ohReadySentCount: 0,
  lastMessageOrigin: '',
  ohConfigReceivedCount: 0,
  lastOhConfigTime: null,
  lastPayloadBytes: 0,
  topLevelKeys: [],
  shapeDetected: 'none',
  skippedFields: [],
  lastReceivedConfig: null,
};
let hasReceivedLiveConfig = false;
let isReceiverInitialized = false;
const storeListeners = new Set<() => void>();

function emitStoreChange() {
  storeListeners.forEach((listener) => listener());
}

export function getSiteConfigSnapshot(): SiteConfig {
  return currentConfig;
}

export function getDebugStateSnapshot(): OhDebugState {
  return debugState;
}

export function sendOhReady() {
  if (typeof window === 'undefined') return;
  try {
    if (window.parent) {
      window.parent.postMessage({ type: 'OH_READY', version: 1 }, '*');
      debugState = {
        ...debugState,
        ohReadySentCount: debugState.ohReadySentCount + 1,
      };
      emitStoreChange();
    }
  } catch {
    // Ignore cross-origin postMessage error
  }
}

export function processIncomingOhMessage(
  source: MessageEventSource | null,
  origin: string,
  data: unknown
): boolean {
  if (typeof window === 'undefined') return false;
  if (source !== window.parent) return false;
  if (!isPlainObject(data)) return false;

  // Ignore our own OH_READY echo when running outside an iframe (window.parent === window)
  if (data.type === 'OH_READY') return false;

  // Re-emit OH_READY every time an OH_PING message arrives from parent
  if (data.type === 'OH_PING') {
    debugState = {
      ...debugState,
      lastMessageOrigin: origin || '',
    };
    sendOhReady();
    return true;
  }

  // Strict guard for OH_CONFIG
  if (data.type !== 'OH_CONFIG' || data.version !== 1) return false;

  let payloadString = '';
  let payloadBytes = 0;
  try {
    payloadString = JSON.stringify(data);
    payloadBytes =
      typeof TextEncoder !== 'undefined'
        ? new TextEncoder().encode(payloadString).length
        : payloadString.length;
  } catch {
    debugState = {
      ...debugState,
      lastMessageOrigin: origin || '',
      ohConfigReceivedCount: debugState.ohConfigReceivedCount + 1,
      lastOhConfigTime: new Date().toISOString(),
      skippedFields: [{ path: '(root)', reason: 'Payload could not be serialized as JSON' }],
    };
    emitStoreChange();
    return false;
  }

  if (payloadBytes > MAX_PAYLOAD_BYTES) {
    debugState = {
      ...debugState,
      lastMessageOrigin: origin || '',
      ohConfigReceivedCount: debugState.ohConfigReceivedCount + 1,
      lastOhConfigTime: new Date().toISOString(),
      lastPayloadBytes: payloadBytes,
      skippedFields: [{ path: '(root)', reason: 'Payload exceeds 6 MB limit' }],
    };
    emitStoreChange();
    return false;
  }

  const rawConfig = extractRawConfig(data);
  if (!rawConfig) {
    debugState = {
      ...debugState,
      lastMessageOrigin: origin || '',
      ohConfigReceivedCount: debugState.ohConfigReceivedCount + 1,
      lastOhConfigTime: new Date().toISOString(),
      lastPayloadBytes: payloadBytes,
      topLevelKeys: [],
      shapeDetected: 'none',
      skippedFields: [{ path: '(root)', reason: 'Missing or invalid config payload object' }],
      lastReceivedConfig: data,
    };
    emitStoreChange();
    return false;
  }

  const topLevelKeys = Object.keys(rawConfig);
  const shapeDetected = detectConfigShape(rawConfig);
  const normalized = normalizeIncomingConfig(rawConfig);
  const { config: merged, skippedFields } = validateAndMergeConfigWithErrors(
    normalized,
    defaultSiteConfig
  );

  hasReceivedLiveConfig = true;
  currentConfig = merged;
  debugState = {
    ...debugState,
    lastMessageOrigin: origin || '',
    ohConfigReceivedCount: debugState.ohConfigReceivedCount + 1,
    lastOhConfigTime: new Date().toISOString(),
    lastPayloadBytes: payloadBytes,
    topLevelKeys,
    shapeDetected,
    skippedFields,
    lastReceivedConfig: rawConfig,
  };

  applyBrandCssVariables(merged.brand);
  updatePageMeta(merged);
  emitStoreChange();
  return true;
}

function handleWindowMessage(event: MessageEvent) {
  processIncomingOhMessage(event.source, event.origin, event.data);
}

export function initOhConfigReceiver() {
  if (typeof window === 'undefined' || isReceiverInitialized) return;
  isReceiverInitialized = true;

  applyBrandCssVariables(currentConfig.brand);
  updatePageMeta(currentConfig);

  window.addEventListener('message', handleWindowMessage);
  sendOhReady();

  fetch('/site.config.json', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      if (json && !hasReceivedLiveConfig) {
        const normalized = normalizeIncomingConfig(json);
        const { config: merged, skippedFields } = validateAndMergeConfigWithErrors(
          normalized,
          defaultSiteConfig
        );
        currentConfig = merged;
        debugState = {
          ...debugState,
          skippedFields,
        };
        applyBrandCssVariables(merged.brand);
        updatePageMeta(merged);
        emitStoreChange();
      }
    })
    .catch(() => {
      // Silently ignore missing or invalid site.config.json
    });
}

// Register listener ONCE at module load outside any React component lifecycle
if (typeof window !== 'undefined') {
  initOhConfigReceiver();
}

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

export function useDebugState(): OhDebugState {
  const [state, setState] = useState<OhDebugState>(() => getDebugStateSnapshot());

  useEffect(() => {
    setState(getDebugStateSnapshot());
    const sync = () => setState(getDebugStateSnapshot());
    storeListeners.add(sync);
    return () => {
      storeListeners.delete(sync);
    };
  }, []);

  return state;
}

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(() => getSiteConfigSnapshot());

  useEffect(() => {
    initOhConfigReceiver();
    setConfig(getSiteConfigSnapshot());
    const sync = () => setConfig(getSiteConfigSnapshot());
    storeListeners.add(sync);
    return () => {
      storeListeners.delete(sync);
    };
  }, []);

  useEffect(() => {
    applyBrandCssVariables(config.brand);
    updatePageMeta(config);
  }, [config]);

  return React.createElement(SiteConfigContext.Provider, { value: config }, children);
};
