import React from 'react';
import { useSiteConfig } from '../../siteConfig';
import { Quote } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { details } = useSiteConfig();
  const reviews = details.reviews;

  // Rule 4: Reviews section appears ONLY if at least one item has non-empty text
  const validReviews = (reviews?.items || []).filter(
    (item) => item.text && item.text.trim().length > 0
  );

  if (validReviews.length === 0) {
    return null;
  }

  // Split into row 1 and row 2
  const row1 = validReviews.filter((_, idx) => idx % 2 === 0);
  const row2 = validReviews.filter((_, idx) => idx % 2 === 1);
  const finalRow2 = row2.length > 0 ? row2 : row1;

  // Duplicate items enough times so track seamlessly spans 1920px+
  const repeatRow1 = Math.max(2, Math.ceil(8 / row1.length));
  const repeatRow2 = Math.max(2, Math.ceil(8 / finalRow2.length));

  const track1 = Array.from({ length: repeatRow1 }).flatMap(() => row1);
  const track2 = Array.from({ length: repeatRow2 }).flatMap(() => finalRow2);

  return (
    <section className="rev" id="reviews">
      {reviews.title && <h2>{reviews.title}</h2>}
      {(reviews.tagLabel || reviews.countLabel) && (
        <div className="meta">
          {reviews.tagLabel ? <span>[ {reviews.tagLabel} ]</span> : <span />}
          {reviews.countLabel ? <span>{reviews.countLabel}</span> : null}
        </div>
      )}

      <div className="reviews-wall">
        {/* Row 1: Right to Left */}
        <div className="reviews-marquee-row reviews-marquee-row-1">
          <div className="marquee-track">
            {track1.map((review, i) => {
              const isDark = i % 3 === 2;
              return (
                <div
                  key={`r1-${review.author}-${i}`}
                  className={`review-card ${isDark ? 'is-dark' : ''}`}
                >
                  <div className="review-card-top">
                    <div className="review-stars" aria-label="5 stars">
                      ★★★★★
                    </div>
                    <Quote size={32} className="review-quote-icon" />
                  </div>
                  <p className="review-text">{review.text}</p>
                  <div className="review-footer">
                    <div className="review-author-wrap">
                      {review.initials && (
                        <div className="review-avatar">{review.initials}</div>
                      )}
                      <div className="review-author-info">
                        <span className="review-author-name">{review.author}</span>
                        {review.meta && (
                          <span className="review-author-meta">{review.meta}</span>
                        )}
                      </div>
                    </div>
                    {review.serviceTag && (
                      <span className="review-chip">{review.serviceTag}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="reviews-marquee-row reviews-marquee-row-2">
          <div className="marquee-track">
            {track2.map((review, i) => {
              const isDark = i % 3 === 0;
              return (
                <div
                  key={`r2-${review.author}-${i}`}
                  className={`review-card ${isDark ? 'is-dark' : ''}`}
                >
                  <div className="review-card-top">
                    <div className="review-stars" aria-label="5 stars">
                      ★★★★★
                    </div>
                    <Quote size={32} className="review-quote-icon" />
                  </div>
                  <p className="review-text">{review.text}</p>
                  <div className="review-footer">
                    <div className="review-author-wrap">
                      {review.initials && (
                        <div className="review-avatar">{review.initials}</div>
                      )}
                      <div className="review-author-info">
                        <span className="review-author-name">{review.author}</span>
                        {review.meta && (
                          <span className="review-author-meta">{review.meta}</span>
                        )}
                      </div>
                    </div>
                    {review.serviceTag && (
                      <span className="review-chip">{review.serviceTag}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
