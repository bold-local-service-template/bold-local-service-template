import React from 'react';
import { useSiteConfig } from '../../siteConfig';

export const Faq: React.FC = () => {
  const { details } = useSiteConfig();
  const faq = details.faq;

  if (!faq || !faq.items || faq.items.length === 0) {
    return null;
  }

  return (
    <section className="faq" id="faq">
      <div>
        {faq.tagLabel && <div className="tag">[ {faq.tagLabel} ]</div>}
        {faq.title && <h2>{faq.title}</h2>}
      </div>

      <div>
        {faq.items.map((item, idx) => (
          <details key={`${item.question}-${idx}`} open={idx === 0}>
            <summary>{item.question}</summary>
            {item.answer && <p>{item.answer}</p>}
          </details>
        ))}
      </div>
    </section>
  );
};
