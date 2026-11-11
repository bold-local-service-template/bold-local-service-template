import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeLink, safeMapEmbedUrl } from '../../utils/sanitize';

export const Find: React.FC = () => {
  const { details } = useSiteConfig();
  const find = details.find;
  const contact = details.contact;

  const validEmbedUrl = safeMapEmbedUrl(find?.mapsEmbedUrl);
  const showMapIframe = Boolean(find?.mapEnabled && validEmbedUrl);
  const mapsSearchUrl = safeLink(find?.mapsSearchUrl);

  const hasInfo = Boolean(
    contact.address ||
    contact.phone ||
    contact.openingHours ||
    (find?.serviceAreas && find.serviceAreas.length > 0) ||
    showMapIframe ||
    mapsSearchUrl
  );

  if (!hasInfo) {
    return null;
  }

  return (
    <section className="find" id="find">
      {find.tagLabel && <div className="tag">[ {find.tagLabel} ]</div>}
      {find.title && <h2>{find.title}</h2>}

      <div className="fg">
        <div className="fi">
          {details.businessName && <h5>{details.businessName}</h5>}
          <p>
            {contact.address && (
              <>
                {contact.address}
                <br />
              </>
            )}
            {contact.phone && (
              <>
                {contact.phone}
                <br />
              </>
            )}
            {contact.openingHours && <>{contact.openingHours}</>}
          </p>

          {find.serviceAreas && find.serviceAreas.length > 0 && (
            <div className="chips">
              {find.serviceAreas.map((area, idx) => (
                <span key={`${area}-${idx}`}>{area}</span>
              ))}
            </div>
          )}

          {mapsSearchUrl && (
            <div>
              <a
                className="pill lime"
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {find.buttonText || 'Open in Google Maps ↗'}
              </a>
            </div>
          )}
        </div>

        {showMapIframe && (
          <div className="map">
            <iframe
              src={validEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', inset: 0, borderRadius: 'var(--radius)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${details.businessName} map location`}
            />
          </div>
        )}
      </div>
    </section>
  );
};
