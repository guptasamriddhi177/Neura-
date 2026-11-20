import { useEffect, useState } from 'react';
import { DashboardPage } from './components/DashboardPage.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { LessonPlayerPage } from './components/LessonPlayerPage.tsx';
import { Navbar } from './components/Navbar.tsx';
import { OnboardingPage } from './components/OnboardingPage.tsx';
import { FALLBACK_LESSONS, selectFallbackLesson } from './data/fallbackLessons.ts';
import type {
  ChildProfile,
  GradeId,
  LessonOutput,
  LessonProgressRecord,
  LessonRequest,
  SubjectId,
} from './types/neura.ts';
import {
  appendLessonProgress,
  loadChildProfile,
  loadLessonHistory,
} from './utils/storage.ts';

interface ActiveLessonState {
  lesson: LessonOutput;
  request: LessonRequest;
  source: 'ai' | 'fallback' | 'demo';
}

const DEMO_REQUEST: LessonRequest = {
  age: 9,
  grade: 'Grade 4',
  curriculum: 'US Common Core',
  subject: 'Maths',
  topic: 'Fractions',
  interests: ['Football'],
  methods: ['Games and challenges', 'Step-by-step'],
  difficulty: 'Core',
};

export function App() {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');
  const [profile, setProfile] = useState<ChildProfile | null>(() => loadChildProfile());
  const [history, setHistory] = useState<LessonProgressRecord[]>(() => loadLessonHistory());
  const [activeLesson, setActiveLesson] = useState<ActiveLessonState | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath: string) => {
    if (nextPath !== path) {
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProfileSaved = (saved: ChildProfile) => {
    setProfile(saved);
    setIsEditingProfile(false);
    navigate('/dashboard');
  };

  const handleStartLesson = (
    lesson: LessonOutput,
    request: LessonRequest,
    source: 'ai' | 'fallback'
  ) => {
    setActiveLesson({ lesson, request, source });
    navigate('/lesson');
  };

  const handleLessonCompleted = (record: LessonProgressRecord) => {
    if (activeLesson?.source !== 'demo') {
      const updated = appendLessonProgress(record);
      setHistory(updated);
    }
  };

  const handleQuickNextLesson = async (next: {
    subject: SubjectId;
    topic: string;
    grade: GradeId;
  }) => {
    if (!profile) {
      navigate('/signin');
      return;
    }

    const req: LessonRequest = {
      age: profile.age,
      grade: next.grade,
      curriculum: profile.curriculum,
      subject: next.subject,
      topic: next.topic,
      interests: profile.interests.slice(0, 2),
      methods: profile.methods.slice(0, 2),
      difficulty: 'Core',
    };

    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (res.ok && data.lesson) {
        setActiveLesson({
          lesson: data.lesson,
          request: req,
          source: data.source || 'ai',
        });
        return;
      }
    } catch {
      // Fallback gracefully
    }
    const fallback = selectFallbackLesson(req);
    setActiveLesson({ lesson: fallback, request: req, source: 'fallback' });
  };

  const handleRotateTheme = () => {
    if (!activeLesson) return;
    const alt = FALLBACK_LESSONS[Math.floor(Math.random() * FALLBACK_LESSONS.length)].lesson;
    setActiveLesson({
      ...activeLesson,
      lesson: alt,
      source: 'fallback',
    });
  };

  // Resolve active view cleanly
  const renderView = () => {
    if (path === '/demo') {
      const demoLesson = FALLBACK_LESSONS[2].lesson; // Grade 4 Matchday Fractions (Football + Games)
      return (
        <LessonPlayerPage
          lesson={demoLesson}
          request={DEMO_REQUEST}
          source="demo"
          childName={profile?.childName || 'Explorer'}
          onExit={() => navigate('/')}
          onComplete={handleLessonCompleted}
          onQuickNextLesson={() => navigate('/signin')}
          onRotateTheme={handleRotateTheme}
        />
      );
    }

    if (path === '/lesson' && activeLesson) {
      return (
        <LessonPlayerPage
          lesson={activeLesson.lesson}
          request={activeLesson.request}
          source={activeLesson.source}
          childName={profile?.childName || 'Explorer'}
          onExit={() => navigate('/dashboard')}
          onComplete={handleLessonCompleted}
          onQuickNextLesson={handleQuickNextLesson}
          onRotateTheme={handleRotateTheme}
        />
      );
    }

    if (path === '/signin' || isEditingProfile) {
      return (
        <OnboardingPage
          existingProfile={profile}
          onComplete={handleProfileSaved}
          onBack={() => {
            setIsEditingProfile(false);
            navigate(profile ? '/dashboard' : '/');
          }}
        />
      );
    }

    if (path === '/dashboard') {
      if (!profile) {
        return (
          <OnboardingPage
            existingProfile={null}
            onComplete={handleProfileSaved}
            onBack={() => navigate('/')}
          />
        );
      }
      return (
        <DashboardPage
          profile={profile}
          history={history}
          onEditProfile={() => setIsEditingProfile(true)}
          onStartLesson={handleStartLesson}
        />
      );
    }

    // If user clicks /signin while already having a profile, let /signin go to onboarding or dashboard?
    // Wait: /signin directly opens onboarding if no profile, or we can show Dashboard if profile exists when navigating via /dashboard.
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#14342B]">
      <Navbar onNavigate={navigate} currentPath={path} />
      {renderView()}
    </div>
  );
}

export default App;
