import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyBrandCssVariables } from './utils/color';
import {
  cleanPhoneDigits,
  isValidHexColor,
  isValidImageUrl,
  isValidLink,
  isValidMapEmbedUrl,
  isValidPhoneTel,
  isValidWebUrl,
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

export interface RejectedField {
  key: string;
  reason: string;
}

export interface OhDebugState {
  lastMessageTime: string | null;
  appliedCount: number;
  appliedKeys: string[];
  rejected: RejectedField[];
  rawReceivedConfig: unknown;
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

const MAX_STRING_LENGTH = 2000;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
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
 * Convert flat dot-keys (e.g. "details.hero.title", "details.services.items.0.title",
 * "details.marquee.items.0") into nested objects and arrays, preserving nested objects
 * and mixed payloads.
 */
export function normalise(input: unknown): Record<string, unknown> {
  if (!isPlainObject(input)) return {};

  const result: Record<string, unknown> = {};

  // Pass 1: clone non-dot keys recursively
  for (const [key, value] of Object.entries(input)) {
    if (UNSAFE_KEYS.has(key) || key.includes('.')) continue;
    if (isPlainObject(value)) {
      result[key] = normalise(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => (isPlainObject(item) ? normalise(item) : item));
    } else {
      result[key] = value;
    }
  }

  // Pass 2: apply flat dot-keys by path
  for (const [key, value] of Object.entries(input)) {
    if (UNSAFE_KEYS.has(key) || !key.includes('.')) continue;
    const normalizedVal = isPlainObject(value)
      ? normalise(value)
      : Array.isArray(value)
      ? value.map((item) => (isPlainObject(item) ? normalise(item) : item))
      : value;
    setByPath(result, key, normalizedVal);
  }

  return compactSparseArrays(result) as Record<string, unknown>;
}

export const normalizeIncomingConfig = normalise;

type SchemaNode = Record<string, unknown>;

const CONFIG_SCHEMA: SchemaNode = {
  details: {
    businessName: true,
    logoText: true,
    tagline: true,
    metaTitle: true,
    metaDescription: true,
    ogTitle: true,
    ogDescription: true,
    nav: {
      links: { label: true, target: true },
      ctaLabel: true,
      secondaryButtonLabel: true,
      secondaryButtonUrl: true,
    },
    hero: {
      title: true,
      subtitle: true,
      showTitleText: true,
    },
    quote: {
      enabled: true,
      segments: true,
      segmentLabel: true,
      services: true,
      locations: true,
      propertyTypes: true,
      serviceLabel: true,
      locationLabel: true,
      propertyLabel: true,
      buttonText: true,
      messageTemplate: true,
      defaultSegment: true,
      defaultService: true,
      defaultLocation: true,
      defaultProperty: true,
    },
    marquee: {
      items: true,
    },
    work: {
      tagLabel: true,
      title: true,
      description: true,
      totalProjectsLabel: true,
      instagramNotice: true,
      viewAllLabelTop: true,
      viewAllLabelBottom: true,
      projects: {
        title: true,
        location: true,
        material: true,
        duration: true,
        area: true,
        image: true,
        imageAlt: true,
      },
    },
    services: {
      tagLabel: true,
      title: true,
      items: {
        title: true,
        text: true,
        image: true,
      },
    },
    why: {
      tagLabel: true,
      title: true,
      leadText: true,
      features: {
        title: true,
        text: true,
      },
    },
    steps: {
      tagLabel: true,
      title: true,
      items: {
        badge: true,
        title: true,
        text: true,
        image: true,
      },
      ctaButtonText: true,
      ctaSubText: true,
    },
    reviews: {
      tagLabel: true,
      title: true,
      countLabel: true,
      items: {
        initials: true,
        author: true,
        meta: true,
        serviceTag: true,
        text: true,
      },
    },
    faq: {
      tagLabel: true,
      title: true,
      items: {
        question: true,
        answer: true,
      },
    },
    find: {
      tagLabel: true,
      title: true,
      mapsSearchUrl: true,
      mapsEmbedUrl: true,
      mapEnabled: true,
      buttonText: true,
      serviceAreas: true,
    },
    ctaMosaic: {
      title: true,
      callButtonText: true,
      images: {
        src: true,
        alt: true,
      },
    },
    contact: {
      phone: true,
      phoneTel: true,
      email: true,
      address: true,
      openingHours: true,
      whatsappUrl: true,
      instagramUrl: true,
      instagramHandle: true,
      facebookUrl: true,
      tiktokUrl: true,
      youtubeUrl: true,
    },
    footer: {
      heading: true,
      subtitle: true,
      blurb: true,
      navTitle: true,
      servicesTitle: true,
      contactTitle: true,
      copyrightLine: true,
      rightsText: true,
      giantText: true,
    },
    creator: {
      enabled: true,
      url: true,
      label: true,
      brandTop: true,
      brandBottom: true,
    },
  },
  assets: {
    logoImage: true,
    favicon: true,
    heroImage: true,
  },
  brand: {
    primaryColor: true,
    secondaryColor: true,
    accentColor: true,
    fontStack: true,
    radius: true,
    density: true,
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
    sectionOrder: true,
    variants: '*',
  },
};

function collectUnknownKeys(
  obj: Record<string, unknown>,
  schema: SchemaNode,
  prefix: string,
  rejected: RejectedField[]
) {
  for (const [key, val] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (!(key in schema)) {
      rejected.push({ key: fullPath, reason: 'unknown key' });
      continue;
    }
    const subSchema = schema[key];
    if (subSchema === '*') continue;
    if (isPlainObject(subSchema)) {
      if (isPlainObject(val)) {
        collectUnknownKeys(val, subSchema, fullPath, rejected);
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (isPlainObject(item)) {
            collectUnknownKeys(item, subSchema, `${fullPath}.${idx}`, rejected);
          }
        });
      }
    }
  }
}

