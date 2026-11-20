import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { LANDING_CONTENT } from '../data/landingContent.ts';
import { RedPushpin, SketchSmiley } from './StorybookDoodles.tsx';

export const TestimonialsSection: React.FC = () => {
  const [mobileIdx, setMobileIdx] = useState(0);
  const { headline, caption, items } = LANDING_CONTENT.testimonials;

  const prev = () => setMobileIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setMobileIdx((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <section id="parents-say" className="notebook-section py-16 sm:py-24 px-4 sm:px-6 border-b-2 border-[#14342B]/15">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="relative">
            <SketchSmiley
              color="#FFC83D"
              className="w-10 h-10 absolute -top-6 -left-10 -rotate-12 hidden xl:block"
            />
            <p className="text-sm font-bold text-[#FF6B57] mb-2">{caption}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {headline}
            </h2>
          </div>

          {/* Mobile Carousel Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="sketch-btn w-11 h-11 rounded-full bg-[#FFFDF8] flex items-center justify-center text-[#14342B]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-[#14342B] tabular-nums px-2">
              {mobileIdx + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="sketch-btn w-11 h-11 rounded-full bg-[#FFFDF8] flex items-center justify-center text-[#14342B]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden">
          {(() => {
            const t = items[mobileIdx];
            return (
              <article className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 relative">
                <div
                  aria-hidden="true"
                  className="paper-tape w-20 h-4 rounded-xs absolute -top-2 left-6 -rotate-3"
                />
                <div className="flex items-center gap-1 text-[#FFC83D] mb-4" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#FFC83D] text-[#14342B]" />
                  ))}
                </div>
                <blockquote className="text-base font-medium text-[#14342B] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-[#14342B] flex items-center justify-center font-display font-bold text-sm shrink-0"
                    style={{
                      backgroundColor: t.color,
                      color: t.color === '#FFC83D' || t.color === '#5CB8FF' ? '#14342B' : '#FFF8EC',
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#14342B]">{t.author}</p>
                    <p className="text-xs text-[#14342B]/75">{t.role}</p>
                  </div>
                </div>
              </article>
            );
          })()}
        </div>

        {/* Desktop 3-Column Grid */}
        <div className="hidden md:grid grid-cols-3 gap-7">
          {items.map((t, idx) => (
            <article
              key={t.author}
              className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-200 flex flex-col justify-between relative"
            >
              {idx % 2 === 0 ? (
                <div
                  aria-hidden="true"
                  className="washi-tape-coral w-20 h-4 rounded-xs absolute -top-2 left-6 -rotate-3"
                />
              ) : (
                <RedPushpin className="w-7 h-7 absolute -top-3.5 right-6" />
              )}

              <div>
                <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#FFC83D] text-[#14342B]" />
                  ))}
                </div>
                <blockquote className="text-[15px] font-medium text-[#14342B] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#14342B]/15 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-[#14342B] flex items-center justify-center font-display font-bold text-sm shrink-0"
                  style={{
                    backgroundColor: t.color,
                    color: t.color === '#FFC83D' || t.color === '#5CB8FF' ? '#14342B' : '#FFF8EC',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#14342B]">{t.author}</p>
                  <p className="text-xs text-[#14342B]/75">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
