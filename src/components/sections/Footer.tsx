import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeLink, safeImageUrl, cleanPhoneDigits } from '../../utils/sanitize';

export const Footer: React.FC = () => {
  const { details, assets, layout } = useSiteConfig();
  const footer = details.footer;
  const contact = details.contact;
  const currentYear = new Date().getFullYear();

  const giantText = footer.giantText || details.businessName;

  const whatsappDigits = cleanPhoneDigits(contact.whatsappUrl);
  const phoneTel = contact.phoneTel || cleanPhoneDigits(contact.phone);
  const instagramUrl = safeLink(contact.instagramUrl);
  const facebookUrl = safeLink(contact.facebookUrl);
  const tiktokUrl = safeLink(contact.tiktokUrl);
  const youtubeUrl = safeLink(contact.youtubeUrl);

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

  const showSocials = Boolean(instagramUrl || whatsappDigits || phoneTel || facebookUrl || tiktokUrl || youtubeUrl);

  return (
    <footer>
      <div className="fbg" />
      {(footer.heading || footer.subtitle) && (
        <div className="ft">
          {footer.heading && <h3>{footer.heading}</h3>}
          {footer.subtitle && <p>{footer.subtitle}</p>}
        </div>
      )}

      <div className="glass">
        <div className="fgrid">
          <div>
            <a className="logo" href="#home" style={{ color: 'var(--head)' }}>
              {assets.logoImage ? (
                <img
                  src={safeImageUrl(assets.logoImage)}
                  alt={details.logoText || details.businessName}
                  style={{ maxHeight: '30px', width: 'auto' }}
                />
              ) : (
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 15 15 4l12 11M7 13v13h16V13" />
                  <path d="M11 26v-7h8v7" />
                </svg>
              )}
              <span>{details.logoText || details.businessName}</span>
            </a>

            {footer.blurb && (
              <p style={{ color: 'var(--desc)', marginTop: '14px', maxWidth: '300px' }}>
                {footer.blurb}
              </p>
            )}

            {showSocials && (
              <div className="fd">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    IG
                  </a>
                )}
                {whatsappDigits && (
                  <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    WA
                  </a>
                )}
                {phoneTel && (
                  <a href={`tel:${phoneTel}`} aria-label="Phone">
                    ☎
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    FB
                  </a>
                )}
                {tiktokUrl && (
                  <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    TT
                  </a>
                )}
                {youtubeUrl && (
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    YT
                  </a>
                )}
              </div>
            )}
          </div>

          {navLinks.length > 0 && (
            <div>
              <h6>{footer.navTitle || 'Navigation'}</h6>
              <ul>
                {navLinks.map((link, idx) => (
                  <li key={`${link.target}-${idx}`}>
                    <a href={link.target}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {details.services.items.length > 0 && (
            <div>
              <h6>{footer.servicesTitle || 'Services'}</h6>
              <ul>
                {details.services.items.map((svc, idx) => (
                  <li key={`${svc.title}-${idx}`}>{svc.title}</li>
                ))}
              </ul>
            </div>
          )}

          {(contact.address || contact.phone || contact.email || contact.openingHours) && (
            <div>
              <h6>{footer.contactTitle || 'Contact'}</h6>
              <ul>
                {contact.address && <li>{contact.address}</li>}
                {contact.phone && <li>{contact.phone}</li>}
                {contact.email && <li>{contact.email}</li>}
                {contact.openingHours && <li>{contact.openingHours}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="cr">
          <span>
            © {currentYear} {details.businessName}. {footer.copyrightLine}
          </span>
          {footer.rightsText && (
            <>
              <i />
              <span>{footer.rightsText}</span>
            </>
          )}
        </div>

        {giantText && <div className="bigf">{giantText}</div>}
      </div>
    </footer>
  );
};
