import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import {
  TRY_IT_AGES,
  TRY_IT_INTERESTS,
  TRY_IT_SCENARIOS,
  type TryItAgeBand,
  type TryItInterest,
} from '../data/landingContent.ts';
import { NuMascot } from './NuMascot.tsx';
import { CrayonStar, RedPushpin } from './StorybookDoodles.tsx';

interface TryItWidgetProps {
  onNavigate: (path: string) => void;
}

export const TryItWidget: React.FC<TryItWidgetProps> = ({ onNavigate }) => {
  const [selectedAge, setSelectedAge] = useState<TryItAgeBand>('7-8');
  const [selectedInterest, setSelectedInterest] = useState<TryItInterest>('Dinosaurs');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  const scenario = TRY_IT_SCENARIOS[selectedAge][selectedInterest];
  const chosenOption = selectedOptionIdx !== null ? scenario.options[selectedOptionIdx] : null;

  const handleAgeChange = (age: TryItAgeBand) => {
    setSelectedAge(age);
    setSelectedOptionIdx(null);
  };

  const handleInterestChange = (interest: TryItInterest) => {
    setSelectedInterest(interest);
    setSelectedOptionIdx(null);
  };

  return (
    <section id="try-it" className="notebook-section py-16 sm:py-24 px-4 sm:px-6 border-y-2 border-[#14342B]/15">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 relative">
          <CrayonStar
            color="#5CB8FF"
            className="w-10 h-10 absolute -top-4 left-6 sm:left-16 -rotate-12 hidden sm:block"
          />
          <p className="text-sm font-bold text-[#FF6B57] mb-2">Interactive sample</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
            Try a Socratic question right now
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#14342B]/85">
            Pick an age and an interest — no signup needed. See how Nu guides thinking instead of
            handing over answers.
          </p>
        </div>

        <div className="sketch-card bg-[#FFFDF8] rounded-3xl p-5 sm:p-8 space-y-6 relative">
          <RedPushpin className="w-9 h-9 absolute -top-4 right-8 hidden sm:block" />

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm font-bold text-[#14342B] mb-2.5">
                1. Pick an age
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Child age band">
                {TRY_IT_AGES.map((age) => {
                  const active = selectedAge === age;
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleAgeChange(age)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 min-h-[44px] border-2 border-[#14342B] ${
                        active
                          ? 'bg-[#14342B] text-[#FFFDF8] shadow-[2px_2px_0px_#FFC83D]'
                          : 'bg-[#FFF8EC] text-[#14342B] hover:bg-[#CFE09B]/40'
                      }`}
                    >
                      Ages {age}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-sm font-bold text-[#14342B] mb-2.5">
                2. Pick an interest
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Child interest">
                {TRY_IT_INTERESTS.map((interest) => {
                  const active = selectedInterest === interest.id;
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestChange(interest.id)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap shrink-0 min-h-[44px] border-2 border-[#14342B] ${
                        active
                          ? 'bg-[#FFC83D] text-[#14342B] shadow-[2px_2px_0px_#14342B]'
                          : 'bg-[#FFF8EC] text-[#14342B] hover:bg-[#C1D5F4]/40'
                      }`}
                    >
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Chalkboard Stage */}
          <div className="rounded-3xl overflow-hidden border-[6px] border-[#6E4527] shadow-[4px_5px_0px_#14342B]">
            <div className="chalkboard-texture p-5 sm:p-7 text-[#FFF8EC]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#FFF8EC]/85 pb-3 border-b border-[#FFF8EC]/15">
                <span>
                  Ages {selectedAge} · {selectedInterest} · {scenario.topicTag}
                </span>
                <span className="text-[#FFC83D] font-bold">Tap an answer to test Nu</span>
              </div>

              <div className="mt-4 rounded-xl chalk-frame bg-[#0f2922]/80 px-4 py-3 font-semibold text-sm sm:text-base text-[#5CB8FF]">
                {scenario.chalkSketch}
              </div>

              <p className="mt-5 font-display text-xl sm:text-2xl leading-snug text-[#FFF8EC]">
                {scenario.prompt}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3">
                {scenario.options.map((opt, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  let stateClass =
                    'bg-[#1D493D] border-[#FFF8EC]/25 text-[#FFF8EC] hover:border-[#FFC83D] hover:-translate-y-0.5';
                  if (isSelected && opt.isCorrect) {
                    stateClass = 'bg-[#1D493D] border-[#FFC83D] ring-2 ring-[#FFC83D] text-[#FFF8EC]';
                  } else if (isSelected && !opt.isCorrect) {
                    stateClass = 'bg-[#2f2726] border-[#FF6B57] ring-2 ring-[#FF6B57] text-[#FFF8EC]';
                  }

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedOptionIdx(idx)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 border-b-4 font-semibold text-base transition-all min-h-[48px] flex items-center justify-between gap-3 ${stateClass}`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#FFC83D] shrink-0" />
                      )}
                      {isSelected && !opt.isCorrect && (
                        <HelpCircle className="w-5 h-5 text-[#FF6B57] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Nu Feedback */}
              {chosenOption && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mt-5 rounded-2xl p-4 flex items-start gap-3.5 border-2 ${
                    chosenOption.isCorrect
                      ? 'bg-[#1D493D] border-[#FFC83D]'
                      : 'bg-[#253731] border-[#5CB8FF]'
                  }`}
                >
                  <NuMascot
                    mood={chosenOption.isCorrect ? 'cheering' : 'thinking'}
                    variant="chalk"
                    className="w-12 h-12 shrink-0"
                  />
                  <div>
                    <p className="font-display text-base font-bold text-[#FFC83D]">
                      {chosenOption.isCorrect ? 'Nu says: Spot on!' : 'Nu gives a gentle nudge:'}
                    </p>
                    <p className="text-sm sm:text-base text-[#FFF8EC]/95 mt-0.5">
                      {chosenOption.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Closing CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-dashed border-[#14342B]/15">
            <p className="text-base font-bold text-[#14342B]">
              Want lessons like this for your child?
            </p>
            <a
              href="/signin"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/signin');
              }}
              className="sketch-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFC83D] text-[#14342B] font-bold hover:bg-[#f5bc28] transition-all whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Start free</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
