import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import {
  CURRICULA,
  GRADES,
  INTERESTS,
  LEARNING_METHODS,
  type ChildProfile,
  type CurriculumId,
  type GradeId,
  type InterestId,
  type MethodId,
} from '../types/neura.ts';
import { getLocalizedGradeLabel, suggestGradeFromAge } from '../data/curriculumMap.ts';
import { saveChildProfile } from '../utils/storage.ts';
import { NuMascot } from './NuMascot.tsx';
import { CrayonStar, RedPushpin, ScallopedEdge } from './StorybookDoodles.tsx';

interface OnboardingPageProps {
  existingProfile: ChildProfile | null;
  onComplete: (profile: ChildProfile) => void;
  onBack: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  existingProfile,
  onComplete,
  onBack,
}) => {
  const [childName, setChildName] = useState(existingProfile?.childName ?? '');
  const [age, setAge] = useState<number>(existingProfile?.age ?? 8);
  const [curriculum, setCurriculum] = useState<CurriculumId>(
    existingProfile?.curriculum ?? 'US Common Core'
  );
  const [grade, setGrade] = useState<GradeId>(existingProfile?.grade ?? 'Grade 3');
  const [interests, setInterests] = useState<InterestId[]>(
    existingProfile?.interests ?? ['Dinosaurs', 'Space']
  );
  const [methods, setMethods] = useState<MethodId[]>(
    existingProfile?.methods ?? ['Stories', 'Games and challenges']
  );
  const [error, setError] = useState<string>('');

  const handleAgeSelect = (newAge: number) => {
    setAge(newAge);
    if (!existingProfile) {
      setGrade(suggestGradeFromAge(newAge));
    }
  };

  const toggleInterest = (item: InterestId) => {
    setError('');
    setInterests((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((i) => i !== item) : prev;
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });
  };

  const toggleMethod = (item: MethodId) => {
    setError('');
    setMethods((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((m) => m !== item) : prev;
      }
      if (prev.length >= 2) {
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = childName.trim() || 'Explorer';
    if (interests.length === 0) {
      setError('Pick at least 1 interest so Nu can personalise lessons.');
      return;
    }
    if (methods.length === 0) {
      setError('Pick at least 1 learning method.');
      return;
    }

    const now = new Date().toISOString();
    const profile: ChildProfile = {
      id: existingProfile?.id ?? `child-${Date.now()}`,
      childName: cleanName,
      age,
      grade,
      curriculum,
      interests,
      methods,
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    };

    saveChildProfile(profile);
    onComplete(profile);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#C1D5F4] pb-14">
      <ScallopedEdge fill="#FFFDF8" className="w-full h-5 sm:h-7 block" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="sketch-btn inline-flex items-center gap-2 text-sm font-bold text-[#14342B] bg-[#FFFDF8] px-4 py-2 rounded-full mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </button>

        <div className="sketch-card notebook-paper rounded-3xl p-6 sm:p-10 pl-14 sm:pl-16 relative">
          <RedPushpin className="w-9 h-9 absolute -top-4 right-7 hidden sm:block" />
          <CrayonStar
            color="#FFC83D"
            className="w-10 h-10 absolute -bottom-5 -left-5 -rotate-12 hidden sm:block"
          />

          <div className="flex items-start gap-4 pb-6 border-b-2 border-dashed border-[#14342B]/15">
            <NuMascot
              mood="happy"
              variant="chalk"
              className="w-16 h-16 rounded-2xl p-1.5 bg-[#14342B] border-2 border-[#14342B] shrink-0"
            />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14342B]">
                {existingProfile
                  ? `Update ${existingProfile.childName}'s profile`
                  : 'Set up your child’s profile in 60 seconds'}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-[#14342B]/85 font-medium">
                Saved right in your browser. You can change any setting for a single lesson later.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-2">
              <label htmlFor="child-name" className="block text-sm font-bold text-[#14342B]">
                Child&apos;s first name or nickname
              </label>
              <input
                id="child-name"
                type="text"
                maxLength={30}
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="e.g. Maya"
                className="w-full max-w-sm px-4 py-3 rounded-2xl border-2 border-[#14342B] bg-[#FFFDF8] text-[#14342B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
              />
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#14342B]/75">
                <ShieldCheck className="w-4 h-4 text-[#14342B]" />
                <span>Stays strictly in your browser — never sent to the AI lesson generator.</span>
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <span className="block text-sm font-bold text-[#14342B] mb-2.5">
                  Age (controls tone &amp; step count)
                </span>
                <div className="flex flex-wrap gap-2">
                  {[5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAgeSelect(a)}
                      className={`w-11 h-11 rounded-full font-display font-bold text-base border-2 border-[#14342B] transition-all ${
                        age === a
                          ? 'bg-[#14342B] text-[#FFC83D] shadow-[2px_2px_0px_#FFC83D]'
                          : 'bg-[#FFFDF8] text-[#14342B] hover:bg-[#CFE09B]/50'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="curriculum-select" className="block text-sm font-bold text-[#14342B] mb-2">
                    Country / Curriculum
                  </label>
                  <select
                    id="curriculum-select"
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value as CurriculumId)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#14342B] bg-[#FFFDF8] text-[#14342B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
                  >
                    {CURRICULA.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="grade-select" className="block text-sm font-bold text-[#14342B] mb-2">
                    Grade level (controls academic content)
                  </label>
                  <select
                    id="grade-select"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeId)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#14342B] bg-[#FFFDF8] text-[#14342B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {getLocalizedGradeLabel(curriculum, g)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2 mb-2.5">
                <span className="text-sm font-bold text-[#14342B]">
                  Interests (pick up to 3)
                </span>
                <span className="text-xs font-bold text-[#FF6B57] tabular-nums">
                  {interests.length} / 3 selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      aria-pressed={selected}
                      className={`px-3.5 py-2.5 rounded-2xl text-sm font-bold text-left flex items-center justify-between gap-2 border-2 border-[#14342B] transition-all min-h-[44px] ${
                        selected
                          ? 'bg-[#FFC83D] text-[#14342B] shadow-[2px_2px_0px_#14342B]'
                          : 'bg-[#FFFDF8] text-[#14342B] hover:bg-[#CFE09B]/40'
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {selected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2 mb-2.5">
                <span className="text-sm font-bold text-[#14342B]">
                  How they learn best (pick up to 2)
                </span>
                <span className="text-xs font-bold text-[#FF6B57] tabular-nums">
                  {methods.length} / 2 selected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {LEARNING_METHODS.map((method) => {
                  const selected = methods.includes(method);
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => toggleMethod(method)}
                      aria-pressed={selected}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold text-left flex items-center justify-between gap-2 border-2 border-[#14342B] transition-all min-h-[44px] ${
                        selected
                          ? 'bg-[#14342B] text-[#FFFDF8] shadow-[2px_2px_0px_#FFC83D]'
                          : 'bg-[#FFFDF8] text-[#14342B] hover:bg-[#C1D5F4]/40'
                      }`}
                    >
                      <span>{method}</span>
                      {selected && <Check className="w-4 h-4 text-[#FFC83D] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm font-bold text-[#c93b29]">
                {error}
              </p>
            )}

            <div className="pt-4 border-t-2 border-dashed border-[#14342B]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-medium text-[#14342B]/75">
                Default profile saved in your browser. Override anytime per lesson.
              </p>
              <button
                type="submit"
                className="sketch-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-base hover:bg-[#f5bc28] transition-all min-h-[48px]"
              >
                <span>{existingProfile ? 'Save & open dashboard' : 'Save profile & pick a lesson'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
