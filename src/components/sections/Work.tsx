import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { safeImageUrl, safeLink } from '../../utils/sanitize';
import { MapPin, Layers, Calendar, Maximize2, ArrowUpRight, ArrowRight } from 'lucide-react';

export const Work: React.FC = () => {
  const { details } = useSiteConfig();
  const work = details.work;

  // Rule 4: 0 items removes the section
  if (!work || !work.projects || work.projects.length === 0) {
    return null;
  }

  const instagramUrl = safeLink(details.contact.instagramUrl);
  const showViewAll = Boolean(instagramUrl && (work.viewAllLabelTop || work.viewAllLabelBottom));

  return (
    <div className="work-section-wrap">
      {work.title && <h2 className="title">{work.title}</h2>}
      {(work.tagLabel || work.totalProjectsLabel) && (
        <div className="meta">
          {work.tagLabel ? <span>[ {work.tagLabel} ]</span> : <span />}
          {work.totalProjectsLabel ? <span>{work.totalProjectsLabel}</span> : null}
        </div>
      )}

      <div className="work">
        {work.description && <p className="t">{work.description}</p>}

        {work.projects.map((project, idx) => {
          const imgSrc = safeImageUrl(project.image);
          const bgStyle: React.CSSProperties = imgSrc
            ? { backgroundImage: `url('${imgSrc}')` }
            : { background: 'linear-gradient(135deg, var(--forest) 0%, var(--deep) 100%)' };

          const hasSpecs = Boolean(project.material || project.duration || project.area);

          return (
            <div key={`${project.title}-${idx}`} className="card">
              <div className="card-img-wrap">
                <div
                  className="card-img"
                  style={bgStyle}
                  role="img"
                  aria-label={project.imageAlt || project.title}
                />
                <div className="card-img-overlay" />
                {project.material && <span className="card-chip">{project.material}</span>}
                <div className="card-arrow-btn" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="card-body">
                <div>
                  <h4>{project.title}</h4>
                  {project.location && (
                    <div className="card-location">
                      <MapPin size={15} />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                {hasSpecs && (
                  <div className="specs-chips">
                    {project.material && (
                      <span className="spec-chip">
                        <Layers size={13} />
                        {project.material}
                      </span>
                    )}
                    {project.duration && (
                      <span className="spec-chip">
                        <Calendar size={13} />
                        {project.duration}
                      </span>
                    )}
                    {project.area && (
                      <span className="spec-chip">
                        <Maximize2 size={13} />
                        {project.area}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {showViewAll && (
          <div className="t">
            {work.instagramNotice && <p>{work.instagramNotice}</p>}
            <a
              className="all"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{work.viewAllLabelTop || 'View All'}</span>
              <span>{work.viewAllLabelBottom || 'Projects'}</span>
              <ArrowRight className="all-arrow" size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
