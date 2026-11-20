import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Code2,
  Compass,
  FlaskConical,
  Flame,
  HeartHandshake,
  Loader2,
  Pencil,
  Sparkles,
  Volume2,
} from 'lucide-react';
import topicsData from '../data/topics.json';
import { getLocalizedGradeLabel } from '../data/curriculumMap.ts';
import {
  GRADES,
  INTERESTS,
  LEARNING_METHODS,
  SUBJECTS,
  type ChildProfile,
  type DifficultyLevel,
  type GradeId,
  type InterestId,
  type LessonOutput,
  type LessonProgressRecord,
  type LessonRequest,
  type MethodId,
  type SubjectId,
  type TopicItem,
} from '../types/neura.ts';
import { computeParentInsights } from '../utils/storage.ts';
import { NuMascot } from './NuMascot.tsx';
import { RedPushpin, ScallopedEdge } from './StorybookDoodles.tsx';

interface DashboardPageProps {
  profile: ChildProfile;
  history: LessonProgressRecord[];
  onEditProfile: () => void;
  onStartLesson: (
    lesson: LessonOutput,
    request: LessonRequest,
    source: 'ai' | 'fallback'
  ) => void;
}

const TOPICS_BY_SUBJECT = topicsData as Record<SubjectId, Record<GradeId, TopicItem[]>>;

