import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeLink, safeImageUrl, cleanPhoneDigits, buildWhatsAppQuoteUrl } from '../../utils/sanitize';

export const Hero: React.FC = () => {
  const { details, assets, layout } = useSiteConfig();
  const quote = details.quote;
  const whatsappDigits = cleanPhoneDigits(details.contact.whatsappUrl);
  const showQuoteForm = Boolean(quote?.enabled && whatsappDigits.length > 0);

  const [seg, setSeg] = useState(quote.defaultSegment || (quote.segments[0] ?? ''));
  const [service, setService] = useState(quote.defaultService || (quote.services[0] ?? ''));
  const [location, setLocation] = useState(quote.defaultLocation || (quote.locations[0] ?? ''));
  const [propertyType, setPropertyType] = useState(quote.defaultProperty || (quote.propertyTypes[0] ?? ''));

  useEffect(() => {
    if (quote.defaultSegment || quote.segments[0]) {
      setSeg(quote.defaultSegment || quote.segments[0] || '');
    }
    if (quote.defaultService || quote.services[0]) {
      setService(quote.defaultService || quote.services[0] || '');
    }
    if (quote.defaultLocation || quote.locations[0]) {
      setLocation(quote.defaultLocation || quote.locations[0] || '');
    }
    if (quote.defaultProperty || quote.propertyTypes[0]) {
      setPropertyType(quote.defaultProperty || quote.propertyTypes[0] || '');
    }
  }, [quote.defaultSegment, quote.defaultService, quote.defaultLocation, quote.defaultProperty, quote.segments, quote.services, quote.locations, quote.propertyTypes]);

  const handleGetQuote = () => {
    if (!whatsappDigits) return;
    const url = buildWhatsAppQuoteUrl(details.contact.whatsappUrl, quote.messageTemplate, {
      business: details.businessName,
      service,
      location,
      property: propertyType,
      segment: seg,
    });
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const heroImageSrc = safeImageUrl(assets.heroImage);
  const showTitle = Boolean(!heroImageSrc || details.hero.showTitleText);
  const heroTitle = details.hero.title !== undefined ? details.hero.title : details.businessName;

  // Filter nav links: only include targets where sections are enabled
  const navLinks = details.nav.links.filter((link) => {
    const target = link.target.replace('#', '');
    if (target === 'home') return true;
    if (target in layout.sectionsOn && layout.sectionsOn[target as keyof typeof layout.sectionsOn] === false) {
      return false;
    }
    if (target === 'work' && details.work.projects.length === 0) return false;
    if (target === 'services' && details.services.items.length === 0) return false;
    if (target === 'why' && details.why.features.length === 0) return false;
    if (target === 'steps' && details.steps.items.length === 0) return false;
    if (target === 'reviews' && details.reviews.items.length === 0) return false;
    if (target === 'faq' && details.faq.items.length === 0) return false;
    if (target === 'find' && details.find.serviceAreas.length === 0 && !details.find.mapEnabled) return false;
    return true;
  });

  const secondaryBtnUrl = safeLink(details.nav.secondaryButtonUrl);
  const showSecondaryBtn = Boolean(details.nav.secondaryButtonLabel && secondaryBtnUrl);

  const heroImgStyle: React.CSSProperties = heroImageSrc
    ? { backgroundImage: `url('${heroImageSrc}')` }
    : { backgroundImage: 'linear-gradient(135deg, var(--forest) 0%, var(--deep) 100%)' };

  const ctaTargetUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : details.contact.phoneTel
    ? `tel:${details.contact.phoneTel}`
    : '#contact';

  return (
    <header className="hero" id="home">
      <div className="hero-img" style={heroImgStyle} />
      <div className="shade" />

      {/* Live title text when no hero image or showTitleText is true */}
      {showTitle && heroTitle && (
        <div className="big">{heroTitle}</div>
      )}

      <nav>
        <a className="logo" href="#home">
          {assets.logoImage ? (
            <img
              src={safeImageUrl(assets.logoImage)}
              alt={details.logoText || details.businessName}
              style={{ maxHeight: '34px', width: 'auto' }}
            />
          ) : (
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 15 15 4l12 11M7 13v13h16V13" />
              <path d="M11 26v-7h8v7" />
            </svg>
          )}
          <span>{details.logoText || details.businessName}</span>
        </a>

        {navLinks.length > 0 && (
          <div className="links">
            {navLinks.map((link, idx) => (
              <a key={`${link.target}-${idx}`} href={link.target}>
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="btns">
          {showSecondaryBtn && (
            <a
              className="pill out"
              href={secondaryBtnUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {details.nav.secondaryButtonLabel}
            </a>
          )}
          {details.nav.ctaLabel && (
            <a
              className="pill lime"
              href={ctaTargetUrl}
              target={ctaTargetUrl.startsWith('https://') ? '_blank' : undefined}
              rel={ctaTargetUrl.startsWith('https://') ? 'noopener noreferrer' : undefined}
            >
              {details.nav.ctaLabel}
            </a>
          )}
        </div>
      </nav>

      {details.hero.subtitle && (
        <div className="sub-txt">
          {details.hero.subtitle}
          <a className="arrow" href="#work" aria-label="Scroll down">
            ↓
          </a>
        </div>
      )}

      {showQuoteForm && (
        <div className="panel">
          {quote.segments.length > 0 && (
            <div className="tog">
              {quote.segments.map((segment) => (
                <button
                  key={segment}
                  className={seg === segment ? 'on' : ''}
                  onClick={() => setSeg(segment)}
                  type="button"
                >
                  {segment}
                </button>
              ))}
            </div>
          )}

          <div className="fields">
            {quote.services.length > 0 && (
              <label>
                {quote.serviceLabel || 'Service'}
                <select value={service} onChange={(e) => setService(e.target.value)}>
                  {quote.services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {quote.locations.length > 0 && (
              <label>
                {quote.locationLabel || 'Location'}
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  {quote.locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {quote.propertyTypes.length > 0 && (
              <label>
                {quote.propertyLabel || 'Property Type'}
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                  {quote.propertyTypes.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button className="pill lime" id="q" onClick={handleGetQuote} type="button">
              {quote.buttonText || 'Get Quote →'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
