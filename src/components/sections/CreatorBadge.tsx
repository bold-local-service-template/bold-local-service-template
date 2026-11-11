import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeLink } from '../../utils/sanitize';

export const CreatorBadge: React.FC = () => {
  const { details } = useSiteConfig();
  const creator = details.creator;

  // Rule 8: Creator badge shows only if creator.enabled is true and creator.url starts with https://
  if (!creator || !creator.enabled || !creator.url || !creator.url.startsWith('https://')) {
    return null;
  }

  const safeUrl = safeLink(creator.url);
  if (!safeUrl) return null;

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="open-hours-badge"
      aria-label={creator.label || 'Creator'}
    >
      <div className="oh-tile">
        <span className="oh-tile-open">{creator.brandTop || 'Open'}</span>
        <span className="oh-tile-hours">{creator.brandBottom || 'Hours'}</span>
      </div>
      <div className="oh-text">
        <span className="oh-sub">{creator.label || 'MADE BY'}</span>
        <span className="oh-brand">
          {creator.brandTop} {creator.brandBottom}
        </span>
      </div>
    </a>
  );
};