const SUBJECT_META: Record<SubjectId, { icon: React.ReactNode; subtitle: string }> = {
  Maths: {
    icon: <Calculator className="w-5 h-5" />,
    subtitle: 'Numbers, fractions, geometry',
  },
  'English/Reading': {
    icon: <BookOpen className="w-5 h-5" />,
    subtitle: 'Comprehension, writing, stories',
  },
  Phonics: {
    icon: <Volume2 className="w-5 h-5" />,
    subtitle: 'Sounds, blending, spelling rules',
  },
  Science: {
    icon: <FlaskConical className="w-5 h-5" />,
    subtitle: 'Predict, observe, explain',
  },
  'Social Studies': {
    icon: <Compass className="w-5 h-5" />,
    subtitle: 'Maps, history, communities',
  },
  'Coding basics': {
    icon: <Code2 className="w-5 h-5" />,
    subtitle: 'Logic, loops, debugging',
  },
  'Life skills': {
    icon: <HeartHandshake className="w-5 h-5" />,
    subtitle: 'Focus, money, empathy',
  },
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  history,
  onEditProfile,
  onStartLesson,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('Maths');
  const [lessonGrade, setLessonGrade] = useState<GradeId>(profile.grade);
  const [lessonInterests, setLessonInterests] = useState<InterestId[]>(
    profile.interests.slice(0, 2)
  );
  const [lessonMethods, setLessonMethods] = useState<MethodId[]>(
    profile.methods.slice(0, 2)
  );

  const availableTopics = useMemo(() => {
    return TOPICS_BY_SUBJECT[selectedSubject]?.[lessonGrade] ?? [];
  }, [selectedSubject, lessonGrade]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    () => availableTopics[0]?.id ?? ''
  );
  const activeTopic = useMemo(() => {
    return (
      availableTopics.find((t) => t.id === selectedTopicId) ??
      availableTopics[0] ?? {
        id: 'custom',
        title: 'Foundations',
        description: 'Core practice',
        difficulty: 'Core' as DifficultyLevel,
      }
    );
  }, [availableTopics, selectedTopicId]);

  const [specificNeed, setSpecificNeed] = useState('');
  const [overridePanel, setOverridePanel] = useState<
    null | 'grade' | 'interests' | 'methods'
  >(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildError, setBuildError] = useState('');

  const [filterSubject, setFilterSubject] = useState<'All' | SubjectId>('All');
  const [filterGrade, setFilterGrade] = useState<'All' | GradeId>('All');

  const insights = useMemo(
    () => computeParentInsights(profile, history),
    [profile, history]
  );

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (filterSubject !== 'All' && item.subject !== filterSubject) return false;
      if (filterGrade !== 'All' && item.grade !== filterGrade) return false;
      return true;
    });
  }, [history, filterSubject, filterGrade]);

  const handleSubjectClick = (subj: SubjectId) => {
    setSelectedSubject(subj);
    const list = TOPICS_BY_SUBJECT[subj]?.[lessonGrade] ?? [];
    if (list[0]) setSelectedTopicId(list[0].id);
  };

  const handleGradeChange = (newGrade: GradeId) => {
    setLessonGrade(newGrade);
    const list = TOPICS_BY_SUBJECT[selectedSubject]?.[newGrade] ?? [];
    if (list[0]) setSelectedTopicId(list[0].id);
    setOverridePanel(null);
  };

  const toggleLessonInterest = (item: InterestId) => {
    setLessonInterests((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((i) => i !== item) : prev;
      }
      if (prev.length >= 2) return [prev[1], item];
      return [...prev, item];
    });
  };

  const toggleLessonMethod = (item: MethodId) => {
    setLessonMethods((prev) => {
      if (prev.includes(item)) {
        return prev.length > 1 ? prev.filter((m) => m !== item) : prev;
      }
      if (prev.length >= 2) return [prev[1], item];
      return [...prev, item];
    });
  };

  const buildAndLaunch = async (overridePayload?: Partial<LessonRequest>) => {
    setBuildError('');
    setIsBuilding(true);

    const matchingPast = history.find(
      (h) =>
        h.subject === (overridePayload?.subject ?? selectedSubject) &&
        h.topic.toLowerCase() === (overridePayload?.topic ?? activeTopic.title).toLowerCase()
    );

    const priorMastery: LessonRequest['priorMastery'] = matchingPast
      ? matchingPast.status === 'Clicking'
        ? 'clicking'
        : matchingPast.status === 'Getting there'
          ? 'getting_there'
          : 'needs_help'
      : 'new';

    const payload: LessonRequest = {
      age: profile.age,
      grade: overridePayload?.grade ?? lessonGrade,
      curriculum: profile.curriculum,
      subject: overridePayload?.subject ?? selectedSubject,
      topic: overridePayload?.topic ?? activeTopic.title,
      interests: overridePayload?.interests ?? lessonInterests,
      methods: overridePayload?.methods ?? lessonMethods,
      difficulty: overridePayload?.difficulty ?? activeTopic.difficulty,
      specificNeed: overridePayload?.specificNeed ?? (specificNeed.trim() || undefined),
      priorMastery,
    };

    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.lesson) {
        setBuildError(data.error || 'Could not generate lesson. Please try again.');
        setIsBuilding(false);
        return;
      }
      onStartLesson(data.lesson, payload, data.source || 'ai');
    } catch {
      setBuildError('Network issue while building lesson. Please try again.');
      setIsBuilding(false);
    }
  };

  return (
    <main className="notebook-section pb-14 min-h-[calc(100vh-4rem)]">
      <div className="bg-[#C1D5F4] border-b-2 border-[#14342B]/20">
        <ScallopedEdge fill="#FFFDF8" className="w-full h-5 sm:h-7 block" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* Top Child Summary Header */}
          <section className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div
              aria-hidden="true"
              className="paper-tape w-24 h-4 rounded-xs absolute -top-2 left-10 -rotate-2"
            />
            <div className="flex items-center gap-4">
              <NuMascot
                mood="happy"
                variant="chalk"
                className="w-16 h-16 rounded-2xl p-1.5 bg-[#14342B] border-2 border-[#14342B] shrink-0"
              />
              <div>
                <p className="text-xs font-bold text-[#FF6B57]">
                  Local browser profile · No data sent to cloud
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14342B]">
                  {profile.childName}&apos;s Learning Studio
                </h1>
                <p className="text-sm font-medium text-[#14342B]/80 mt-0.5">
                  Age {profile.age} · {getLocalizedGradeLabel(profile.curriculum, profile.grade)} ·{' '}
                  {profile.interests.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CFE09B] border-2 border-[#14342B]">
                <Flame className="w-5 h-5 text-[#FF6B57]" />
                <span className="font-display font-bold text-[#14342B] tabular-nums">
                  {insights.streakDays} day{insights.streakDays === 1 ? '' : 's'} active
                </span>
              </div>
              <button
                type="button"
                onClick={onEditProfile}
                className="sketch-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8EC] text-sm font-bold text-[#14342B] hover:bg-[#FFC83D] transition-colors min-h-[42px]"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit profile</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: 4-Step Subject & Topic Picker */}
          <section className="lg:col-span-7 sketch-card bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 space-y-8 relative">
            <RedPushpin className="w-8 h-8 absolute -top-4 right-7 hidden sm:block" />
            <div>
              <p className="text-xs font-bold text-[#FF6B57] mb-1">Start a lesson</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#14342B]">
                Build a lesson from 5 choices
              </h2>
            </div>

            {/* Step 1: Subject cards */}
            <div>
              <h3 className="text-sm font-bold text-[#14342B] mb-3">
                Step 1 · Choose a subject
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUBJECTS.map((subj) => {
                  const active = selectedSubject === subj;
                  const meta = SUBJECT_META[subj];
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => handleSubjectClick(subj)}
                      aria-pressed={active}
                      className={`p-3.5 rounded-2xl border-2 border-[#14342B] text-left transition-all flex flex-col gap-2 min-h-[88px] ${
                        active
                          ? 'bg-[#14342B] text-[#FFF8EC] shadow-[3px_3px_0px_#FFC83D]'
                          : 'bg-[#FFF8EC] text-[#14342B] hover:bg-[#CFE09B]/45'
                      }`}
                    >
                      <span className={active ? 'text-[#FFC83D]' : 'text-[#14342B]'}>
                        {meta.icon}
                      </span>
                      <div>
                        <p className="font-display font-bold text-sm leading-tight">{subj}</p>
                        <p
                          className={`text-[11px] mt-0.5 leading-snug ${
                            active ? 'text-[#FFF8EC]/80' : 'text-[#14342B]/70'
                          }`}
                        >
                          {meta.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Topics filtered by subject + grade */}
            <div id="topic-picker">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-[#14342B]">
                  Step 2 · Pick a topic for {getLocalizedGradeLabel(profile.curriculum, lessonGrade)}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setOverridePanel(overridePanel === 'grade' ? null : 'grade')
                  }
                  className="text-xs font-bold text-[#14342B] underline underline-offset-4"
                >
                  Change grade
                </button>
              </div>

              {overridePanel === 'grade' && (
                <div className="mb-3 p-3 rounded-2xl bg-[#C1D5F4]/40 border-2 border-[#14342B] flex flex-wrap gap-1.5">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGradeChange(g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border border-[#14342B] ${
                        lessonGrade === g
                          ? 'bg-[#14342B] text-[#FFC83D]'
                          : 'bg-[#FFFDF8] text-[#14342B]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                {availableTopics.map((topic) => {
                  const selected = activeTopic.id === topic.id;
                  const diffBg =
                    topic.difficulty === 'Starter'
                      ? 'bg-[#CFE09B] text-[#14342B]'
                      : topic.difficulty === 'Core'
                        ? 'bg-[#C1D5F4] text-[#14342B]'
                        : 'bg-[#FFC83D] text-[#14342B]';

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      aria-pressed={selected}
                      className={`p-3.5 rounded-2xl border-2 border-[#14342B] text-left transition-all flex flex-col justify-between gap-2 ${
                        selected
                          ? 'bg-[#FFF3C4] shadow-[3px_3px_0px_#14342B]'
                          : 'bg-[#FFFDF8] hover:bg-[#FFF8EC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm text-[#14342B] leading-snug">
                          {topic.title}
                        </p>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#14342B] shrink-0 ${diffBg}`}
                        >
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#14342B]/75 leading-snug">
                        {topic.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional specific need */}
            <div>
              <label
                htmlFor="specific-need"
                className="block text-sm font-bold text-[#14342B] mb-2"
              >
                Step 3 (optional) · Anything specific they find tricky?
              </label>
              <input
                id="specific-need"
                type="text"
                maxLength={200}
                value={specificNeed}
                onChange={(e) => setSpecificNeed(e.target.value)}
                placeholder='e.g. "he mixes up 6 and 9" or "needs practice sharing equally"'
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#14342B] bg-[#FFF8EC] text-[#14342B] text-sm font-medium placeholder:text-[#14342B]/45 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
              />
            </div>

            {/* Step 4: Review Card on Framed Chalkboard */}
            <div className="rounded-3xl overflow-hidden border-[6px] border-[#6E4527] shadow-[4px_5px_0px_#14342B]">
              <div className="chalkboard-texture p-5 sm:p-6 text-[#FFF8EC] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#FFC83D]">
                    Step 4 · Review your 5 choices
                  </span>
                  <span className="text-xs text-[#FFF8EC]/75">
                    No personal name sent to AI
                  </span>
                </div>

                <p className="font-display text-lg sm:text-xl font-bold leading-snug text-[#FFF8EC]">
                  {profile.childName}, {lessonGrade} · {selectedSubject} · {activeTopic.title} ·{' '}
                  {lessonInterests.join(' + ')} · {lessonMethods.join(' + ')}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setOverridePanel(overridePanel === 'grade' ? null : 'grade')
                    }
                    className="text-[#5CB8FF] hover:underline font-bold"
                  >
                    [Change grade]
                  </button>
                  <a
                    href="#topic-picker"
                    className="text-[#5CB8FF] hover:underline font-bold"
                  >
                    [Change topic]
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setOverridePanel(overridePanel === 'interests' ? null : 'interests')
                    }
                    className="text-[#FFC83D] hover:underline font-bold"
                  >
                    [Change interests for this lesson]
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOverridePanel(overridePanel === 'methods' ? null : 'methods')
                    }
                    className="text-[#FFC83D] hover:underline font-bold"
                  >
                    [Change methods for this lesson]
                  </button>
                </div>

                {overridePanel === 'interests' && (
                  <div className="p-3 rounded-2xl bg-[#0e261f] border border-[#FFF8EC]/20 space-y-2">
                    <p className="text-xs text-[#FFF8EC]/80">
                      Override interests for this lesson (max 2):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {INTERESTS.map((item) => {
                        const active = lessonInterests.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleLessonInterest(item)}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              active
                                ? 'bg-[#FFC83D] text-[#14342B]'
                                : 'bg-[#1D493D] text-[#FFF8EC] border border-[#FFF8EC]/20'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {overridePanel === 'methods' && (
                  <div className="p-3 rounded-2xl bg-[#0e261f] border border-[#FFF8EC]/20 space-y-2">
                    <p className="text-xs text-[#FFF8EC]/80">
                      Override learning methods for this lesson (max 2):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {LEARNING_METHODS.map((m) => {
                        const active = lessonMethods.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleLessonMethod(m)}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              active
                                ? 'bg-[#5CB8FF] text-[#14342B]'
                                : 'bg-[#1D493D] text-[#FFF8EC] border border-[#FFF8EC]/20'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {buildError && (
                  <p role="alert" className="text-sm font-medium text-[#FF6B57]">
                    {buildError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={isBuilding}
                  onClick={() => buildAndLaunch()}
                  className="sketch-btn w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#FFC83D] text-[#14342B] font-bold text-base hover:bg-[#f5bc28] transition-all min-h-[48px] disabled:opacity-70"
                >
                  {isBuilding ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Building &amp; safety-checking your lesson...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Build lesson</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Parent Dashboard Insights, Learning Profile & Progress Filters */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="sketch-card bg-[#CFE09B] rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-bold text-[#14342B]">
                  Learning profile
                </h2>
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="text-xs font-bold text-[#14342B] underline underline-offset-4"
                >
                  Edit defaults
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#14342B]">
                  <p className="text-xs font-bold text-[#FF6B57]">Best methods</p>
                  <p className="mt-0.5 font-semibold text-[#14342B]">
                    {insights.bestMethodsText}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#14342B]">
                    <p className="text-xs font-bold text-[#14342B]/70">Best time of day</p>
                    <p className="mt-0.5 font-bold text-[#14342B]">
                      {insights.bestTimeOfDay}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#14342B]">
                    <p className="text-xs font-bold text-[#14342B]/70">Avg lesson length</p>
                    <p className="mt-0.5 font-bold text-[#14342B] tabular-nums">
                      {insights.averageMinutes} min
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFFDF8] border-2 border-[#14342B]">
                  <p className="text-xs font-bold text-[#14342B]/70">Favourite interests</p>
                  <p className="mt-0.5 font-semibold text-[#14342B]">
                    {insights.favouriteInterests.join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            {insights.alertBanner && (
              <div className="sketch-card rounded-2xl bg-[#fff2ef] p-4 text-sm font-semibold text-[#14342B]">
                {insights.alertBanner}
              </div>
            )}

            <div className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 space-y-3">
              <h2 className="font-display text-xl font-bold text-[#14342B]">
                Next-lesson suggestions
              </h2>
              <div className="space-y-2.5">
                {insights.nextSuggestions.map((sug) => (
                  <button
                    key={sug.label}
                    type="button"
                    disabled={isBuilding}
                    onClick={() =>
                      buildAndLaunch({
                        subject: sug.subject,
                        topic: sug.topic,
                        grade: sug.grade,
                      })
                    }
                    className="w-full p-3.5 rounded-2xl bg-[#FFF8EC] border-2 border-[#14342B] hover:bg-[#FFC83D]/35 text-left flex items-center justify-between gap-3 transition-all"
                  >
                    <div>
                      <p className="font-bold text-sm text-[#14342B]">{sug.label}</p>
                      <p className="text-xs text-[#14342B]/75">
                        {sug.subject} · {sug.topic} · {sug.reason}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#14342B] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="sketch-card bg-[#FFFDF8] rounded-3xl p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#14342B]">
                Progress by topic
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                <select
                  aria-label="Filter progress by subject"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value as 'All' | SubjectId)}
                  className="px-3 py-2 rounded-xl border-2 border-[#14342B] bg-[#FFF8EC] text-xs font-bold text-[#14342B]"
                >
                  <option value="All">All subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter progress by grade"
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value as 'All' | GradeId)}
                  className="px-3 py-2 rounded-xl border-2 border-[#14342B] bg-[#FFF8EC] text-xs font-bold text-[#14342B]"
                >
                  <option value="All">All grades</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-sm text-[#14342B]/75 py-4 text-center">
                  No completed lessons match this filter yet. Build your first lesson on the left!
                </p>
              ) : (
                <div className="divide-y-2 divide-dashed divide-[#14342B]/15">
                  {filteredHistory.slice(0, 6).map((rec) => {
                    const statusClass =
                      rec.status === 'Clicking'
                        ? 'bg-[#CFE09B] text-[#14342B]'
                        : rec.status === 'Getting there'
                          ? 'bg-[#C1D5F4] text-[#14342B]'
                          : 'bg-[#ffd8d1] text-[#14342B]';

                    return (
                      <div key={rec.id} className="py-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-sm text-[#14342B]">
                            {rec.subject} · {rec.topic}
                          </p>
                          <p className="text-xs text-[#14342B]/75 mt-0.5">
                            {rec.grade} · {rec.accuracyPercent}% accuracy · {rec.methodsUsed.join(' + ')}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full border border-[#14342B] text-[11px] font-bold shrink-0 ${statusClass}`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
