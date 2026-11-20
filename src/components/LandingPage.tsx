import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  Compass,
  FastForward,
  Flame,
  HeartCrack,
  Play,
  ShieldCheck,
  X,
} from 'lucide-react';
import { LANDING_CONTENT } from '../data/landingContent.ts';
import { HeroChalkboard } from './HeroChalkboard.tsx';
import {
  NuMascot,
  StepOneDoodle,
  StepThreeDoodle,
  StepTwoDoodle,
} from './NuMascot.tsx';
import { ResultsSection } from './ResultsSection.tsx';
import {
  CrayonStar,
  RedPushpin,
  ScallopedEdge,
  SketchSmiley,
  StorybookCloud,
  StorybookMeadowBackdrop,
} from './StorybookDoodles.tsx';
import { TestimonialsSection } from './TestimonialsSection.tsx';
import { TryItWidget } from './TryItWidget.tsx';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [waitlistMessage, setWaitlistMessage] = useState('');

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      setWaitlistStatus('error');
      setWaitlistMessage('Please enter a valid email address.');
      return;
    }

    setWaitlistStatus('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWaitlistStatus('error');
        setWaitlistMessage(data.error || 'Could not join waitlist.');
        return;
      }
      setWaitlistStatus('success');
      setWaitlistMessage(
        data.message || "You're on the waitlist! Early-family perks are reserved."
      );
      setWaitlistEmail('');
    } catch {
      setWaitlistStatus('error');
      setWaitlistMessage('Network error — please try again in a moment.');
    }
  };

  const problemIcon = (icon: string) => {
    if (icon === 'heart-crack') return <HeartCrack className="w-6 h-6 text-[#FF6B57]" />;
    if (icon === 'fast-forward') return <FastForward className="w-6 h-6 text-[#5CB8FF]" />;
    return <Compass className="w-6 h-6 text-[#14342B]" />;
  };

  const bentoCardTheme = (accent: string) => {
    if (accent === 'chalkboard') {
      return 'bg-[#14342B] text-[#FFF8EC]';
    }
    if (accent === 'sunny') {
      return 'bg-[#FFFDF8] text-[#14342B]';
    }
    if (accent === 'sky') {
      return 'bg-[#eaf5ff] text-[#14342B]';
    }
    return 'bg-[#fff2ef] text-[#14342B]';
  };

  return (
    <main className="pb-16 md:pb-0">
      {/* 1. HERO: Storybook Periwinkle Sky + Fluffy Clouds + Scalloped Top + Rolling Meadow */}
      <section className="relative bg-[#C1D5F4] overflow-hidden">
        {/* Scalloped top cloud border */}
        <ScallopedEdge fill="#FFFDF8" className="w-full h-5 sm:h-7 block" />

        {/* Fluffy storybook clouds in background */}
        <StorybookCloud className="w-36 h-16 absolute top-12 left-6 opacity-90 hidden sm:block pointer-events-none" />
        <StorybookCloud className="w-44 h-20 absolute top-20 right-12 opacity-90 hidden lg:block pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-3 bg-[#FFFDF8] border-2 border-[#14342B] shadow-[3px_3px_0px_#14342B] rounded-full px-4 py-1.5">
                <NuMascot mood="waving" variant="ink" className="w-8 h-8 shrink-0" />
                <p className="text-sm font-bold text-[#14342B]">
                  Meet Nu · Adaptive tutor for ages 5–12
                </p>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.1] tracking-tight text-[#14342B] text-balance animate-chalk-write">
                Homework help that teaches your child to{' '}
                <span className="chalk-underline">think</span>, not just the answer.
              </h1>

              <p className="text-lg sm:text-xl text-[#14342B]/90 font-medium leading-relaxed max-w-xl">
                {LANDING_CONTENT.brand.subhead}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                <a
                  href="/signin"
                  onClick={(e) => handleNav(e, '/signin')}
                  className="sketch-btn inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-base hover:bg-[#f5bc28] transition-all whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14342B]"
                >
                  {LANDING_CONTENT.brand.primaryCta}
                </a>
                <a
                  href="/demo"
                  onClick={(e) => handleNav(e, '/demo')}
                  className="sketch-btn inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FFFDF8] text-[#14342B] font-bold text-base hover:bg-[#FFF8EC] transition-all whitespace-nowrap shrink-0 min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14342B]"
                >
                  <Play className="w-4 h-4 fill-[#14342B]" />
                  <span>{LANDING_CONTENT.brand.secondaryCta}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <HeroChalkboard />
            </div>
          </div>
        </div>

        {/* Rolling Storybook Meadow Backdrop at foot of Hero */}
        <StorybookMeadowBackdrop className="w-full h-24 sm:h-36 -mb-1 relative z-10 pointer-events-none" />

        {/* Trust strip sitting neatly on the cozy meadow */}
        <div className="bg-[#CFE09B] pb-8 pt-3 px-4 sm:px-6 border-b-2 border-[#14342B]/20 relative z-10">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-bold text-[#14342B]">
            {LANDING_CONTENT.brand.trustStrip.map((item, idx) => (
              <React.Fragment key={item}>
                <span>{item}</span>
                {idx < LANDING_CONTENT.brand.trustStrip.length - 1 && (
                  <span aria-hidden="true" className="text-[#FF6B57] font-bold">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM: Ruled Notebook Paper + Taped & Pinned Sketch Cards */}
      <section className="notebook-section py-16 sm:py-24 px-4 sm:px-6 border-b-2 border-[#14342B]/15">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12 relative">
            <SketchSmiley
              color="#FFC83D"
              className="w-10 h-10 absolute -top-5 -left-10 -rotate-12 hidden xl:block"
            />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {LANDING_CONTENT.problem.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {LANDING_CONTENT.problem.cards.map((card, idx) => (
              <article
                key={card.title}
                className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-200 relative"
              >
                {idx === 0 && (
                  <div
                    aria-hidden="true"
                    className="washi-tape-coral w-20 h-4 rounded-xs absolute -top-2 left-6 -rotate-3"
                  />
                )}
                {idx === 1 && (
                  <RedPushpin className="w-8 h-8 absolute -top-4 right-5" />
                )}
                {idx === 2 && (
                  <div
                    aria-hidden="true"
                    className="paper-tape w-20 h-4 rounded-xs absolute -top-2 right-6 rotate-3"
                  />
                )}

                <div className="w-12 h-12 rounded-2xl bg-[#FFF8EC] border-2 border-[#14342B] flex items-center justify-center mb-4">
                  {problemIcon(card.icon)}
                </div>
                <h3 className="font-display text-xl font-bold text-[#14342B] leading-snug">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-[15px] text-[#14342B]/85 leading-relaxed">
                  {card.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <p className="inline-block bg-[#FFC83D] border-2 border-[#14342B] shadow-[3px_3px_0px_#14342B] rounded-2xl px-6 py-3 font-display text-xl sm:text-2xl font-bold text-[#14342B] text-center">
              {LANDING_CONTENT.problem.closing}
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY NEURA: Cozy Meadow Sage Bento Layout */}
      <section id="why-neura" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#CFE09B] border-b-2 border-[#14342B]/20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12 relative">
            <CrayonStar
              color="#5CB8FF"
              className="w-10 h-10 absolute -top-5 -right-8 rotate-12 hidden md:block"
            />
            <p className="text-sm font-bold text-[#14342B] mb-2">Why Neura</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {LANDING_CONTENT.whyNeura.headline}
            </h2>
            <p className="mt-3 text-lg text-[#14342B]/85 font-medium">
              {LANDING_CONTENT.whyNeura.subhead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANDING_CONTENT.whyNeura.cards.map((card) => (
              <article
                key={card.title}
                className={`sketch-card rounded-3xl p-7 sm:p-8 hover:-translate-y-1 transition-transform duration-200 flex flex-col justify-between ${card.span} ${bentoCardTheme(card.accent)}`}
              >
                <div>
                  <p
                    className={`text-xs font-bold mb-3 ${
                      card.accent === 'chalkboard' ? 'text-[#FFC83D]' : 'text-[#FF6B57]'
                    }`}
                  >
                    {card.highlight}
                  </p>
                  <h3 className="font-display text-2xl font-bold leading-snug">{card.title}</h3>
                  <p
                    className={`mt-3 text-base leading-relaxed ${
                      card.accent === 'chalkboard' ? 'text-[#FFF8EC]/85' : 'text-[#14342B]/85'
                    }`}
                  >
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: Cream Sketchbook + Dotted Path + Chalkboard Worked Example */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FFF8EC] border-b-2 border-[#14342B]/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold text-[#FF6B57] mb-2">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {LANDING_CONTENT.howItWorks.headline}
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-14 left-[18%] right-[18%] border-t-3 border-dashed border-[#14342B]/35"
            />
            {LANDING_CONTENT.howItWorks.steps.map((step, idx) => (
              <div key={step.num} className="relative flex flex-col items-center text-center px-2">
                <div className="sketch-card relative z-10 mb-5 bg-[#FFFDF8] p-2.5 rounded-3xl">
                  {idx === 0 && <StepOneDoodle className="w-28 h-24" />}
                  {idx === 1 && <StepTwoDoodle className="w-28 h-24" />}
                  {idx === 2 && <StepThreeDoodle className="w-28 h-24" />}
                </div>
                <p className="text-xs font-bold text-[#FF6B57] tracking-wider mb-1">{step.num}</p>
                <h3 className="font-display text-xl font-bold text-[#14342B]">{step.title}</h3>
                <p className="mt-2 text-[15px] text-[#14342B]/85 leading-relaxed max-w-xs">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          {/* Worked example card */}
          <div className="mt-14 rounded-[28px] overflow-hidden border-[6px] border-[#6E4527] shadow-[5px_6px_0px_#14342B]">
            <div className="chalkboard-texture p-6 sm:p-8 text-[#FFF8EC]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <p className="text-xs font-bold text-[#FFC83D]">
                    {LANDING_CONTENT.howItWorks.workedExample.kicker}
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8EC]">
                    {LANDING_CONTENT.howItWorks.workedExample.routeText}
                  </h3>
                  <p className="text-base text-[#FFF8EC]/90 leading-relaxed">
                    {LANDING_CONTENT.howItWorks.workedExample.description}
                  </p>
                </div>
                <a
                  href="/signin"
                  onClick={(e) => handleNav(e, '/signin')}
                  className="sketch-btn inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FFC83D] text-[#14342B] font-bold hover:bg-[#f5bc28] transition-all whitespace-nowrap shrink-0 min-h-[44px]"
                >
                  Build your child&apos;s lesson
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TRY-IT WIDGET */}
      <TryItWidget onNavigate={onNavigate} />

      {/* 6. RESULTS / DATA */}
      <ResultsSection />

      {/* 7. PARENTS SAY */}
      <TestimonialsSection />

      {/* 8. SAFETY & PRIVACY */}
      <section id="safety" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#14342B] text-[#FFF8EC] border-b-2 border-[#14342B]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1D493D] border-2 border-[#FFC83D] flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-[#FFC83D]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EC] text-balance">
                {LANDING_CONTENT.safety.headline}
              </h2>
              <p className="text-base sm:text-lg text-[#FFF8EC]/85 leading-relaxed">
                {LANDING_CONTENT.safety.subhead}
              </p>
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="inline-flex items-center text-sm font-bold text-[#FFC83D] underline underline-offset-4 hover:text-[#FFF8EC] transition-colors py-2 focus-visible:outline-2 focus-visible:outline-[#FFC83D]"
              >
                {LANDING_CONTENT.safety.privacyNoteLink}
              </button>
            </div>

            <div className="lg:col-span-7 bg-[#1D493D] rounded-3xl border-2 border-dashed border-[#FFF8EC]/35 p-6 sm:p-8">
              <ul className="space-y-4">
                {LANDING_CONTENT.safety.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3.5 text-base sm:text-lg">
                    <span className="w-6 h-6 rounded-full bg-[#FFC83D] text-[#14342B] border-2 border-[#14342B] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <span className="text-[#FFF8EC]/95">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PARENT DASHBOARD PREVIEW: Storybook Sky Backdrop + Sketchbook Card */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#C1D5F4] border-b-2 border-[#14342B]/20 relative overflow-hidden">
        <StorybookCloud className="w-36 h-16 absolute top-10 right-10 opacity-85 hidden md:block pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold text-[#14342B] mb-2">Parent dashboard preview</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {LANDING_CONTENT.dashboardPreview.headline}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#14342B]/85 font-medium">
              {LANDING_CONTENT.dashboardPreview.subhead}
            </p>
          </div>

          <div className="sketch-card bg-[#FFFDF8] rounded-3xl p-5 sm:p-8 relative">
            <div
              aria-hidden="true"
              className="washi-tape-sky w-24 h-5 rounded-xs absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-1"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b-2 border-dashed border-[#14342B]/15">
              <div>
                <p className="text-xs font-bold text-[#FF6B57]">Child learning view</p>
                <h3 className="font-display text-2xl font-bold text-[#14342B]">
                  {LANDING_CONTENT.dashboardPreview.childName} · Grade 3
                </h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8EC] border-2 border-[#14342B]">
                <Flame className="w-5 h-5 text-[#FF6B57]" />
                <span className="font-display font-bold text-[#14342B] tabular-nums">
                  {LANDING_CONTENT.dashboardPreview.streakDays}-day streak
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff2ef] border-2 border-[#FF6B57] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm sm:text-base font-semibold text-[#14342B]">
                {LANDING_CONTENT.dashboardPreview.alertNote}
              </p>
              <a
                href="/signin"
                onClick={(e) => handleNav(e, '/signin')}
                className="text-sm font-bold text-[#14342B] underline underline-offset-4 shrink-0"
              >
                Open live dashboard
              </a>
            </div>

            <div className="mt-5 divide-y-2 divide-dashed divide-[#14342B]/12">
              {LANDING_CONTENT.dashboardPreview.topics.map((row) => {
                const statusStyles =
                  row.status === 'Clicking'
                    ? 'bg-[#CFE09B] text-[#14342B]'
                    : row.status === 'Getting there'
                      ? 'bg-[#C1D5F4] text-[#14342B]'
                      : 'bg-[#ffd8d1] text-[#14342B]';

                return (
                  <div
                    key={row.topic}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-[#14342B]">
                        {row.subject} · {row.topic}
                      </p>
                      <p className="text-sm text-[#14342B]/80">{row.methodInsight}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3.5 py-1 rounded-full border-2 border-[#14342B] text-xs font-bold w-fit ${statusStyles}`}
                    >
                      {row.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 10. PRICING & 11. FAQ on Cozy Meadow Sage + Ruled Paper */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#CFE09B] border-b-2 border-[#14342B]/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B] text-balance">
              {LANDING_CONTENT.pricing.headline}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#14342B]/85 font-medium">
              {LANDING_CONTENT.pricing.subhead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 sketch-card bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm font-bold text-[#FF6B57]">
                  {LANDING_CONTENT.pricing.planName}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-[#14342B] tabular-nums">
                    {LANDING_CONTENT.pricing.price}
                  </span>
                  <span className="text-sm font-medium text-[#14342B]/75">
                    {LANDING_CONTENT.pricing.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {LANDING_CONTENT.pricing.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm sm:text-base text-[#14342B]">
                      <Check className="w-5 h-5 text-[#14342B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="/signin"
                onClick={(e) => handleNav(e, '/signin')}
                className="sketch-btn mt-8 w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold hover:bg-[#f5bc28] transition-all min-h-[48px]"
              >
                Start free now
              </a>
            </div>

            <div className="md:col-span-5 sketch-card bg-[#FFF8EC] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative">
              <RedPushpin className="w-8 h-8 absolute -top-4 right-5" />
              <div>
                <h3 className="font-display text-xl font-bold text-[#14342B]">
                  Early-family waitlist
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#14342B]/85 leading-relaxed">
                  {LANDING_CONTENT.pricing.waitlistPrompt}
                </p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="mt-6 space-y-3" noValidate>
                <label htmlFor="waitlist-email" className="block text-xs font-bold text-[#14342B]">
                  Parent email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#14342B] bg-[#FFFDF8] text-[#14342B] placeholder:text-[#14342B]/45 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
                />
                <button
                  type="submit"
                  disabled={waitlistStatus === 'submitting'}
                  className="sketch-btn w-full py-3 rounded-full bg-[#C1D5F4] text-[#14342B] font-bold hover:bg-[#b0c9f0] transition-colors min-h-[44px] disabled:opacity-60"
                >
                  {waitlistStatus === 'submitting' ? 'Saving...' : 'Join waitlist'}
                </button>
                {waitlistMessage && (
                  <p
                    role="status"
                    className={`text-sm font-semibold ${
                      waitlistStatus === 'error' ? 'text-[#c93b29]' : 'text-[#14342B]'
                    }`}
                  >
                    {waitlistMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ: Clean horizontal-divider accordion on Ruled Paper (like reference 1) */}
      <section id="faq" className="notebook-section py-16 sm:py-24 px-4 sm:px-6 border-b-2 border-[#14342B]/15">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-[#FF6B57] mb-2">FAQ</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#14342B]">
              Questions parents ask us
            </h2>
          </div>

          <div className="sketch-card bg-[#FFFDF8] rounded-3xl px-5 sm:px-8 py-2 divide-y-2 divide-[#14342B]/15">
            {LANDING_CONTENT.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 text-left flex items-center justify-between gap-4 font-display text-lg font-bold text-[#14342B] hover:text-[#1D493D] transition-colors min-h-[56px]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 text-[15px] text-[#14342B]/85 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA: Chalkboard Green Stage */}
      <section className="chalkboard-texture py-16 sm:py-24 px-4 sm:px-6 text-[#FFF8EC]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <NuMascot mood="waving" variant="chalk" className="w-24 h-24" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#FFF8EC] text-balance">
            {LANDING_CONTENT.finalCta.headline}
          </h2>
          <div>
            <a
              href="/signin"
              onClick={(e) => handleNav(e, '/signin')}
              className="sketch-btn inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-lg hover:bg-[#f5bc28] transition-all min-h-[52px]"
            >
              {LANDING_CONTENT.finalCta.buttonText}
            </a>
          </div>
          <p className="text-sm sm:text-base text-[#FFF8EC]/85">
            {LANDING_CONTENT.finalCta.subtext}
          </p>
        </div>
      </section>

      {/* 13. FOOTER */}
      <footer className="bg-[#FFFDF8] border-t-2 border-[#14342B]/15 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <NuMascot mood="happy" variant="chalk" className="w-8 h-8 rounded-lg p-0.5 bg-[#14342B]" />
            <span className="font-display text-xl font-bold text-[#14342B]">Neura</span>
          </div>

          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-[#14342B]/85">
            {LANDING_CONTENT.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#14342B] hover:underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-sm font-medium text-[#14342B]/75">{LANDING_CONTENT.footer.credit}</p>
        </div>
      </footer>

      {/* Privacy Note Modal */}
      {privacyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 bg-[#14342B]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="sketch-card notebook-paper text-[#14342B] rounded-3xl max-w-lg w-full p-6 sm:p-8 pl-14 relative">
            <div className="flex items-start justify-between gap-4">
              <h3 id="privacy-modal-title" className="font-display text-2xl font-bold">
                {LANDING_CONTENT.safety.privacyModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                aria-label="Close privacy note"
                className="w-10 h-10 rounded-xl border-2 border-[#14342B] bg-white flex items-center justify-center hover:bg-[#FFF8EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm sm:text-base text-[#14342B]/90 leading-relaxed">
              {LANDING_CONTENT.safety.privacyModal.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="sketch-btn px-5 py-2.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
