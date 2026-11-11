import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyBrandCssVariables } from './utils/color';
import { safeLink, safeImageUrl, safeMapEmbedUrl, cleanPhoneDigits } from './utils/sanitize';

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
      messageTemplate: 'Hello {business}, I would like a quote for {service} in {location} ({property}, {segment}).',
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
          answer: 'Send a message or call with a short description of your project. We review details and provide a clear plan.',
        },
        {
          question: 'Which areas do you cover?',
          answer: 'We provide service to local residential and commercial properties. Contact us to confirm your location.',
        },
        {
          question: 'Are quotes free and without obligation?',
          answer: 'Yes, all initial estimates and consultations are completely free with zero obligation.',
        },
        {
          question: 'How quickly can work begin?',
          answer: 'Timelines depend on project scope. Share your requirements and we will provide our current schedule.',
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
    fontStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

/**
 * Validation helper per Rule 9:
 * Short text: max 200
 * Paragraphs: max 1500
 * Payload <= 6 MB
 * Array bounds enforced
 * Images only data:image/(png|jpeg|webp) or https
 */
function cleanShort(val: unknown, fallback = '', max = 200): string {
  if (typeof val !== 'string') return fallback;
  return val.trim().slice(0, max);
}

function cleanPara(val: unknown, fallback = '', max = 1500): string {
  if (typeof val !== 'string') return fallback;
  return val.trim().slice(0, max);
}

function cleanBool(val: unknown, fallback: boolean): boolean {
  if (typeof val === 'boolean') return val;
  return fallback;
}

export function validateAndMergeConfig(raw: unknown, base: SiteConfig): SiteConfig {
  if (!raw || typeof raw !== 'object') return base;
  const input = raw as Partial<SiteConfig>;
  const d = (input.details || {}) as Partial<SiteConfig['details']>;
  const a = (input.assets || {}) as Partial<SiteConfig['assets']>;
  const b = (input.brand || {}) as Partial<SiteConfig['brand']>;
  const l = (input.layout || {}) as Partial<SiteConfig['layout']>;

  // Nav
  const navInput = (d.nav || {}) as Partial<SiteConfig['details']['nav']>;
  const links = Array.isArray(navInput.links)
    ? navInput.links.slice(0, 6).map((item) => ({
        label: cleanShort(item?.label, 'Link', 40),
        target: cleanShort(item?.target, '#', 100),
      }))
    : base.details.nav.links;

  // Quote
  const qInput = (d.quote || {}) as Partial<SiteConfig['details']['quote']>;
  const quote: SiteConfig['details']['quote'] = {
    enabled: cleanBool(qInput.enabled, base.details.quote.enabled),
    segments: Array.isArray(qInput.segments)
      ? qInput.segments.slice(0, 3).map((s) => cleanShort(s, '', 40)).filter(Boolean)
      : base.details.quote.segments,
    segmentLabel: cleanShort(qInput.segmentLabel, base.details.quote.segmentLabel, 40),
    services: Array.isArray(qInput.services)
      ? qInput.services.slice(0, 8).map((s) => cleanShort(s, '', 50)).filter(Boolean)
      : base.details.quote.services,
    locations: Array.isArray(qInput.locations)
      ? qInput.locations.slice(0, 8).map((s) => cleanShort(s, '', 50)).filter(Boolean)
      : base.details.quote.locations,
    propertyTypes: Array.isArray(qInput.propertyTypes)
      ? qInput.propertyTypes.slice(0, 6).map((s) => cleanShort(s, '', 50)).filter(Boolean)
      : base.details.quote.propertyTypes,
    serviceLabel: cleanShort(qInput.serviceLabel, base.details.quote.serviceLabel, 40),
    locationLabel: cleanShort(qInput.locationLabel, base.details.quote.locationLabel, 40),
    propertyLabel: cleanShort(qInput.propertyLabel, base.details.quote.propertyLabel, 40),
    buttonText: cleanShort(qInput.buttonText, base.details.quote.buttonText, 40),
    messageTemplate: cleanPara(qInput.messageTemplate, base.details.quote.messageTemplate, 500),
    defaultSegment: cleanShort(qInput.defaultSegment, base.details.quote.defaultSegment, 40),
    defaultService: cleanShort(qInput.defaultService, base.details.quote.defaultService, 50),
    defaultLocation: cleanShort(qInput.defaultLocation, base.details.quote.defaultLocation, 50),
    defaultProperty: cleanShort(qInput.defaultProperty, base.details.quote.defaultProperty, 50),
  };

  // Marquee
  const mInput = (d.marquee || {}) as Partial<SiteConfig['details']['marquee']>;
  const marqueeItems = Array.isArray(mInput.items)
    ? mInput.items.slice(0, 10).map((i) => cleanShort(i, '', 60)).filter(Boolean)
    : base.details.marquee.items;

  // Work
  const wInput = (d.work || {}) as Partial<SiteConfig['details']['work']>;
  const projects = Array.isArray(wInput.projects)
    ? wInput.projects.slice(0, 8).map((p) => ({
        title: cleanShort(p?.title, '', 100),
        location: cleanShort(p?.location, '', 100),
        material: cleanShort(p?.material, '', 60),
        duration: cleanShort(p?.duration, '', 40),
        area: cleanShort(p?.area, '', 40),
        image: safeImageUrl(p?.image),
        imageAlt: cleanShort(p?.imageAlt, '', 120),
      })).filter((p) => p.title.length > 0)
    : base.details.work.projects;

  // Services
  const sInput = (d.services || {}) as Partial<SiteConfig['details']['services']>;
  const serviceItems = Array.isArray(sInput.items)
    ? sInput.items.slice(0, 6).map((s) => ({
        title: cleanShort(s?.title, '', 80),
        text: cleanPara(s?.text, '', 400),
        image: safeImageUrl(s?.image),
      })).filter((s) => s.title.length > 0)
    : base.details.services.items;

  // Why
  const whyInput = (d.why || {}) as Partial<SiteConfig['details']['why']>;
  const whyFeatures = Array.isArray(whyInput.features)
    ? whyInput.features.slice(0, 4).map((f) => ({
        title: cleanShort(f?.title, '', 80),
        text: cleanPara(f?.text, '', 400),
      })).filter((f) => f.title.length > 0)
    : base.details.why.features;

  // Steps
  const stepsInput = (d.steps || {}) as Partial<SiteConfig['details']['steps']>;
  const stepItems = Array.isArray(stepsInput.items)
    ? stepsInput.items.slice(0, 6).map((st) => ({
        badge: cleanShort(st?.badge, '', 20),
        title: cleanShort(st?.title, '', 80),
        text: cleanPara(st?.text, '', 500),
        image: safeImageUrl(st?.image),
      })).filter((st) => st.title.length > 0)
    : base.details.steps.items;

  // Reviews
  const revInput = (d.reviews || {}) as Partial<SiteConfig['details']['reviews']>;
  const reviewItems = Array.isArray(revInput.items)
    ? revInput.items.slice(0, 12).map((r) => ({
        initials: cleanShort(r?.initials, '', 6),
        author: cleanShort(r?.author, '', 60),
        meta: cleanShort(r?.meta, '', 80),
        serviceTag: cleanShort(r?.serviceTag, '', 40),
        text: cleanPara(r?.text, '', 500),
      })).filter((r) => r.text.length > 0)
    : base.details.reviews.items;

  // FAQ
  const faqInput = (d.faq || {}) as Partial<SiteConfig['details']['faq']>;
  const faqItems = Array.isArray(faqInput.items)
    ? faqInput.items.slice(0, 8).map((q) => ({
        question: cleanShort(q?.question, '', 160),
        answer: cleanPara(q?.answer, '', 800),
      })).filter((q) => q.question.length > 0)
    : base.details.faq.items;

  // Find
  const fInput = (d.find || {}) as Partial<SiteConfig['details']['find']>;
  const serviceAreas = Array.isArray(fInput.serviceAreas)
    ? fInput.serviceAreas.slice(0, 8).map((a) => cleanShort(a, '', 50)).filter(Boolean)
    : base.details.find.serviceAreas;

  // CtaMosaic
  const cmInput = (d.ctaMosaic || {}) as Partial<SiteConfig['details']['ctaMosaic']>;
  const rawMosaicList = cmInput['images'];
  const mosaicImages = Array.isArray(rawMosaicList)
    ? rawMosaicList.slice(0, 6).map((img) => ({
        src: safeImageUrl(img?.src),
        alt: cleanShort(img?.alt, '', 100),
      }))
    : base.details.ctaMosaic['images'];

  // Contact
  const cInput = (d.contact || {}) as Partial<SiteConfig['details']['contact']>;

  // Creator
  const crInput = (d.creator || {}) as Partial<SiteConfig['details']['creator']>;
  const creatorUrl = safeLink(crInput.url);
  const creatorEnabled = cleanBool(crInput.enabled, base.details.creator.enabled) && creatorUrl.startsWith('https://');

  // Brand
  const primaryColor = cleanShort(b.primaryColor, base.brand.primaryColor, 30);
  const secondaryColor = cleanShort(b.secondaryColor, base.brand.secondaryColor, 30);
  const accentColor = cleanShort(b.accentColor, base.brand.accentColor, 30);
  const fontStack = cleanShort(b.fontStack, base.brand.fontStack, 200);
  const radius = typeof b.radius === 'number' && b.radius >= 0 && b.radius <= 28 ? b.radius : base.brand.radius;
  const density = b.density === 'compact' || b.density === 'airy' || b.density === 'normal' ? b.density : base.brand.density;

  // Layout
  const validSectionIds: SectionId[] = [
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
  const sectionsOn = { ...base.layout.sectionsOn };
  if (l.sectionsOn && typeof l.sectionsOn === 'object') {
    for (const sid of validSectionIds) {
      if (typeof l.sectionsOn[sid] === 'boolean') {
        sectionsOn[sid] = l.sectionsOn[sid];
      }
    }
  }

  const sectionOrder = Array.isArray(l.sectionOrder)
    ? l.sectionOrder.filter((id): id is string => typeof id === 'string' && validSectionIds.includes(id as SectionId))
    : base.layout.sectionOrder;

  return {
    details: {
      businessName: cleanShort(d.businessName, base.details.businessName, 80),
      logoText: cleanShort(d.logoText, base.details.logoText, 50),
      tagline: cleanShort(d.tagline, base.details.tagline, 140),
      metaTitle: cleanShort(d.metaTitle, base.details.metaTitle, 120),
      metaDescription: cleanShort(d.metaDescription, base.details.metaDescription, 300),
      ogTitle: cleanShort(d.ogTitle, base.details.ogTitle, 120),
      ogDescription: cleanShort(d.ogDescription, base.details.ogDescription, 300),
      nav: {
        links,
        ctaLabel: cleanShort(navInput.ctaLabel, base.details.nav.ctaLabel, 40),
        secondaryButtonLabel: cleanShort(navInput.secondaryButtonLabel, base.details.nav.secondaryButtonLabel, 40),
        secondaryButtonUrl: safeLink(navInput.secondaryButtonUrl),
      },
      hero: {
        subtitle: cleanPara(d.hero?.subtitle, base.details.hero.subtitle, 400),
        showTitleText: cleanBool(d.hero?.showTitleText, true),
      },
      quote,
      marquee: {
        items: marqueeItems,
      },
      work: {
        tagLabel: cleanShort(wInput.tagLabel, base.details.work.tagLabel, 40),
        title: cleanShort(wInput.title, base.details.work.title, 80),
        description: cleanPara(wInput.description, base.details.work.description, 400),
        totalProjectsLabel: cleanShort(wInput.totalProjectsLabel, base.details.work.totalProjectsLabel, 40),
        instagramNotice: cleanShort(wInput.instagramNotice, base.details.work.instagramNotice, 160),
        viewAllLabelTop: cleanShort(wInput.viewAllLabelTop, base.details.work.viewAllLabelTop, 40),
        viewAllLabelBottom: cleanShort(wInput.viewAllLabelBottom, base.details.work.viewAllLabelBottom, 40),
        projects,
      },
      services: {
        tagLabel: cleanShort(sInput.tagLabel, base.details.services.tagLabel, 40),
        title: cleanShort(sInput.title, base.details.services.title, 80),
        items: serviceItems,
      },
      why: {
        tagLabel: cleanShort(whyInput.tagLabel, base.details.why.tagLabel, 40),
        title: cleanShort(whyInput.title, base.details.why.title, 80),
        leadText: cleanPara(whyInput.leadText, base.details.why.leadText, 400),
        features: whyFeatures,
      },
      steps: {
        tagLabel: cleanShort(stepsInput.tagLabel, base.details.steps.tagLabel, 40),
        title: cleanShort(stepsInput.title, base.details.steps.title, 80),
        items: stepItems,
        ctaButtonText: cleanShort(stepsInput.ctaButtonText, base.details.steps.ctaButtonText, 40),
        ctaSubText: cleanShort(stepsInput.ctaSubText, base.details.steps.ctaSubText, 140),
      },
      reviews: {
        tagLabel: cleanShort(revInput.tagLabel, base.details.reviews.tagLabel, 40),
        title: cleanShort(revInput.title, base.details.reviews.title, 80),
        countLabel: cleanShort(revInput.countLabel, base.details.reviews.countLabel, 40),
        items: reviewItems,
      },
      faq: {
        tagLabel: cleanShort(faqInput.tagLabel, base.details.faq.tagLabel, 40),
        title: cleanShort(faqInput.title, base.details.faq.title, 80),
        items: faqItems,
      },
      find: {
        tagLabel: cleanShort(fInput.tagLabel, base.details.find.tagLabel, 40),
        title: cleanShort(fInput.title, base.details.find.title, 80),
        mapsSearchUrl: safeLink(fInput.mapsSearchUrl),
        mapsEmbedUrl: safeMapEmbedUrl(fInput.mapsEmbedUrl),
        mapEnabled: cleanBool(fInput.mapEnabled, base.details.find.mapEnabled),
        buttonText: cleanShort(fInput.buttonText, base.details.find.buttonText, 50),
        serviceAreas,
      },
      ctaMosaic: {
        title: cleanShort(cmInput.title, base.details.ctaMosaic.title, 100),
        callButtonText: cleanShort(cmInput.callButtonText, base.details.ctaMosaic.callButtonText, 40),
        images: mosaicImages,
      },
      contact: {
        phone: cleanShort(cInput.phone, base.details.contact.phone, 30),
        phoneTel: cleanShort(cInput.phoneTel, cleanPhoneDigits(cInput.phone || ''), 30),
        email: cleanShort(cInput.email, base.details.contact.email, 80),
        address: cleanShort(cInput.address, base.details.contact.address, 160),
        openingHours: cleanShort(cInput.openingHours, base.details.contact.openingHours, 120),
        whatsappUrl: cleanShort(cInput.whatsappUrl, base.details.contact.whatsappUrl, 100),
        instagramUrl: safeLink(cInput.instagramUrl),
        instagramHandle: cleanShort(cInput.instagramHandle, base.details.contact.instagramHandle, 60),
        facebookUrl: safeLink(cInput.facebookUrl),
        tiktokUrl: safeLink(cInput.tiktokUrl),
        youtubeUrl: safeLink(cInput.youtubeUrl),
      },
      footer: {
        heading: cleanShort(d.footer?.heading, base.details.footer.heading, 100),
        subtitle: cleanPara(d.footer?.subtitle, base.details.footer.subtitle, 400),
        blurb: cleanPara(d.footer?.blurb, base.details.footer.blurb, 400),
        navTitle: cleanShort(d.footer?.navTitle, base.details.footer.navTitle, 40),
        servicesTitle: cleanShort(d.footer?.servicesTitle, base.details.footer.servicesTitle, 40),
        contactTitle: cleanShort(d.footer?.contactTitle, base.details.footer.contactTitle, 40),
        copyrightLine: cleanShort(d.footer?.copyrightLine, base.details.footer.copyrightLine, 100),
        rightsText: cleanShort(d.footer?.rightsText, base.details.footer.rightsText, 80),
        giantText: cleanShort(d.footer?.giantText, base.details.footer.giantText, 60),
      },
      creator: {
        enabled: creatorEnabled,
        url: creatorUrl,
        label: cleanShort(crInput.label, base.details.creator.label, 20),
        brandTop: cleanShort(crInput.brandTop, base.details.creator.brandTop, 20),
        brandBottom: cleanShort(crInput.brandBottom, base.details.creator.brandBottom, 20),
      },
    },
    assets: {
      logoImage: safeImageUrl(a.logoImage),
      favicon: safeImageUrl(a.favicon),
      heroImage: safeImageUrl(a.heroImage),
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
      variants: l.variants || {},
    },
  };
}

export function updatePageMeta(config: SiteConfig) {
  if (typeof document === 'undefined') return;

  const title =
    config.details.metaTitle || `${config.details.businessName} | ${config.details.tagline}`;
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
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = config.assets.favicon;
  }
}

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    // 1. Initial brand CSS application
    applyBrandCssVariables(config.brand);
    updatePageMeta(config);

    // 2. Fetch /site.config.json from same origin if present
    fetch('/site.config.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        if (json) {
          setConfig((current) => {
            const merged = validateAndMergeConfig(json, current);
            applyBrandCssVariables(merged.brand);
            updatePageMeta(merged);
            return merged;
          });
        }
      })
      .catch(() => {
        // Silently ignore missing or invalid site.config.json
      });

    // 3. Post message {type: 'OH_READY', version: 1} to parent
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'OH_READY', version: 1 }, '*');
      }
    } catch {
      // Ignore cross-origin error
    }

    // 4. Live updates through window.addEventListener('message')
    const handleMessage = (event: MessageEvent) => {
      // Rule 9: accept ONLY if event.source === window.parent AND data.type === 'OH_CONFIG' AND data.version === 1
      if (event.source !== window.parent) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'OH_CONFIG' || data.version !== 1) return;

      // Payload size check <= 6MB
      try {
        const payloadString = JSON.stringify(data);
        if (payloadString.length > 6 * 1024 * 1024) {
          return;
        }
      } catch {
        return;
      }

      const newConfigPayload = data.config || data.payload || data.data;
      if (!newConfigPayload) return;

      setConfig((current) => {
        const merged = validateAndMergeConfig(newConfigPayload, current);
        applyBrandCssVariables(merged.brand);
        updatePageMeta(merged);
        return merged;
      });
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    applyBrandCssVariables(config.brand);
    updatePageMeta(config);
  }, [config]);

  return React.createElement(SiteConfigContext.Provider, { value: config }, children);
};
