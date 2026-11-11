import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeImageUrl, cleanPhoneDigits } from '../../utils/sanitize';

export const CtaMosaic: React.FC = () => {
  const { details } = useSiteConfig();
  const mosaic = details.ctaMosaic;
  const mosaicImgs = mosaic['images'];
  const whatsappDigits = cleanPhoneDigits(details.contact.whatsappUrl);
  const phoneTel = details.contact.phoneTel || cleanPhoneDigits(details.contact.phone);

  if (!mosaic.title && (!mosaicImgs || mosaicImgs.length === 0)) {
    return null;
  }

  // 6 slots in the mosaic grid
  const slots = Array.from({ length: 6 }).map((_, idx) => {
    const item = mosaicImgs?.[idx];
    const imgSrc = safeImageUrl(item?.src);
    return {
      imgSrc,
      alt: item?.alt || '',
      isP: idx === 0 || idx === 4,
    };
  });

  const showCallBtn = Boolean(phoneTel && mosaic.callButtonText);
  const showWhatsappBtn = Boolean(whatsappDigits);

  return (
    <section className="cta" id="contact">
      {slots.map((slot, idx) => {
        const bgStyle: React.CSSProperties = slot.imgSrc
          ? { backgroundImage: `url('${slot.imgSrc}')` }
          : { background: 'linear-gradient(135deg, var(--forest) 0%, var(--deep) 100%)' };

        return (
          <div
            key={idx}
            className={`ph ${slot.isP ? 'p' : ''}`}
            style={bgStyle}
            role={slot.imgSrc ? 'img' : undefined}
            aria-label={slot.alt || undefined}
          />
        );
      })}

      <div className="mid">
        {mosaic.title && <h2>{mosaic.title}</h2>}
        <div>
          {showCallBtn && (
            <a className="pill out" href={`tel:${phoneTel}`}>
              {mosaic.callButtonText}
            </a>
          )}{' '}
          {showWhatsappBtn && (
            <a
              className="pill lime"
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {details.nav.ctaLabel || 'Get Free Quote'}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
