import React, { useState } from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeImageUrl } from '../../utils/sanitize';

export const Services: React.FC = () => {
  const { details } = useSiteConfig();
  const services = details.services;
  const [activeRow, setActiveRow] = useState<number>(0);

  if (!services || !services.items || services.items.length === 0) {
    return null;
  }

  return (
    <section className="svc" id="services">
      <div className="svch">
        {services.tagLabel && <div className="tag">[ {services.tagLabel} ]</div>}
        {services.title && <h2>{services.title}</h2>}
      </div>

      {services.items.map((item, idx) => {
        const imgSrc = safeImageUrl(item.image);
        const rowImgValue = imgSrc
          ? `url('${imgSrc}')`
          : 'linear-gradient(135deg, var(--forest) 0%, var(--deep) 100%)';

        return (
          <div
            key={`${item.title}-${idx}`}
            className={`row ${activeRow === idx ? 'open' : ''}`}
            onClick={() => setActiveRow(idx)}
            onMouseEnter={() => setActiveRow(idx)}
            style={{ '--rowimg': rowImgValue } as React.CSSProperties}
          >
            <i>{idx + 1}</i>
            <b>{item.title}</b>
            {item.text && <p>{item.text}</p>}
            <em>→</em>
          </div>
        );
      })}
    </section>
  );
};
