import type {
  ChildProfile,
  GradeId,
  LessonProgressRecord,
  MethodId,
  SubjectId,
} from '../types/neura.ts';

const PROFILE_KEY = 'neura_child_profile_v1';
const HISTORY_KEY = 'neura_lesson_history_v1';

export function loadChildProfile(): ChildProfile | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChildProfile;
  } catch {
    return null;
  }
}

export function saveChildProfile(profile: ChildProfile): void {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function clearChildProfile(): void {
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore
  }
}

export function loadLessonHistory(): LessonProgressRecord[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendLessonProgress(record: LessonProgressRecord): LessonProgressRecord[] {
  const existing = loadLessonHistory();
  const updated = [record, ...existing].slice(0, 100);
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
  return updated;
}

export function computeStreakDays(history: LessonProgressRecord[]): number {
  if (!history.length) return 0;
  const uniqueDates = Array.from(
    new Set(history.map((h) => h.completedAt.slice(0, 10)))
  ).sort((a, b) => (a > b ? -1 : 1));
  return uniqueDates.length;
}

export function getTimeOfDayBucket(): 'Morning' | 'Afternoon' | 'Evening' {
  const hr = new Date().getHours();
  if (hr < 12) return 'Morning';
  if (hr < 17) return 'Afternoon';
  return 'Evening';
}

export interface ParentInsightsSummary {
  bestMethodsText: string;
  favouriteInterests: string[];
  bestTimeOfDay: string;
  averageMinutes: number;
  streakDays: number;
  alertBanner: string | null;
  nextSuggestions: {
    label: string;
    subject: SubjectId;
    topic: string;
    grade: GradeId;
    reason: string;
  }[];
}

export function computeParentInsights(
  profile: ChildProfile,
  history: LessonProgressRecord[]
): ParentInsightsSummary {
  if (!history.length) {
    return {
      bestMethodsText: `${profile.methods.join(' + ')} (default preference)`,
      favouriteInterests: profile.interests,
      bestTimeOfDay: 'Not enough lessons yet',
      averageMinutes: profile.age <= 6 ? 7 : 11,
      streakDays: 0,
      alertBanner: null,
      nextSuggestions: [
        {
          label: 'Recommended starter',
          subject: 'Maths',
          topic: profile.grade === 'Grade 4' ? 'Fractions' : profile.grade === 'Grade 2' ? 'Place value' : 'Counting to 20',
          grade: profile.grade,
          reason: 'Great warm-up matched to your profile',
        },
        {
          label: 'Try something new',
          subject: 'Science',
          topic: profile.grade === 'Grade 3' ? 'States of matter' : 'Plants and habitats',
          grade: profile.grade,
          reason: 'Explore cause and effect',
        },
      ],
    };
  }

  // Score methods by accuracy & speed
  const methodStats = new Map<string, { scoreSum: number; count: number }>();
  const timeCounts = new Map<string, number>();
  let totalSec = 0;

  for (const rec of history) {
    totalSec += rec.durationSeconds;
    timeCounts.set(rec.timeOfDay, (timeCounts.get(rec.timeOfDay) ?? 0) + 1);
    for (const m of rec.methodsUsed) {
      const prev = methodStats.get(m) ?? { scoreSum: 0, count: 0 };
      const speedBonus = Math.max(0, 20 - Math.round(rec.durationSeconds / 60));
      methodStats.set(m, {
        scoreSum: prev.scoreSum + rec.accuracyPercent + speedBonus,
        count: prev.count + 1,
      });
    }
  }

  const rankedMethods = Array.from(methodStats.entries())
    .map(([m, v]) => ({ method: m as MethodId, avg: v.scoreSum / v.count }))
    .sort((a, b) => b.avg - a.avg);

  const topTwoMethods = rankedMethods.slice(0, 2).map((r) => r.method);
  const latest = history[0];
  const bestMethodsText = topTwoMethods.length
    ? `${profile.childName} learns ${latest.topic.toLowerCase()} fastest with ${topTwoMethods.join(' + ')}`
    : profile.methods.join(' + ');

  const bestTimeOfDay =
    Array.from(timeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Afternoon';

  const averageMinutes = Math.max(4, Math.round(totalSec / history.length / 60));

  const struggling = history.find((h) => h.status === 'Needs help');
  const alertBanner = struggling
    ? `${profile.childName} needed extra hints in ${struggling.topic} (${struggling.subject}) — try a gentler replay.`
    : null;

  const nextSuggestions: ParentInsightsSummary['nextSuggestions'] = [
    {
      label: `Recommended: ${latest.topic} part 2`,
      subject: latest.subject,
      topic: latest.topic,
      grade: latest.grade,
      reason: latest.status === 'Clicking' ? 'Ready for Challenge level' : 'Reinforce confidence',
    },
    {
      label: 'Review foundations',
      subject: 'Maths',
      topic: profile.grade === 'Grade 4' ? 'Multiplication' : 'Place value',
      grade: profile.grade,
      reason: 'Keep core fluency sharp',
    },
    {
      label: 'Try something new: Science',
      subject: 'Science',
      topic: profile.grade === 'Grade 3' ? 'The solar system' : 'States of matter',
      grade: profile.grade,
      reason: 'Predict, observe & explain',
    },
  ];

  return {
    bestMethodsText,
    favouriteInterests: profile.interests,
    bestTimeOfDay,
    averageMinutes,
    streakDays: computeStreakDays(history),
    alertBanner,
    nextSuggestions,
  };
}
