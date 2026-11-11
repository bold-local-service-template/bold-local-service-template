import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { Coins, ShieldCheck, MessageCircle, CheckCircle } from 'lucide-react';

const icons = [Coins, ShieldCheck, MessageCircle, CheckCircle];

export const Why: React.FC = () => {
  const { details } = useSiteConfig();
  const why = details.why;

  if (!why || !why.features || why.features.length === 0) {
    return null;
  }

  return (
    <>
      <section className="why" id="why">
        <div>
          {why.tagLabel && <div className="tag">[ {why.tagLabel} ]</div>}
          {why.title && <h2>{why.title}</h2>}
        </div>
        {why.leadText && <p className="lead">{why.leadText}</p>}
      </section>

      <div className="three">
        {why.features.map((feature, idx) => {
          const IconComponent = icons[idx % icons.length];
          const isDark = idx === 1; // Middle card design variant

          return (
            <div key={`${feature.title}-${idx}`} className={`f ${isDark ? 'd' : ''}`}>
              <span className="f-num">{String(idx + 1).padStart(2, '0')}</span>
              <div>
                <div className="f-icon-box">
                  <IconComponent size={24} strokeWidth={2} />
                </div>
                <h5>{feature.title}</h5>
              </div>
              {feature.text && <p>{feature.text}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
};
