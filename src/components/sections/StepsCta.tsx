import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { cleanPhoneDigits } from '../../utils/sanitize';
import { ArrowRight } from 'lucide-react';

export const StepsCta: React.FC = () => {
  const { details } = useSiteConfig();
  const steps = details.steps;
  const whatsappDigits = cleanPhoneDigits(details.contact.whatsappUrl);

  if (!steps?.ctaButtonText && !steps?.ctaSubText) {
    return null;
  }

  const ctaUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}`
    : details.contact.phoneTel
    ? `tel:${details.contact.phoneTel}`
    : '#contact';

  return (
    <div className="steps-cta-block ra">
      {steps.ctaButtonText && (
        <a
          className="pill lime steps-cta-btn"
          href={ctaUrl}
          target={ctaUrl.startsWith('https://') ? '_blank' : undefined}
          rel={ctaUrl.startsWith('https://') ? 'noopener noreferrer' : undefined}
        >
          <span>{steps.ctaButtonText}</span>
          <ArrowRight className="cta-arrow" size={18} />
        </a>
      )}
      {steps.ctaSubText && <p className="steps-cta-sub">{steps.ctaSubText}</p>}
    </div>
  );
};
