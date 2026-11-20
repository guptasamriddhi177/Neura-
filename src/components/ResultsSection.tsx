import React, { useEffect, useRef, useState } from 'react';
import { LANDING_CONTENT } from '../data/landingContent.ts';
import { CrayonStar } from './StorybookDoodles.tsx';

export const ResultsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setProgress(1);
      setHasAnimated(true);
      return;
    }

    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const duration = 850;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          setProgress(0.15);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const { headline, stats, confidenceChart, footnote } = LANDING_CONTENT.results;

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-4 sm:px-6 bg-[#CFE09B] border-b-2 border-[#14342B]/20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12 relative">
          <CrayonStar
            color="#FFC83D"
            className="w-9 h-9 absolute -top-5 -left-6 -rotate-12 hidden lg:block"
          />
          <p className="text-sm font-bold text-[#14342B] mb-2">Early pilot signals</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
            {headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 4 Metric Cards */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat) => {
              const displayValue = Math.max(1, Math.round(stat.value * progress));
              return (
                <div
                  key={stat.label}
                  className="sketch-card bg-[#FFFDF8] rounded-3xl p-5 sm:p-6 flex flex-col justify-between"
                >
                  <p className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] tabular-nums">
                    {displayValue}
                    <span className="text-[#FF6B57]">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm sm:text-base font-medium text-[#14342B]/85 leading-snug">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Simple Bar Chart: Confidence before vs after */}
          <div className="lg:col-span-5 sketch-card chalkboard-texture text-[#FFF8EC] rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-xl font-bold text-[#FFF8EC]">
                {confidenceChart.title}
              </h3>
              <p className="text-sm text-[#FFF8EC]/80 mt-1">
                Percentage of parents reporting calm, independent homework sessions
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#FFF8EC]/85">{confidenceChart.beforeLabel}</span>
                  <span className="font-semibold tabular-nums text-[#FFF8EC]">
                    {Math.round(confidenceChart.beforeValue * progress)}%
                  </span>
                </div>
                <div className="h-5 w-full rounded-full bg-[#FFF8EC]/15 overflow-hidden border border-[#FFF8EC]/20">
                  <div
                    className="h-full rounded-full bg-[#FF6B57] transition-all duration-300"
                    style={{ width: `${Math.round(confidenceChart.beforeValue * progress)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-[#FFC83D]">{confidenceChart.afterLabel}</span>
                  <span className="font-bold tabular-nums text-[#FFC83D]">
                    {Math.round(confidenceChart.afterValue * progress)}%
                  </span>
                </div>
                <div className="h-5 w-full rounded-full bg-[#FFF8EC]/15 overflow-hidden border border-[#FFF8EC]/20">
                  <div
                    className="h-full rounded-full bg-[#FFC83D] transition-all duration-300"
                    style={{ width: `${Math.round(confidenceChart.afterValue * progress)}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#FFF8EC]/75">{footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