export interface ValidateMergeResult {
  config: SiteConfig;
  applied: string[];
  rejected: RejectedField[];
}

/**
 * Field-level validation & deep-merge over defaults.
 * - undefined keeps the default
 * - "" removes the content block (except brand colors / fontStack where "" keeps default)
 * - Arrays from parent replace default arrays
 * - Unknown keys are recorded in rejected[] with reason "unknown key"
 * - Invalid fields skip ONLY that field and record { key, reason } in rejected[]
 */
export function validateAndMergeConfigWithErrors(
  raw: unknown,
  base: SiteConfig = defaultSiteConfig
): ValidateMergeResult {
  const applied: string[] = [];
  const rejected: RejectedField[] = [];

  if (!isPlainObject(raw)) {
    if (raw !== undefined) {
      rejected.push({ key: 'config', reason: 'expected plain object' });
    }
    return { config: base, applied, rejected };
  }

  // Flag any unknown keys anywhere in the normalised object tree
  collectUnknownKeys(raw, CONFIG_SCHEMA, '', rejected);

  const recordApplied = (key: string) => {
    applied.push(key);
  };

  const recordRejected = (key: string, reason: string) => {
    rejected.push({ key, reason });
  };

  const getObj = (
    parent: Record<string, unknown>,
    key: string,
    path: string
  ): Record<string, unknown> => {
    const val = parent[key];
    if (val === undefined) return {};
    if (!isPlainObject(val)) {
      recordRejected(
        path,
        `expected object, got ${val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val}`
      );
      return {};
    }
    return val;
  };

  const valText = (
    val: unknown,
    fallback: string,
    path: string,
    keepDefaultOnEmpty = false,
    maxLen = MAX_STRING_LENGTH
  ): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, `expected string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '' && keepDefaultOnEmpty) {
      recordApplied(path);
      return fallback;
    }
    if (trimmed.length > maxLen) {
      recordRejected(path, `exceeds max ${maxLen} chars`);
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valOptionalText = (
    val: unknown,
    fallback: string | undefined,
    path: string,
    maxLen = MAX_STRING_LENGTH
  ): string | undefined => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, `expected string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed.length > maxLen) {
      recordRejected(path, `exceeds max ${maxLen} chars`);
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valBool = (val: unknown, fallback: boolean, path: string): boolean => {
    if (val === undefined) return fallback;
    if (typeof val !== 'boolean') {
      recordRejected(path, `expected boolean, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    recordApplied(path);
    return val;
  };

  const valLink = (
    val: unknown,
    fallback: string,
    path: string,
    opts?: { allowHash?: boolean; webOnly?: boolean }
  ): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, `expected URL string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return '';
    }
    if (trimmed.length > MAX_STRING_LENGTH) {
      recordRejected(path, `exceeds max ${MAX_STRING_LENGTH} chars`);
      return fallback;
    }
    if (opts?.webOnly) {
      if (!isValidWebUrl(trimmed)) {
        recordRejected(path, 'URL must start with http:// or https://');
        return fallback;
      }
      recordApplied(path);
      return trimmed;
    }
    if (!isValidLink(trimmed, Boolean(opts?.allowHash))) {
      recordRejected(
        path,
        opts?.allowHash
          ? 'URL must be http, https, tel, mailto, or #'
          : 'URL must be http, https, tel, or mailto'
      );
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valImage = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, `expected image URL string, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return '';
    }
    const isDataUrl = trimmed.startsWith('data:image/');
    if (!isDataUrl && trimmed.length > MAX_STRING_LENGTH) {
      recordRejected(path, `URL exceeds max ${MAX_STRING_LENGTH} chars`);
      return fallback;
    }
    if (!isValidImageUrl(trimmed)) {
      recordRejected(path, 'invalid image URL (allowed: http/https or data:image/png|jpeg|webp)');
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valMapEmbed = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, `expected map embed URL string`);
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return '';
    }
    if (trimmed.length > MAX_STRING_LENGTH) {
      recordRejected(path, `exceeds max ${MAX_STRING_LENGTH} chars`);
      return fallback;
    }
    if (!isValidMapEmbedUrl(trimmed)) {
      recordRejected(path, 'map embed URL must start with https://www.google.com/maps');
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valWhatsApp = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, 'expected WhatsApp number or wa.me URL string');
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return '';
    }
    if (trimmed.length > MAX_STRING_LENGTH) {
      recordRejected(path, `exceeds max ${MAX_STRING_LENGTH} chars`);
      return fallback;
    }
    if (!isValidWhatsApp(trimmed)) {
      recordRejected(path, 'invalid WhatsApp number or https://wa.me/ URL');
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valPhoneTel = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, 'expected phone tel string');
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return '';
    }
    if (trimmed.length > MAX_STRING_LENGTH) {
      recordRejected(path, `exceeds max ${MAX_STRING_LENGTH} chars`);
      return fallback;
    }
    if (!isValidPhoneTel(trimmed)) {
      recordRejected(path, 'invalid phone tel format');
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valColor = (val: unknown, fallback: string, path: string): string => {
    if (val === undefined) return fallback;
    if (typeof val !== 'string') {
      recordRejected(path, 'expected hex color string');
      return fallback;
    }
    const trimmed = val.trim();
    if (trimmed === '') {
      recordApplied(path);
      return fallback;
    }
    if (!isValidHexColor(trimmed)) {
      recordRejected(path, 'invalid hex color (#RGB or #RRGGBB)');
      return fallback;
    }
    recordApplied(path);
    return trimmed;
  };

  const valStringArray = (
    val: unknown,
    fallback: string[],
    maxItems: number,
    path: string
  ): string[] => {
    if (val === undefined) return fallback;
    if (!Array.isArray(val)) {
      recordRejected(path, `expected array, got ${val === null ? 'null' : typeof val}`);
      return fallback;
    }
    if (val.length > maxItems) {
      recordRejected(path, `array exceeds max ${maxItems} items`);
    }
    const out: string[] = [];
    val.slice(0, maxItems).forEach((item, idx) => {
      const cleaned = valText(item, '', `${path}.${idx}`);
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
      recordRejected('details.nav.links', 'expected array');
    } else {
      if (navInput.links.length > 6) {
        recordRejected('details.nav.links', 'array exceeds max 6 items');
      }
      const nextLinks: Array<{ label: string; target: string }> = [];
      navInput.links.slice(0, 6).forEach((item, idx) => {
        const itemPath = `details.nav.links.${idx}`;
        if (!isPlainObject(item)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const label = valText(item.label, '', `${itemPath}.label`);
        const target = valLink(item.target, '', `${itemPath}.target`, { allowHash: true });
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
    segments: valStringArray(qInput.segments, base.details.quote.segments, 3, 'details.quote.segments'),
    segmentLabel: valText(qInput.segmentLabel, base.details.quote.segmentLabel, 'details.quote.segmentLabel'),
    services: valStringArray(qInput.services, base.details.quote.services, 8, 'details.quote.services'),
    locations: valStringArray(qInput.locations, base.details.quote.locations, 8, 'details.quote.locations'),
    propertyTypes: valStringArray(
      qInput.propertyTypes,
      base.details.quote.propertyTypes,
      6,
      'details.quote.propertyTypes'
    ),
    serviceLabel: valText(qInput.serviceLabel, base.details.quote.serviceLabel, 'details.quote.serviceLabel'),
    locationLabel: valText(qInput.locationLabel, base.details.quote.locationLabel, 'details.quote.locationLabel'),
    propertyLabel: valText(qInput.propertyLabel, base.details.quote.propertyLabel, 'details.quote.propertyLabel'),
    buttonText: valText(qInput.buttonText, base.details.quote.buttonText, 'details.quote.buttonText'),
    messageTemplate: valText(
      qInput.messageTemplate,
      base.details.quote.messageTemplate,
      'details.quote.messageTemplate'
    ),
    defaultSegment: valText(qInput.defaultSegment, base.details.quote.defaultSegment, 'details.quote.defaultSegment'),
    defaultService: valText(qInput.defaultService, base.details.quote.defaultService, 'details.quote.defaultService'),
    defaultLocation: valText(
      qInput.defaultLocation,
      base.details.quote.defaultLocation,
      'details.quote.defaultLocation'
    ),
    defaultProperty: valText(
      qInput.defaultProperty,
      base.details.quote.defaultProperty,
      'details.quote.defaultProperty'
    ),
  };

  // Marquee
  const mInput = getObj(d, 'marquee', 'details.marquee');
  const marqueeItems = valStringArray(
    mInput.items,
    base.details.marquee.items,
    10,
    'details.marquee.items'
  );

  // Work
  const wInput = getObj(d, 'work', 'details.work');
  let projects = base.details.work.projects;
  if (wInput.projects !== undefined) {
    if (!Array.isArray(wInput.projects)) {
      recordRejected('details.work.projects', 'expected array');
    } else {
      if (wInput.projects.length > 8) {
        recordRejected('details.work.projects', 'array exceeds max 8 items');
      }
      const nextProjects: SiteConfig['details']['work']['projects'] = [];
      wInput.projects.slice(0, 8).forEach((p, idx) => {
        const itemPath = `details.work.projects.${idx}`;
        if (!isPlainObject(p)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const title = valText(p.title, '', `${itemPath}.title`);
        const location = valText(p.location, '', `${itemPath}.location`);
        const material = valText(p.material, '', `${itemPath}.material`);
        const duration = valText(p.duration, '', `${itemPath}.duration`);
        const area = valText(p.area, '', `${itemPath}.area`);
        const image = valImage(p.image, '', `${itemPath}.image`);
        const imageAlt = valText(p.imageAlt, '', `${itemPath}.imageAlt`);
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
      recordRejected('details.services.items', 'expected array');
    } else {
      if (sInput.items.length > 6) {
        recordRejected('details.services.items', 'array exceeds max 6 items');
      }
      const nextServices: SiteConfig['details']['services']['items'] = [];
      sInput.items.slice(0, 6).forEach((s, idx) => {
        const itemPath = `details.services.items.${idx}`;
        if (!isPlainObject(s)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const title = valText(s.title, '', `${itemPath}.title`);
        const text = valText(s.text, '', `${itemPath}.text`);
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
      recordRejected('details.why.features', 'expected array');
    } else {
      if (whyInput.features.length > 4) {
        recordRejected('details.why.features', 'array exceeds max 4 items');
      }
      const nextFeatures: SiteConfig['details']['why']['features'] = [];
      whyInput.features.slice(0, 4).forEach((f, idx) => {
        const itemPath = `details.why.features.${idx}`;
        if (!isPlainObject(f)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const title = valText(f.title, '', `${itemPath}.title`);
        const text = valText(f.text, '', `${itemPath}.text`);
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
      recordRejected('details.steps.items', 'expected array');
    } else {
      if (stepsInput.items.length > 6) {
        recordRejected('details.steps.items', 'array exceeds max 6 items');
      }
      const nextSteps: SiteConfig['details']['steps']['items'] = [];
      stepsInput.items.slice(0, 6).forEach((st, idx) => {
        const itemPath = `details.steps.items.${idx}`;
        if (!isPlainObject(st)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const badge = valText(st.badge, '', `${itemPath}.badge`);
        const title = valText(st.title, '', `${itemPath}.title`);
        const text = valText(st.text, '', `${itemPath}.text`);
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
      recordRejected('details.reviews.items', 'expected array');
    } else {
      if (revInput.items.length > 12) {
        recordRejected('details.reviews.items', 'array exceeds max 12 items');
      }
      const nextReviews: SiteConfig['details']['reviews']['items'] = [];
      revInput.items.slice(0, 12).forEach((r, idx) => {
        const itemPath = `details.reviews.items.${idx}`;
        if (!isPlainObject(r)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const initials = valText(r.initials, '', `${itemPath}.initials`);
        const author = valText(r.author, '', `${itemPath}.author`);
        const meta = valText(r.meta, '', `${itemPath}.meta`);
        const serviceTag = valText(r.serviceTag, '', `${itemPath}.serviceTag`);
        const text = valText(r.text, '', `${itemPath}.text`);
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
      recordRejected('details.faq.items', 'expected array');
    } else {
      if (faqInput.items.length > 8) {
        recordRejected('details.faq.items', 'array exceeds max 8 items');
      }
      const nextFaq: SiteConfig['details']['faq']['items'] = [];
      faqInput.items.slice(0, 8).forEach((q, idx) => {
        const itemPath = `details.faq.items.${idx}`;
        if (!isPlainObject(q)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const question = valText(q.question, '', `${itemPath}.question`);
        const answer = valText(q.answer, '', `${itemPath}.answer`);
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
    'details.find.serviceAreas'
  );

  // CtaMosaic
  const cmInput = getObj(d, 'ctaMosaic', 'details.ctaMosaic');
  const rawMosaicList = cmInput['images'];
  let mosaicImages = base.details.ctaMosaic['images'];
  if (rawMosaicList !== undefined) {
    if (!Array.isArray(rawMosaicList)) {
      recordRejected('details.ctaMosaic.images', 'expected array');
    } else {
      if (rawMosaicList.length > 6) {
        recordRejected('details.ctaMosaic.images', 'array exceeds max 6 items');
      }
      const nextMosaic: SiteConfig['details']['ctaMosaic']['images'] = [];
      rawMosaicList.slice(0, 6).forEach((img, idx) => {
        const itemPath = `details.ctaMosaic.images.${idx}`;
        if (!isPlainObject(img)) {
          recordRejected(itemPath, 'expected object');
          return;
        }
        const src = valImage(img.src, '', `${itemPath}.src`);
        const alt = valText(img.alt, '', `${itemPath}.alt`);
        nextMosaic.push({ src, alt });
      });
      mosaicImages = nextMosaic;
    }
  }

  // Contact
  const cInput = getObj(d, 'contact', 'details.contact');
  const contactPhone = valText(cInput.phone, base.details.contact.phone, 'details.contact.phone');
  const phoneTelFallback =
    cInput.phone !== undefined ? cleanPhoneDigits(contactPhone) : base.details.contact.phoneTel;

  // Footer
  const footerInput = getObj(d, 'footer', 'details.footer');

  // Creator
  const crInput = getObj(d, 'creator', 'details.creator');
  const creatorUrl = valLink(crInput.url, base.details.creator.url, 'details.creator.url', {
    webOnly: true,
  });
  const requestedCreatorEnabled = valBool(
    crInput.enabled,
    base.details.creator.enabled,
    'details.creator.enabled'
  );
  if (requestedCreatorEnabled && !creatorUrl.startsWith('https://')) {
    recordRejected('details.creator.enabled', 'requires https:// creator.url');
  }
  const creatorEnabled = requestedCreatorEnabled && creatorUrl.startsWith('https://');

  // Brand
  const primaryColor = valColor(b.primaryColor, base.brand.primaryColor, 'brand.primaryColor');
  const secondaryColor = valColor(b.secondaryColor, base.brand.secondaryColor, 'brand.secondaryColor');
  const accentColor = valColor(b.accentColor, base.brand.accentColor, 'brand.accentColor');
  const fontStack = valText(b.fontStack, base.brand.fontStack, 'brand.fontStack', true);

  let radius = base.brand.radius;
  if (b.radius !== undefined) {
    if (typeof b.radius !== 'number' || !Number.isFinite(b.radius) || b.radius < 0 || b.radius > 28) {
      recordRejected('brand.radius', 'expected number between 0 and 28');
    } else {
      radius = b.radius;
      recordApplied('brand.radius');
    }
  }

  let density = base.brand.density;
  if (b.density !== undefined) {
    if (b.density !== 'compact' && b.density !== 'normal' && b.density !== 'airy') {
      recordRejected('brand.density', 'expected "compact", "normal", or "airy"');
    } else {
      density = b.density;
      recordApplied('brand.density');
    }
  }

  // Layout
  const sectionsOn = { ...base.layout.sectionsOn };
  if (l.sectionsOn !== undefined) {
    if (!isPlainObject(l.sectionsOn)) {
      recordRejected('layout.sectionsOn', 'expected object');
    } else {
      for (const [sid, val] of Object.entries(l.sectionsOn)) {
        if (!VALID_SECTION_IDS.includes(sid as SectionId)) {
          continue; // Already logged by collectUnknownKeys as "unknown key"
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
      recordRejected('layout.sectionOrder', 'expected array');
    } else {
      const nextOrder: string[] = [];
      l.sectionOrder.forEach((id, idx) => {
        if (typeof id === 'string' && VALID_SECTION_IDS.includes(id as SectionId)) {
          nextOrder.push(id);
          recordApplied(`layout.sectionOrder.${idx}`);
        } else {
          recordRejected(`layout.sectionOrder.${idx}`, 'invalid section ID');
        }
      });
      sectionOrder = nextOrder;
    }
  }

  const variants: Record<string, string> = { ...base.layout.variants };
  if (l.variants !== undefined) {
    if (!isPlainObject(l.variants)) {
      recordRejected('layout.variants', 'expected object');
    } else {
      for (const [vk, vv] of Object.entries(l.variants)) {
        const cleaned = valText(vv, '', `layout.variants.${vk}`);
        if (cleaned) variants[vk] = cleaned;
      }
    }
  }

  const config: SiteConfig = {
    details: {
      businessName: valText(d.businessName, base.details.businessName, 'details.businessName'),
      logoText: valText(d.logoText, base.details.logoText, 'details.logoText'),
      tagline: valText(d.tagline, base.details.tagline, 'details.tagline'),
      metaTitle: valText(d.metaTitle, base.details.metaTitle, 'details.metaTitle'),
      metaDescription: valText(d.metaDescription, base.details.metaDescription, 'details.metaDescription'),
      ogTitle: valText(d.ogTitle, base.details.ogTitle, 'details.ogTitle'),
      ogDescription: valText(d.ogDescription, base.details.ogDescription, 'details.ogDescription'),
      nav: {
        links,
        ctaLabel: valText(navInput.ctaLabel, base.details.nav.ctaLabel, 'details.nav.ctaLabel'),
        secondaryButtonLabel: valText(
          navInput.secondaryButtonLabel,
          base.details.nav.secondaryButtonLabel,
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
        title: valOptionalText(heroInput.title, base.details.hero.title, 'details.hero.title'),
        subtitle: valText(heroInput.subtitle, base.details.hero.subtitle, 'details.hero.subtitle'),
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
        tagLabel: valText(wInput.tagLabel, base.details.work.tagLabel, 'details.work.tagLabel'),
        title: valText(wInput.title, base.details.work.title, 'details.work.title'),
        description: valText(wInput.description, base.details.work.description, 'details.work.description'),
        totalProjectsLabel: valText(
          wInput.totalProjectsLabel,
          base.details.work.totalProjectsLabel,
          'details.work.totalProjectsLabel'
        ),
        instagramNotice: valText(
          wInput.instagramNotice,
          base.details.work.instagramNotice,
          'details.work.instagramNotice'
        ),
        viewAllLabelTop: valText(
          wInput.viewAllLabelTop,
          base.details.work.viewAllLabelTop,
          'details.work.viewAllLabelTop'
        ),
        viewAllLabelBottom: valText(
          wInput.viewAllLabelBottom,
          base.details.work.viewAllLabelBottom,
          'details.work.viewAllLabelBottom'
        ),
        projects,
      },
      services: {
        tagLabel: valText(sInput.tagLabel, base.details.services.tagLabel, 'details.services.tagLabel'),
        title: valText(sInput.title, base.details.services.title, 'details.services.title'),
        items: serviceItems,
      },
      why: {
        tagLabel: valText(whyInput.tagLabel, base.details.why.tagLabel, 'details.why.tagLabel'),
        title: valText(whyInput.title, base.details.why.title, 'details.why.title'),
        leadText: valText(whyInput.leadText, base.details.why.leadText, 'details.why.leadText'),
        features: whyFeatures,
      },
      steps: {
        tagLabel: valText(stepsInput.tagLabel, base.details.steps.tagLabel, 'details.steps.tagLabel'),
        title: valText(stepsInput.title, base.details.steps.title, 'details.steps.title'),
        items: stepItems,
        ctaButtonText: valText(
          stepsInput.ctaButtonText,
          base.details.steps.ctaButtonText,
          'details.steps.ctaButtonText'
        ),
        ctaSubText: valText(
          stepsInput.ctaSubText,
          base.details.steps.ctaSubText,
          'details.steps.ctaSubText'
        ),
      },
      reviews: {
        tagLabel: valText(revInput.tagLabel, base.details.reviews.tagLabel, 'details.reviews.tagLabel'),
        title: valText(revInput.title, base.details.reviews.title, 'details.reviews.title'),
        countLabel: valText(revInput.countLabel, base.details.reviews.countLabel, 'details.reviews.countLabel'),
        items: reviewItems,
      },
      faq: {
        tagLabel: valText(faqInput.tagLabel, base.details.faq.tagLabel, 'details.faq.tagLabel'),
        title: valText(faqInput.title, base.details.faq.title, 'details.faq.title'),
        items: faqItems,
      },
      find: {
        tagLabel: valText(fInput.tagLabel, base.details.find.tagLabel, 'details.find.tagLabel'),
        title: valText(fInput.title, base.details.find.title, 'details.find.title'),
        mapsSearchUrl: valLink(fInput.mapsSearchUrl, base.details.find.mapsSearchUrl, 'details.find.mapsSearchUrl', {
          allowHash: false,
        }),
        mapsEmbedUrl: valMapEmbed(
          fInput.mapsEmbedUrl,
          base.details.find.mapsEmbedUrl,
          'details.find.mapsEmbedUrl'
        ),
        mapEnabled: valBool(fInput.mapEnabled, base.details.find.mapEnabled, 'details.find.mapEnabled'),
        buttonText: valText(fInput.buttonText, base.details.find.buttonText, 'details.find.buttonText'),
        serviceAreas,
      },
      ctaMosaic: {
        title: valText(cmInput.title, base.details.ctaMosaic.title, 'details.ctaMosaic.title'),
        callButtonText: valText(
          cmInput.callButtonText,
          base.details.ctaMosaic.callButtonText,
          'details.ctaMosaic.callButtonText'
        ),
        images: mosaicImages,
      },
      contact: {
        phone: contactPhone,
        phoneTel: valPhoneTel(cInput.phoneTel, phoneTelFallback, 'details.contact.phoneTel'),
        email: valText(cInput.email, base.details.contact.email, 'details.contact.email'),
        address: valText(cInput.address, base.details.contact.address, 'details.contact.address'),
        openingHours: valText(
          cInput.openingHours,
          base.details.contact.openingHours,
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
        heading: valText(footerInput.heading, base.details.footer.heading, 'details.footer.heading'),
        subtitle: valText(footerInput.subtitle, base.details.footer.subtitle, 'details.footer.subtitle'),
        blurb: valText(footerInput.blurb, base.details.footer.blurb, 'details.footer.blurb'),
        navTitle: valText(footerInput.navTitle, base.details.footer.navTitle, 'details.footer.navTitle'),
        servicesTitle: valText(
          footerInput.servicesTitle,
          base.details.footer.servicesTitle,
          'details.footer.servicesTitle'
        ),
        contactTitle: valText(
          footerInput.contactTitle,
          base.details.footer.contactTitle,
          'details.footer.contactTitle'
        ),
        copyrightLine: valText(
          footerInput.copyrightLine,
          base.details.footer.copyrightLine,
          'details.footer.copyrightLine'
        ),
        rightsText: valText(
          footerInput.rightsText,
          base.details.footer.rightsText,
          'details.footer.rightsText'
        ),
        giantText: valText(
          footerInput.giantText,
          base.details.footer.giantText,
          'details.footer.giantText'
        ),
      },
      creator: {
        enabled: creatorEnabled,
        url: creatorUrl,
        label: valText(crInput.label, base.details.creator.label, 'details.creator.label'),
        brandTop: valText(crInput.brandTop, base.details.creator.brandTop, 'details.creator.brandTop'),
        brandBottom: valText(
          crInput.brandBottom,
          base.details.creator.brandBottom,
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

  return { config, applied, rejected };
}

export function validateAndMergeConfig(
  raw: unknown,
  base: SiteConfig = defaultSiteConfig
): SiteConfig {
  return validateAndMergeConfigWithErrors(raw, base).config;
}

export function updatePageMeta(config: SiteConfig) {
  if (typeof document === 'undefined') return;

  const hasCustomBusiness =
    config.details.businessName &&
    config.details.businessName !== defaultSiteConfig.details.businessName;
  const hasExplicitMetaTitle =
    config.details.metaTitle !== defaultSiteConfig.details.metaTitle;

  const fallbackTitle = [
    config.details.businessName,
    config.details.tagline !== defaultSiteConfig.details.tagline || !hasCustomBusiness
      ? config.details.tagline
      : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const title = hasExplicitMetaTitle
    ? config.details.metaTitle
    : hasCustomBusiness
    ? fallbackTitle
    : config.details.metaTitle || fallbackTitle;

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
// Module-level OH_CONFIG receiver & optional ?p=<token> Supabase preview loader
// ---------------------------------------------------------------------------

export type PreviewStatus = 'ready' | 'loading' | 'expired' | 'not_found';

const MAX_PAYLOAD_BYTES = 6 * 1024 * 1024;
const PREVIEW_TOKEN_RE = /^[A-Za-z0-9_-]{32,128}$/;
const PREVIEW_TIMEOUT_MS = 8000;

let currentConfig: SiteConfig = defaultSiteConfig;
let previewStatus: PreviewStatus = 'ready';
let debugState: OhDebugState = {
  lastMessageTime: null,
  appliedCount: 0,
  appliedKeys: [],
  rejected: [],
  rawReceivedConfig: null,
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

export function getPreviewStatusSnapshot(): PreviewStatus {
  return previewStatus;
}

export function getDebugStateSnapshot(): OhDebugState {
  return debugState;
}

function postToParent(message: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    if (window.parent) {
      window.parent.postMessage(message, '*');
    }
  } catch {
    // Ignore cross-origin postMessage errors
  }
}

function extractConfigObject(data: Record<string, unknown>): unknown {
  if ('config' in data) {
    return data.config;
  }
  const fallback: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    if (key === 'type' || key === 'version' || UNSAFE_KEYS.has(key)) continue;
    fallback[key] = val;
  }
  return Object.keys(fallback).length > 0 ? fallback : undefined;
}

function applyNormalizedConfig(rawConfig: Record<string, unknown>): ValidateMergeResult {
  const normalised = normalise(rawConfig);
  const result = validateAndMergeConfigWithErrors(normalised, defaultSiteConfig);
  currentConfig = result.config;
  applyBrandCssVariables(result.config.brand);
  updatePageMeta(result.config);
  return result;
}

export function processIncomingOhMessage(
  source: MessageEventSource | null,
  data: unknown
): boolean {
  if (typeof window === 'undefined') return false;
  if (source !== window.parent) return false;
  if (!isPlainObject(data)) return false;
  if (data.type !== 'OH_CONFIG' || data.version !== 1) return false;

  const nowIso = new Date().toISOString();

  try {
    const payloadString = JSON.stringify(data);
    const bytes =
      typeof TextEncoder !== 'undefined'
        ? new TextEncoder().encode(payloadString).length
        : payloadString.length;
    if (bytes > MAX_PAYLOAD_BYTES) {
      const rejected = [{ key: 'config', reason: 'payload exceeds 6 MB limit' }];
      debugState = {
        lastMessageTime: nowIso,
        appliedCount: 0,
        appliedKeys: [],
        rejected,
        rawReceivedConfig: null,
      };
      postToParent({ type: 'OH_APPLIED', version: 1, applied: [], rejected });
      emitStoreChange();
      return false;
    }
  } catch {
    const rejected = [{ key: 'config', reason: 'unserializable payload' }];
    debugState = {
      lastMessageTime: nowIso,
      appliedCount: 0,
      appliedKeys: [],
      rejected,
      rawReceivedConfig: null,
    };
    postToParent({ type: 'OH_APPLIED', version: 1, applied: [], rejected });
    emitStoreChange();
    return false;
  }

  const rawConfig = extractConfigObject(data);
  if (!isPlainObject(rawConfig)) {
    const rejected = [{ key: 'config', reason: 'expected config object' }];
    debugState = {
      lastMessageTime: nowIso,
      appliedCount: 0,
      appliedKeys: [],
      rejected,
      rawReceivedConfig: rawConfig ?? null,
    };
    postToParent({ type: 'OH_APPLIED', version: 1, applied: [], rejected });
    emitStoreChange();
    return false;
  }

  const { applied, rejected } = applyNormalizedConfig(rawConfig);

  hasReceivedLiveConfig = true;
  previewStatus = 'ready';
  debugState = {
    lastMessageTime: nowIso,
    appliedCount: applied.length,
    appliedKeys: applied,
    rejected,
    rawReceivedConfig: rawConfig,
  };

  postToParent({ type: 'OH_APPLIED', version: 1, applied, rejected });
  emitStoreChange();
  return true;
}

function handleWindowMessage(event: MessageEvent) {
  processIncomingOhMessage(event.source, event.data);
}

function getSupabaseEnv(): { url: string; anonKey: string } {
  let rawUrl = '';
  let rawAnonKey = '';
  try {
    rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
  } catch {
    rawUrl = '';
  }
  try {
    rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  } catch {
    rawAnonKey = '';
  }
  return {
    url: String(rawUrl).trim().replace(/\/+$/, ''),
    anonKey: String(rawAnonKey).trim(),
  };
}

function setDocumentStatusTitle(title: string) {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

async function fetchSupabasePreview(supabaseUrl: string, anonKey: string, token: string) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => {
        controller.abort();
      }, PREVIEW_TIMEOUT_MS)
    : null;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_website_preview`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_token: token }),
      signal: controller ? controller.signal : undefined,
      referrerPolicy: 'no-referrer',
    });

    if (!res.ok) {
      previewStatus = 'not_found';
      setDocumentStatusTitle('This link is not valid');
      emitStoreChange();
      return;
    }

    const json = await res.json();
    const payload = Array.isArray(json) ? json[0] : json;
    if (!isPlainObject(payload)) {
      previewStatus = 'not_found';
      setDocumentStatusTitle('This link is not valid');
      emitStoreChange();
      return;
    }

    if (payload.status === 'ok') {
      const rawCfg = isPlainObject(payload.config) ? payload.config : {};
      const { applied, rejected } = applyNormalizedConfig(rawCfg);
      hasReceivedLiveConfig = true;
      previewStatus = 'ready';
      debugState = {
        lastMessageTime: new Date().toISOString(),
        appliedCount: applied.length,
        appliedKeys: applied,
        rejected,
        rawReceivedConfig: rawCfg,
      };
      emitStoreChange();
      return;
    }

    if (payload.status === 'expired') {
      previewStatus = 'expired';
      setDocumentStatusTitle('Website Expired');
      emitStoreChange();
      return;
    }

    previewStatus = 'not_found';
    setDocumentStatusTitle('This link is not valid');
    emitStoreChange();
  } catch {
    previewStatus = 'not_found';
    setDocumentStatusTitle('This link is not valid');
    emitStoreChange();
  } finally {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}

