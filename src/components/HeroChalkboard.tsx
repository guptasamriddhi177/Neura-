import React, { useEffect, useState } from 'react';
import { NuMascot } from './NuMascot.tsx';
import { CrayonStar } from './StorybookDoodles.tsx';

export const HeroChalkboard: React.FC = () => {
  const [phase, setPhase] = useState<number>(6);
  const fullAnswer = '2 eggs per nest';

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPhase(6);
      return;
    }

    setPhase(0);
    const interval = window.setInterval(() => {
      setPhase((prev) => (prev >= 8 ? 0 : prev + 1));
    }, 850);

    return () => window.clearInterval(interval);
  }, []);

  const typedLength =
    phase === 0 ? 0 : phase >= 5 ? fullAnswer.length : Math.min(fullAnswer.length, phase * 4);
  const typedText = fullAnswer.slice(0, typedLength);
  const showNuReaction = phase >= 6;

  return (
    <div className="relative">
      {/* Decorative hand-drawn crayon star sticker */}
      <CrayonStar
        color="#FFC83D"
        className="w-11 h-11 absolute -top-5 -right-3 z-10 rotate-12 hidden sm:block"
      />

      <div
        className="rounded-[28px] overflow-hidden border-[6px] border-[#6E4527] shadow-[6px_8px_0px_#14342B] bg-[#14342B] relative"
        aria-label="Animated chalkboard lesson preview showing a dinosaur fraction question"
      >
        <div className="chalkboard-texture p-5 sm:p-7 text-[#FFF8EC]">
          {/* Chalkboard top header */}
          <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-[#FFF8EC]/15">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#FFF8EC]/85 font-semibold">
              <span className="text-[#FFC83D]">Maths</span>
              <span aria-hidden="true">·</span>
              <span>Fractions</span>
              <span aria-hidden="true">·</span>
              <span>Dinosaurs</span>
            </div>
            <span className="text-xs font-bold text-[#5CB8FF]">Step 2 of 5</span>
          </div>

          {/* Dino Egg Nest Diagram */}
          <div className="mt-4 rounded-2xl chalk-frame bg-[#0f2922]/75 p-4">
            <p className="text-xs uppercase tracking-wider text-[#FFF8EC]/75 font-semibold mb-3">
              Nu&apos;s Dino Egg Nest
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[1, 2, 3, 4].map((nest) => (
                <div
                  key={nest}
                  className="rounded-xl border border-dashed border-[#FFF8EC]/35 bg-[#14342B]/85 p-2.5 text-center"
                >
                  <div className="text-[11px] text-[#FFF8EC]/75 mb-1.5">Nest {nest}</div>
                  <div className="flex items-center justify-center gap-1.5 min-h-[24px]">
                    {showNuReaction || phase >= 3 ? (
                      <>
                        <span
                          className="inline-block w-4 h-5 rounded-full bg-[#FFFDF8] border-2 border-[#FFC83D]"
                          title="Dino egg"
                        />
                        <span
                          className="inline-block w-4 h-5 rounded-full bg-[#FFFDF8] border-2 border-[#FFC83D]"
                          title="Dino egg"
                        />
                      </>
                    ) : (
                      <span className="text-xs text-[#FFC83D]/70">?</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="mt-4 space-y-3">
            <p className="font-display text-lg sm:text-xl leading-snug text-[#FFF8EC]">
              &ldquo;We have <span className="text-[#FFC83D]">8 dino eggs</span> to share fairly
              across <span className="text-[#5CB8FF]">4 warm nests</span>. How many eggs go in each
              nest?&rdquo;
            </p>

            {/* Simulated child input */}
            <div className="rounded-xl bg-[#0e261f] border-2 border-[#FFF8EC]/25 px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm sm:text-base font-medium min-h-[24px]">
                <span className="text-[#FFF8EC]/65 text-xs uppercase tracking-wide">Your answer:</span>
                <span className="text-[#FFC83D] font-bold">
                  {typedText || <span className="text-[#FFF8EC]/40">Thinking...</span>}
                </span>
                {phase > 0 && phase < 5 && (
                  <span className="inline-block w-0.5 h-5 bg-[#FFC83D] animate-pulse" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs text-[#FFF8EC]/80 font-semibold shrink-0">
                {phase >= 5 ? 'Checked ✓' : 'Typing'}
              </span>
            </div>
          </div>

          {/* Nu Socratic Reaction */}
          <div
            className={`mt-4 flex items-center gap-3.5 rounded-2xl p-3.5 bg-[#1D493D] border-2 border-[#FFC83D]/55 transition-all duration-300 ${
              showNuReaction ? 'opacity-100 translate-y-0' : 'opacity-45 translate-y-1'
            }`}
          >
            <NuMascot
              mood={showNuReaction ? 'cheering' : 'thinking'}
              variant="chalk"
              className="w-12 h-12 shrink-0"
            />
            <div>
              <p className="font-display text-base sm:text-lg text-[#FFC83D]">
                {showNuReaction ? 'Great thinking!' : 'Nu is listening...'}
              </p>
              <p className="text-xs sm:text-sm text-[#FFF8EC]/90">
                {showNuReaction
                  ? 'You split 8 into 4 equal groups — 2 eggs per nest is 1/4 of 8!'
                  : 'Take your time — count out 1 egg per nest first if you like.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tiny wooden chalk tray */}
        <div
          aria-hidden="true"
          className="h-4 bg-gradient-to-b from-[#8A5833] to-[#5E371D] border-t border-[#a36f47] px-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-1.5 rounded-full bg-[#FFF8EC]" />
            <span className="w-5 h-1.5 rounded-full bg-[#FFC83D]" />
            <span className="w-5 h-1.5 rounded-full bg-[#5CB8FF]" />
          </div>
          <div className="w-10 h-2.5 rounded-xs bg-[#2b221c]" />
        </div>
      </div>
    </div>
  );
};
