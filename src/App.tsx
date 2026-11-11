/**
 * Config-Driven Local Business Template
 */

import React, { useState, useEffect, useRef } from 'react';
import { SiteConfigProvider, useSiteConfig } from './siteConfig';
import { ProgressBar } from './components/sections/ProgressBar';
import { CreatorBadge } from './components/sections/CreatorBadge';
import { Hero } from './components/sections/Hero';
import { Marquee } from './components/sections/Marquee';
import { Work } from './components/sections/Work';
import { Services } from './components/sections/Services';
import { Why } from './components/sections/Why';
import { Steps } from './components/sections/Steps';
import { StepsCta } from './components/sections/StepsCta';
import { Reviews } from './components/sections/Reviews';
import { Faq } from './components/sections/Faq';
import { Find } from './components/sections/Find';
import { CtaMosaic } from './components/sections/CtaMosaic';
import { Footer } from './components/sections/Footer';

function AppContent() {
  const { layout } = useSiteConfig();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLElement>(null);

  // Top scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timeline vertical line progress
  useEffect(() => {
    const handleTimelineScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      if (timelineHeight > 0) {
        const raw = (viewportCenter - timelineTop) / timelineHeight;
        const progress = Math.max(0, Math.min(1, raw));
        setTimelineProgress(progress);
      }
    };
    window.addEventListener('scroll', handleTimelineScroll, { passive: true });
    handleTimelineScroll();
    return () => window.removeEventListener('scroll', handleTimelineScroll);
  }, []);

  // Scroll reveal with stagger matching original .ra logic
  useEffect(() => {
    const selector =
      '.title, .meta, .work > *, .svch, .row, .why > *, .three > *, .steps .tag, .steps h2, .timeline-row, .rev h2, .rv, .faq > *, details, .find h2, .fg > *, .cta .mid, .bigf';
    const elements = document.querySelectorAll(selector);

    elements.forEach((e) => {
      e.classList.add('ra');
      const parent = e.parentNode;
      if (parent) {
        const index = Array.from(parent.children).indexOf(e as Element);
        (e as HTMLElement).style.setProperty('--d', `${(index % 4) * 0.1}s`);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
            setTimeout(() => {
              (entry.target as HTMLElement).style.setProperty('--d', '0s');
            }, 1400);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.ra').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [layout]);

  const isSectionOn = (id: string) => {
    return layout.sectionsOn[id as keyof typeof layout.sectionsOn] !== false;
  };

  return (
    <>
      <ProgressBar scrollProgress={scrollProgress} />
      <CreatorBadge />

      {isSectionOn('hero') && <Hero />}
      {isSectionOn('marquee') && <Marquee />}

      {/* Main container wrapping body sections */}
      <main className="sec" id="work">
        <div className="wrap">
          {isSectionOn('work') && <Work />}
          {isSectionOn('services') && <Services />}
          {isSectionOn('why') && <Why />}
          {isSectionOn('steps') && (
            <>
              <Steps timelineProgress={timelineProgress} timelineRef={timelineRef} />
              <StepsCta />
            </>
          )}
          {isSectionOn('reviews') && <Reviews />}
          {isSectionOn('faq') && <Faq />}
          {isSectionOn('find') && <Find />}
        </div>

        {isSectionOn('contact') && <CtaMosaic />}
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <SiteConfigProvider>
      <AppContent />
    </SiteConfigProvider>
  );
}
