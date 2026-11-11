import React from 'react';
import { useSiteConfig } from '../../siteConfig';

export const Marquee: React.FC = () => {
  const { details } = useSiteConfig();
  const items = details.marquee.items;

  if (!items || items.length === 0) {
    return null;
  }

  // Ensure track fills 1920px+ even with 1 or few items
  const repeatCount = Math.max(4, Math.ceil(32 / items.length));

  return (
    <div className="mq">
      <div className="mt" id="mt">
        {Array.from({ length: repeatCount }).flatMap((_, loopIdx) =>
          items.map((item, idx) => (
            <React.Fragment key={`${loopIdx}-${idx}`}>
              <span>{item}</span>
              <b>✦</b>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