export function initOhConfigReceiver() {
  if (typeof window === 'undefined' || isReceiverInitialized) return;
  isReceiverInitialized = true;

  window.addEventListener('message', handleWindowMessage);
  postToParent({ type: 'OH_READY', version: 1 });

  let previewToken: string | null = null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('p')) {
      previewToken = params.get('p') ?? '';
    }
  } catch {
    previewToken = null;
  }

  if (previewToken !== null) {
    const { url, anonKey } = getSupabaseEnv();
    if (!url || !anonKey) {
      // Missing Supabase env vars: skip silently and keep defaults
      previewStatus = 'ready';
      applyBrandCssVariables(currentConfig.brand);
      updatePageMeta(currentConfig);
      return;
    }

    if (!PREVIEW_TOKEN_RE.test(previewToken)) {
      previewStatus = 'not_found';
      setDocumentStatusTitle('This link is not valid');
      return;
    }

    previewStatus = 'loading';
    void fetchSupabasePreview(url, anonKey, previewToken);
    return;
  }

  // Normal mode (no ?p): behave identically to before
  applyBrandCssVariables(currentConfig.brand);
  updatePageMeta(currentConfig);

  fetch('/site.config.json', { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      if (json && !hasReceivedLiveConfig && isPlainObject(json)) {
        const { applied, rejected } = applyNormalizedConfig(json);
        debugState = {
          ...debugState,
          appliedCount: applied.length,
          appliedKeys: applied,
          rejected,
        };
        emitStoreChange();
      }
    })
    .catch(() => {
      // Silently ignore missing or invalid site.config.json
    });
}

// Register listener ONCE at app start outside React render
if (typeof window !== 'undefined') {
  initOhConfigReceiver();
}

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

export function usePreviewStatus(): PreviewStatus {
  const [status, setStatus] = useState<PreviewStatus>(() => getPreviewStatusSnapshot());

  useEffect(() => {
    setStatus(getPreviewStatusSnapshot());
    const sync = () => setStatus(getPreviewStatusSnapshot());
    storeListeners.add(sync);
    return () => {
      storeListeners.delete(sync);
    };
  }, []);

  return status;
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
    if (getPreviewStatusSnapshot() === 'ready') {
      applyBrandCssVariables(config.brand);
      updatePageMeta(config);
    }
  }, [config]);

  return React.createElement(SiteConfigContext.Provider, { value: config }, children);
};
