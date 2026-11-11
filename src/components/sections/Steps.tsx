import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeImageUrl } from '../../utils/sanitize';

interface StepsProps {
  timelineProgress: number;
  timelineRef: React.RefObject<HTMLElement | null>;
}

export const Steps: React.FC<StepsProps> = ({ timelineProgress, timelineRef }) => {
  const { details } = useSiteConfig();
  const steps = details.steps;

  if (!steps || !steps.items || steps.items.length === 0) {
    return null;
  }

  const totalSteps = steps.items.length;

  return (
    <section className="steps timeline-section" ref={timelineRef} id="steps">
      {steps.tagLabel && <div className="tag">[ {steps.tagLabel} ]</div>}
      {steps.title && <h2>{steps.title}</h2>}

      <div className="timeline-wrap">
        <div className="timeline-spine">
          <div
            className="timeline-spine-fill"
            style={{ transform: `scaleY(${timelineProgress})` }}
          />
        </div>

        {steps.items.map((step, idx) => {
          const isEven = idx % 2 === 1;
          const isReached = timelineProgress >= (idx + 0.35) / Math.max(1, totalSteps);
          const imgSrc = safeImageUrl(step.image);
          const photoStyle: React.CSSProperties = imgSrc
            ? { backgroundImage: `url('${imgSrc}')` }
            : { background: 'linear-gradient(135deg, var(--forest) 0%, var(--deep) 100%)' };

          return (
            <div
              key={`${step.badge || step.title}-${idx}`}
              className={`timeline-row ${isEven ? 'row-reverse' : ''}`}
            >
              <div className="timeline-photo-wrap">
                <div
                  className="timeline-photo"
                  style={photoStyle}
                  role="img"
                  aria-label={step.title}
                />
              </div>

              <div className={`timeline-node ${isReached ? 'node-active' : ''}`}>
                <span>{idx + 1}</span>
              </div>

              <div className="timeline-content">
                {step.badge && <span className="badge">{step.badge}</span>}
                <h3 className="timeline-step-title">{step.title}</h3>
                {step.text && <p className="timeline-step-desc">{step.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
