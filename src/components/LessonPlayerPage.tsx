import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Mic,
  MicOff,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Square,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  GradeId,
  LessonOutput,
  LessonProgressRecord,
  LessonRequest,
  SkillTelemetry,
  SubjectId,
} from '../types/neura.ts';
import { matchSpokenAnswer } from '../utils/speechMatch.ts';
import { getTimeOfDayBucket } from '../utils/storage.ts';
import { NuMascot } from './NuMascot.tsx';
import { CrayonStar, RedPushpin, ScallopedEdge } from './StorybookDoodles.tsx';

interface LessonPlayerPageProps {
  lesson: LessonOutput;
  request: LessonRequest;
  source: 'ai' | 'fallback' | 'demo';
  childName: string;
  onExit: () => void;
  onComplete: (record: LessonProgressRecord) => void;
  onQuickNextLesson: (next: { subject: SubjectId; topic: string; grade: GradeId }) => void;
  onRotateTheme?: () => void;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionResultEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string; confidence?: number };
  }>;
}

const CHOICE_TILE_COLORS = [
  'bg-[#FFC83D] text-[#14342B]',
  'bg-[#5CB8FF] text-[#14342B]',
  'bg-[#FF6B57] text-[#FFF8EC]',
  'bg-[#FFF8EC] text-[#14342B]',
];

const CHOICE_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const LessonPlayerPage: React.FC<LessonPlayerPageProps> = ({
  lesson,
  request,
  source,
  childName,
  onExit,
  onComplete,
  onQuickNextLesson,
  onRotateTheme,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [numberInput, setNumberInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [stepStatus, setStepStatus] = useState<'answering' | 'wrong' | 'correct'>('answering');
  const [attemptsThisStep, setAttemptsThisStep] = useState(0);
  const [inPrerequisite, setInPrerequisite] = useState(false);
  const [prereqSolved, setPrereqSolved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [readAloud, setReadAloud] = useState(
    request.age <= 6 || lesson.methodsUsed.includes('Talk it out')
  );
  const [talkItOutEnabled, setTalkItOutEnabled] = useState(true);
  const [rapidSkipCount, setRapidSkipCount] = useState(0);
  const [rotatePromptVisible, setRotatePromptVisible] = useState(false);

  // Web Speech API state
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechNotice, setSpeechNotice] = useState('');

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lessonStartRef = useRef<number>(Date.now());
  const stepStartRef = useRef<number>(Date.now());
  const telemetryRef = useRef<SkillTelemetry[]>([]);

  const currentStep = lesson.steps[stepIdx];

  const getSpeechRecognitionCtor = (): (new () => SpeechRecognitionInstance) | null => {
    if (typeof window === 'undefined') return null;
    return (
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition ||
      null
    ) as (new () => SpeechRecognitionInstance) | null;
  };

  const speechSupported = Boolean(getSpeechRecognitionCtor());

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      recognitionRef.current = null;
    }
    setIsListeningVoice(false);
  }, []);

  useEffect(() => {
    stepStartRef.current = Date.now();
    setLiveTranscript('');
    setSpeechNotice('');
    stopListening();
  }, [stepIdx, inPrerequisite, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const speakText = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = request.age <= 6 ? 0.92 : 1.0;
        utter.pitch = 1.04;
        window.speechSynthesis.speak(utter);
      } catch {
        // Ignore speech synthesis errors
      }
    },
    [request.age]
  );

  useEffect(() => {
    if (!readAloud || completed) return;
    const text =
      inPrerequisite && currentStep.prerequisiteStep
        ? currentStep.prerequisiteStep.question
        : currentStep.question;
    speakText(text);
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Ignore
      }
    };
  }, [readAloud, stepIdx, inPrerequisite, completed, currentStep, speakText]);

  const recordTelemetry = (
    correctFirstTry: boolean,
    droppedToPrereq: boolean,
    rapidSkipped: boolean
  ) => {
    const elapsedSec = Math.max(1, Math.round((Date.now() - stepStartRef.current) / 1000));
    telemetryRef.current.push({
      skillTag: currentStep.skillTag,
      attempts: attemptsThisStep + 1,
      hintsUsed: hintsShown,
      timeSeconds: elapsedSec,
      correctFirstTry,
      droppedToPrereq,
      rapidSkipped,
    });
  };

  const evaluateAnswer = (candidate: string) => {
    if (stepStatus === 'correct') return;
    stopListening();
    setSelectedChoice(candidate);

    if (inPrerequisite && currentStep.prerequisiteStep) {
      const cand = candidate.trim().toLowerCase();
      const target = currentStep.prerequisiteStep.correctAnswer.trim().toLowerCase();
      if (cand === target || cand.includes(target) || target.includes(cand)) {
        setPrereqSolved(true);
      }
      return;
    }

    const normalizedCandidate = candidate.trim().toLowerCase();
    const normalizedCorrect = currentStep.correctAnswer.trim().toLowerCase();
    const isCorrect =
      currentStep.answerType === 'hands_on_confirm' ||
      normalizedCandidate === normalizedCorrect ||
      normalizedCandidate.includes(normalizedCorrect) ||
      normalizedCorrect.includes(normalizedCandidate);

    if (isCorrect) {
      const firstTry = attemptsThisStep === 0 && hintsShown === 0;
      recordTelemetry(firstTry, prereqSolved, false);
      setStepStatus('correct');
      if (readAloud) {
        speakText(`${currentStep.celebration} ${currentStep.explanation}`);
      }
    } else {
      setAttemptsThisStep((a) => a + 1);
      setStepStatus('wrong');
      if (hintsShown < 3) {
        setHintsShown((h) => Math.min(3, h + 1));
      }
    }
  };

  const handleNextStep = () => {
    if (stepIdx < lesson.steps.length - 1) {
      setStepIdx((i) => i + 1);
      setHintsShown(0);
      setNumberInput('');
      setSelectedChoice(null);
      setStepStatus('answering');
      setAttemptsThisStep(0);
      setInPrerequisite(false);
      setPrereqSolved(false);
      setLiveTranscript('');
      setSpeechNotice('');
    } else {
      finishLesson();
    }
  };

  const handleSkipStep = () => {
    const elapsedSec = (Date.now() - stepStartRef.current) / 1000;
    recordTelemetry(false, prereqSolved, true);
    if (elapsedSec < 5) {
      const nextCount = rapidSkipCount + 1;
      setRapidSkipCount(nextCount);
      if (nextCount >= 2) {
        setRotatePromptVisible(true);
      }
    }
    handleNextStep();
  };

  const finishLesson = () => {
    stopListening();
    setCompleted(true);
    const totalDuration = Math.max(30, Math.round((Date.now() - lessonStartRef.current) / 1000));
    const breakdown = telemetryRef.current;
    const firstTryHits = breakdown.filter((b) => b.correctFirstTry).length;
    const totalTracked = Math.max(1, breakdown.length);
    const accuracyPercent = Math.round((firstTryHits / totalTracked) * 100);
    const hintsTotal = breakdown.reduce((acc, b) => acc + b.hintsUsed, 0);

    const status: LessonProgressRecord['status'] =
      accuracyPercent >= 75 && hintsTotal <= 2
        ? 'Clicking'
        : accuracyPercent >= 45
          ? 'Getting there'
          : 'Needs help';

    const record: LessonProgressRecord = {
      id: `prog-${Date.now()}`,
      completedAt: new Date().toISOString(),
      subject: request.subject,
      topic: lesson.topic,
      grade: request.grade,
      difficulty: request.difficulty,
      interestsUsed: lesson.interestsUsed,
      methodsUsed: lesson.methodsUsed,
      durationSeconds: totalDuration,
      accuracyPercent,
      hintsTotal,
      status,
      timeOfDay: getTimeOfDayBucket(),
      skillBreakdown: breakdown,
      noteForParent: lesson.parentNote,
    };

    onComplete(record);
  };

  const handleToggleVoiceDictation = () => {
    if (isListeningVoice) {
      stopListening();
      return;
    }

    const SpeechRecCtor = getSpeechRecognitionCtor();
    if (!SpeechRecCtor) {
      setSpeechNotice(
        'Voice input is not supported in this browser — tap an answer tile or type below!'
      );
      return;
    }

    try {
      window.speechSynthesis?.cancel();
    } catch {
      // Ignore
    }

    setSpeechNotice('');
    setLiveTranscript('');

    try {
      const rec = new SpeechRecCtor();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      recognitionRef.current = rec;

      rec.onstart = () => {
        setIsListeningVoice(true);
      };

      rec.onresult = (event: SpeechRecognitionResultEventLike) => {
        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item?.[0]?.transcript ?? '';
          if (item?.isFinal) {
            finalText += `${text} `;
          } else {
            interim += `${text} `;
          }
        }

        const display = (finalText || interim).trim();
        if (display) {
          setLiveTranscript(display);
        }

        if (finalText.trim()) {
          setIsListeningVoice(false);
          recognitionRef.current = null;

          if (inPrerequisite && currentStep.prerequisiteStep) {
            const match = matchSpokenAnswer(
              finalText,
              currentStep.prerequisiteStep.choices,
              'multiple_choice',
              currentStep.prerequisiteStep.correctAnswer
            );
            evaluateAnswer(match.matchedValue);
            return;
          }

          const match = matchSpokenAnswer(
            finalText,
            currentStep.choices,
            currentStep.answerType,
            currentStep.correctAnswer
          );

          if (currentStep.answerType === 'number_input') {
            setNumberInput(match.matchedValue);
          }

          evaluateAnswer(match.matchedValue);
        }
      };

      rec.onerror = (event: { error?: string }) => {
        setIsListeningVoice(false);
        recognitionRef.current = null;
        if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
          setSpeechNotice(
            'Microphone permission was blocked. Allow mic access in your browser bar or tap your answer below!'
          );
        } else if (event?.error === 'no-speech') {
          setSpeechNotice('Nu did not catch any words — tap the mic and speak clearly near the device.');
        } else if (event?.error !== 'aborted') {
          setSpeechNotice('Could not hear clearly — try speaking again or tap your answer below.');
        }
      };

      rec.onend = () => {
        setIsListeningVoice(false);
        recognitionRef.current = null;
      };

      rec.start();
    } catch {
      setIsListeningVoice(false);
      setSpeechNotice('Microphone could not start — you can tap or type your answer below.');
    }
  };

  const breezingThrough =
    telemetryRef.current.length >= 2 &&
    telemetryRef.current.every((t) => t.correctFirstTry && t.timeSeconds <= 20);

  if (completed) {
    const breakdown = telemetryRef.current;
    const accuracy = Math.round(
      (breakdown.filter((b) => b.correctFirstTry).length / Math.max(1, breakdown.length)) * 100
    );

    return (
      <main className="min-h-[calc(100vh-4rem)] notebook-section pb-14">
        <div className="bg-[#C1D5F4]">
          <ScallopedEdge fill="#FFFDF8" className="w-full h-5 sm:h-7 block" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
          {/* Chalkboard Celebration Board */}
          <div className="chalkboard-texture rounded-3xl p-7 sm:p-10 text-[#FFF8EC] border-8 border-[#6E4527] shadow-[6px_6px_0px_#14342B] text-center space-y-5 relative overflow-visible">
            <CrayonStar color="#FFC83D" className="w-10 h-10 absolute -top-5 -right-3 rotate-12" />
            <div className="flex justify-center">
              <NuMascot mood="cheering" variant="chalk" className="w-24 h-24" />
            </div>
            <p className="text-sm font-semibold text-[#FFC83D]">Lesson complete</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#FFF8EC] text-balance">
              Way to think it through, {childName}!
            </h1>
            <p className="text-base sm:text-lg text-[#FFF8EC]/90 max-w-xl mx-auto leading-relaxed">
              {lesson.recap}
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="rounded-2xl bg-[#1D493D] p-3.5 border-2 border-dashed border-[#FFC83D]/55">
                <p className="font-display text-2xl font-bold text-[#FFC83D] tabular-nums">
                  {lesson.steps.length}
                </p>
                <p className="text-xs text-[#FFF8EC]/85">Steps solved</p>
              </div>
              <div className="rounded-2xl bg-[#1D493D] p-3.5 border-2 border-dashed border-[#5CB8FF]/55">
                <p className="font-display text-2xl font-bold text-[#5CB8FF] tabular-nums">
                  {accuracy}%
                </p>
                <p className="text-xs text-[#FFF8EC]/85">First-try</p>
              </div>
              <div className="rounded-2xl bg-[#1D493D] p-3.5 border-2 border-dashed border-[#FFF8EC]/40">
                <p className="font-display text-2xl font-bold text-[#FFF8EC] tabular-nums">
                  {lesson.estimatedMinutes}m
                </p>
                <p className="text-xs text-[#FFF8EC]/85">Target pace</p>
              </div>
            </div>
          </div>

          {/* Notebook Paper Parent Note & Next Suggestions */}
          <div className="sketch-card notebook-paper rounded-3xl p-6 sm:p-8 pl-14 sm:pl-16 space-y-6 relative">
            <div
              aria-hidden="true"
              className="washi-tape-coral w-24 h-5 rounded-sm absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-1"
            />
            <RedPushpin className="w-8 h-8 absolute -top-4 right-6 hidden sm:block" />
            <div>
              <p className="text-xs font-bold text-[#FF6B57] mb-1">Note for parents</p>
              <p className="text-base text-[#14342B] leading-relaxed font-medium">
                {lesson.parentNote}
              </p>
            </div>

            <div className="pt-4 border-t border-[#14342B]/15 space-y-3">
              <p className="text-sm font-bold text-[#14342B]">Where to go next</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onQuickNextLesson({
                      subject: request.subject,
                      topic: lesson.topic,
                      grade: request.grade,
                    })
                  }
                  className="sketch-btn p-4 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF8EC] hover:-translate-y-0.5 transition-all text-left"
                >
                  <p className="text-xs font-bold text-[#FF6B57]">Recommended</p>
                  <p className="font-display font-bold text-base text-[#14342B] mt-0.5">
                    {lesson.topic} part 2
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onQuickNextLesson({
                      subject: 'Maths',
                      topic: 'Place value',
                      grade: request.grade,
                    })
                  }
                  className="sketch-btn p-4 rounded-2xl bg-[#C1D5F4]/60 hover:bg-[#C1D5F4] hover:-translate-y-0.5 transition-all text-left"
                >
                  <p className="text-xs font-bold text-[#14342B]">Review</p>
                  <p className="font-display font-bold text-base text-[#14342B] mt-0.5">
                    Place value
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onQuickNextLesson({
                      subject: 'Science',
                      topic: 'States of matter',
                      grade: request.grade,
                    })
                  }
                  className="sketch-btn p-4 rounded-2xl bg-[#CFE09B]/75 hover:bg-[#CFE09B] hover:-translate-y-0.5 transition-all text-left"
                >
                  <p className="text-xs font-bold text-[#14342B]">Try something new</p>
                  <p className="font-display font-bold text-base text-[#14342B] mt-0.5">
                    Science lab
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onExit}
                className="sketch-btn px-6 py-3 rounded-full bg-[#FFC83D] text-[#14342B] font-bold hover:bg-[#f5bc28] transition-all min-h-[48px]"
              >
                {source === 'demo' ? 'Back to Neura home' : 'Back to Parent Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="notebook-section min-h-[calc(100vh-4rem)] pb-14">
      {/* Periwinkle Storybook Header Strip */}
      <div className="bg-[#C1D5F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopListening();
              onExit();
            }}
            className="sketch-btn inline-flex items-center gap-2 text-sm font-bold text-[#14342B] bg-[#FFFDF8] px-4 py-2 rounded-full transition-all min-h-[42px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{source === 'demo' ? 'Exit demo' : 'Back to dashboard'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setTalkItOutEnabled((v) => !v)}
              aria-pressed={talkItOutEnabled}
              className={`sketch-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all min-h-[42px] ${
                talkItOutEnabled
                  ? 'bg-[#FFC83D] text-[#14342B]'
                  : 'bg-[#FFFDF8] text-[#14342B]/80'
              }`}
            >
              {talkItOutEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{talkItOutEnabled ? 'Talk it out on' : 'Talk it out off'}</span>
            </button>

            <button
              type="button"
              onClick={() => setReadAloud((r) => !r)}
              aria-pressed={readAloud}
              className={`sketch-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all min-h-[42px] ${
                readAloud
                  ? 'bg-[#5CB8FF] text-[#14342B]'
                  : 'bg-[#FFFDF8] text-[#14342B]/80'
              }`}
            >
              {readAloud ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{readAloud ? 'Read-aloud on' : 'Read-aloud off'}</span>
            </button>
          </div>
        </div>
        <ScallopedEdge fill="#FFFDF7" className="w-full h-5 sm:h-7 block" flip />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Stepping-Stone Chalk Trail Progress */}
        <div className="sketch-card bg-[#FFFDF8] rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto py-0.5" aria-label="Lesson progress steps">
            {lesson.steps.map((s, idx) => {
              const isDone = idx < stepIdx || (idx === stepIdx && stepStatus === 'correct');
              const isCurrent = idx === stepIdx && stepStatus !== 'correct';
              return (
                <React.Fragment key={`${s.skillTag}-${idx}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all border-2 border-[#14342B] ${
                      isDone
                        ? 'bg-[#14342B] text-[#FFC83D]'
                        : isCurrent
                          ? 'bg-[#FFC83D] text-[#14342B] scale-105'
                          : 'bg-[#FFFDF8] text-[#14342B]/60'
                    }`}
                  >
                    {isDone ? <Star className="w-4 h-4 fill-[#FFC83D] text-[#FFC83D]" /> : idx + 1}
                  </div>
                  {idx < lesson.steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 min-w-[14px] rounded-full ${
                        idx < stepIdx ? 'bg-[#14342B]' : 'bg-[#14342B]/15'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <span className="text-xs font-bold text-[#14342B] tabular-nums shrink-0">
            Step {stepIdx + 1} of {lesson.steps.length}
          </span>
        </div>

        {/* Rapid-Skip Boredom Detection Banner */}
        {rotatePromptVisible && onRotateTheme && (
          <div className="sketch-card rounded-2xl bg-[#CFE09B] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#14342B]">
              Want to switch things up? Nu can rotate your interest &amp; learning method right now!
            </p>
            <button
              type="button"
              onClick={onRotateTheme}
              className="sketch-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFC83D] text-[#14342B] text-xs font-bold shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate theme</span>
            </button>
          </div>
        )}

        {/* Notebook Paper Story & Context Sheet */}
        <article className="sketch-card notebook-paper rounded-3xl p-5 sm:p-7 pl-14 sm:pl-16 space-y-4 relative">
          <div
            aria-hidden="true"
            className="washi-tape-sky w-24 h-5 rounded-sm absolute -top-2.5 left-12 -rotate-2"
          />
          <RedPushpin className="w-8 h-8 absolute -top-4 right-6 hidden sm:block" />

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#14342B]/75">
            <span>
              {lesson.subject} · {lesson.topic} · {lesson.grade}
            </span>
            <span>
              {lesson.interestsUsed.join(' + ')} · {lesson.methodsUsed.join(' + ')}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14342B] leading-tight">
            {lesson.title}
          </h1>

          <p className="text-base sm:text-[17px] text-[#14342B]/90 leading-[32px]">
            {lesson.story}
          </p>

          {lesson.rhymeOrChant && (
            <div className="rounded-2xl bg-[#FFF3C4] border-2 border-[#14342B] p-4 text-sm font-medium text-[#14342B] shadow-[3px_3px_0px_#14342B] relative rotate-[0.4deg]">
              <span className="text-xs font-bold text-[#d94836] block mb-1">
                Nu&apos;s Memory Chant
              </span>
              {lesson.rhymeOrChant}
            </div>
          )}

          {lesson.handsOnTask && (
            <div className="rounded-2xl bg-[#CFE09B]/55 border-2 border-[#14342B] p-4 text-sm text-[#14342B] shadow-[3px_3px_0px_#14342B]">
              <span className="text-xs font-bold text-[#14342B] block mb-1">
                Hands-on table activity (with a parent)
              </span>
              {lesson.handsOnTask}
            </div>
          )}
        </article>

        {/* Main Framed Chalkboard Step Stage */}
        <section className="rounded-[28px] overflow-visible border-[8px] border-[#6E4527] shadow-[6px_7px_0px_#14342B] relative">
          <CrayonStar color="#5CB8FF" className="w-9 h-9 absolute -top-5 -left-4 -rotate-12 z-10 hidden sm:block" />
          <div className="chalkboard-texture rounded-t-[20px] p-5 sm:p-8 text-[#FFF8EC] space-y-6">
            {/* Chalkboard Mascot & Step Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FFF8EC]/15">
              <div className="flex items-center gap-3.5">
                <NuMascot
                  mood={
                    stepStatus === 'correct'
                      ? 'cheering'
                      : stepStatus === 'wrong'
                        ? 'thinking'
                        : 'happy'
                  }
                  variant="chalk"
                  className="w-14 h-14 shrink-0"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#FFC83D]">
                    {inPrerequisite
                      ? 'Gentler warm-up step'
                      : currentStep.isWorkedExample
                        ? 'Worked example · Step by step'
                        : currentStep.isChallenge || breezingThrough
                          ? 'Challenge boost'
                          : `Step ${stepIdx + 1} · ${currentStep.skillTag}`}
                  </p>
                  <p className="text-xs sm:text-sm text-[#FFF8EC]/80 max-w-xl">
                    {lesson.learningObjective}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  speakText(
                    inPrerequisite && currentStep.prerequisiteStep
                      ? currentStep.prerequisiteStep.question
                      : currentStep.question
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D493D] border border-[#FFF8EC]/25 text-xs font-semibold text-[#FFF8EC] hover:border-[#FFC83D] transition-colors min-h-[40px]"
              >
                <Volume2 className="w-4 h-4 text-[#5CB8FF]" />
                <span>Read question</span>
              </button>
            </div>

            {/* Prerequisite Mode OR Main Step */}
            {inPrerequisite && currentStep.prerequisiteStep ? (
              <div className="space-y-5">
                <div className="rounded-2xl chalk-frame bg-[#0f2922]/85 p-4 sm:p-5 text-base text-[#5CB8FF] font-semibold">
                  {currentStep.prerequisiteStep.visual}
                </div>
                <h2 className="font-display text-2xl sm:text-[26px] font-bold text-[#FFF8EC] leading-snug">
                  {currentStep.prerequisiteStep.question}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentStep.prerequisiteStep.choices.map((ch, idx) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => evaluateAnswer(ch)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 border-b-4 font-semibold transition-all min-h-[54px] flex items-center gap-3.5 ${
                        selectedChoice === ch && prereqSolved
                          ? 'bg-[#1D493D] border-[#FFC83D] text-[#FFF8EC]'
                          : 'bg-[#1D493D] border-[#FFF8EC]/25 text-[#FFF8EC] hover:border-[#FFC83D] hover:-translate-y-0.5'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg font-display font-bold text-sm flex items-center justify-center shrink-0 ${
                          CHOICE_TILE_COLORS[idx % CHOICE_TILE_COLORS.length]
                        }`}
                      >
                        {CHOICE_LETTERS[idx]}
                      </span>
                      <span>{ch}</span>
                    </button>
                  ))}
                </div>
                {prereqSolved ? (
                  <div className="rounded-2xl bg-[#1D493D] border-2 border-[#FFC83D] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-sm sm:text-base text-[#FFF8EC]">
                      {currentStep.prerequisiteStep.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInPrerequisite(false);
                        setSelectedChoice(null);
                        setStepStatus('answering');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#FFC83D] text-[#14342B] text-sm font-bold shrink-0 min-h-[44px]"
                    >
                      Back to main question
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[#5CB8FF] font-medium">
                    Hint: {currentStep.prerequisiteStep.hint}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Chalk Visual Diagram / Manipulative Stage */}
                <div className="rounded-2xl chalk-frame bg-[#0f2922]/85 p-4 sm:p-5 text-base sm:text-lg text-[#5CB8FF] font-semibold leading-relaxed">
                  {currentStep.visual}
                </div>

                {/* Question */}
                <h2 className="font-display text-2xl sm:text-[28px] font-bold leading-snug text-[#FFF8EC]">
                  {currentStep.question}
                </h2>

                {/* Web Speech API "Talk it out" Panel */}
                {(talkItOutEnabled || currentStep.answerType === 'voice_prompt') &&
                  stepStatus !== 'correct' &&
                  currentStep.answerType !== 'hands_on_confirm' && (
                    <div className="rounded-2xl bg-[#0e261f] border-2 border-dashed border-[#5CB8FF]/50 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleToggleVoiceDictation}
                            aria-pressed={isListeningVoice}
                            className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm border-2 border-b-4 transition-all min-h-[48px] ${
                              isListeningVoice
                                ? 'bg-[#FF6B57] text-[#FFF8EC] border-[#FFF8EC] animate-pulse'
                                : 'bg-[#5CB8FF] text-[#14342B] border-[#14342B] hover:bg-[#77c4ff] hover:-translate-y-0.5'
                            }`}
                          >
                            {isListeningVoice ? (
                              <>
                                <Square className="w-4 h-4 fill-current" />
                                <span>Listening... tap to stop</span>
                              </>
                            ) : (
                              <>
                                <Mic className="w-4 h-4" />
                                <span>Talk it out · Speak your answer</span>
                              </>
                            )}
                          </button>

                          {isListeningVoice && (
                            <div
                              aria-hidden="true"
                              className="flex items-center gap-1 h-6 px-2"
                            >
                              {[0, 1, 2, 3, 4].map((bar) => (
                                <span
                                  key={bar}
                                  className="w-1.5 h-5 rounded-full bg-[#FFC83D] animate-voice-wave"
                                  style={{ animationDelay: `${bar * 110}ms` }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="text-xs text-[#FFF8EC]/70">
                          {speechSupported
                            ? 'Say your answer or "Option A / B / C"'
                            : 'Speech input works best in Chrome / Edge / Safari'}
                        </span>
                      </div>

                      {liveTranscript && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="rounded-xl bg-[#14342B] border border-[#FFC83D]/40 px-3.5 py-2.5 text-sm text-[#FFF8EC]"
                        >
                          <span className="font-bold text-[#FFC83D]">Nu heard: </span>
                          <span>&ldquo;{liveTranscript}&rdquo;</span>
                        </div>
                      )}

                      {speechNotice && (
                        <p className="text-xs font-medium text-[#FFC83D]" role="status">
                          {speechNotice}
                        </p>
                      )}
                    </div>
                  )}

                {/* Answer Controls */}
                {currentStep.answerType === 'number_input' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (numberInput.trim()) evaluateAnswer(numberInput);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label="Enter your number answer"
                      value={numberInput}
                      onChange={(e) => setNumberInput(e.target.value)}
                      placeholder="Type or speak your number..."
                      className="flex-1 px-5 py-3.5 rounded-2xl bg-[#0e261f] border-2 border-[#FFF8EC]/30 text-[#FFC83D] font-display text-2xl font-bold placeholder:text-[#FFF8EC]/35 focus:outline-none focus:border-[#FFC83D]"
                    />
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-2xl bg-[#FFC83D] text-[#14342B] font-bold text-base border-2 border-[#14342B] border-b-4 hover:bg-[#f5bc28] active:translate-y-0.5 transition-all min-h-[52px]"
                    >
                      Check answer
                    </button>
                  </form>
                ) : currentStep.answerType === 'hands_on_confirm' ? (
                  <button
                    type="button"
                    onClick={() => evaluateAnswer(currentStep.correctAnswer)}
                    className="w-full py-4 rounded-2xl bg-[#FFC83D] text-[#14342B] font-bold text-base border-2 border-[#14342B] border-b-4 hover:bg-[#f5bc28] active:translate-y-0.5 transition-all min-h-[54px]"
                  >
                    {currentStep.choices[0] || 'We tested it together! Confirm'}
                  </button>
                ) : (
                  <div
                    className={
                      currentStep.answerType === 'tap_words'
                        ? 'flex flex-wrap gap-3'
                        : 'grid grid-cols-1 gap-3'
                    }
                  >
                    {currentStep.choices.map((choice, idx) => {
                      const isPicked = selectedChoice === choice;
                      let btnClass =
                        'bg-[#1D493D] border-[#FFF8EC]/25 text-[#FFF8EC] hover:border-[#FFC83D] hover:-translate-y-0.5';
                      if (isPicked && stepStatus === 'correct') {
                        btnClass =
                          'bg-[#1D493D] border-[#FFC83D] ring-2 ring-[#FFC83D] text-[#FFF8EC]';
                      } else if (isPicked && stepStatus === 'wrong') {
                        btnClass =
                          'bg-[#332624] border-[#FF6B57] ring-2 ring-[#FF6B57] text-[#FFF8EC]';
                      }

                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => evaluateAnswer(choice)}
                          className={`text-left px-4 py-3.5 rounded-2xl border-2 border-b-4 font-semibold text-base transition-all min-h-[54px] flex items-center justify-between gap-3 ${btnClass}`}
                        >
                          <div className="flex items-center gap-3.5">
                            {currentStep.answerType !== 'tap_words' && (
                              <span
                                className={`w-8 h-8 rounded-lg font-display font-bold text-sm flex items-center justify-center shrink-0 ${
                                  CHOICE_TILE_COLORS[idx % CHOICE_TILE_COLORS.length]
                                }`}
                              >
                                {CHOICE_LETTERS[idx]}
                              </span>
                            )}
                            <span>{choice}</span>
                          </div>
                          {isPicked && stepStatus === 'correct' && (
                            <CheckCircle2 className="w-5 h-5 text-[#FFC83D] shrink-0" />
                          )}
                          {isPicked && stepStatus === 'wrong' && (
                            <HelpCircle className="w-5 h-5 text-[#FF6B57] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Gentle Wrong-Try Prompt */}
                {stepStatus === 'wrong' && (
                  <p className="text-sm font-medium text-[#FFC83D]" role="status">
                    Not quite yet — check Nu&apos;s hint below and try again!
                  </p>
                )}

                {/* 3-Level Hints & Adaptive Prerequisite Trigger */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#FFF8EC]/15">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {hintsShown < 3 && stepStatus !== 'correct' && (
                      <button
                        type="button"
                        onClick={() => setHintsShown((h) => Math.min(3, h + 1))}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0e261f] border border-[#FFC83D]/50 text-xs font-bold text-[#FFC83D] hover:bg-[#193b31] min-h-[40px]"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>
                          {hintsShown === 0
                            ? 'Need a hint?'
                            : `Show hint ${hintsShown + 1} of 3`}
                        </span>
                      </button>
                    )}

                    {attemptsThisStep >= 2 &&
                      currentStep.prerequisiteStep &&
                      stepStatus !== 'correct' && (
                        <button
                          type="button"
                          onClick={() => {
                            setInPrerequisite(true);
                            setSelectedChoice(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5CB8FF] text-[#14342B] text-xs font-bold min-h-[40px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Try a gentler warm-up step</span>
                        </button>
                      )}
                  </div>

                  {stepStatus !== 'correct' && (
                    <button
                      type="button"
                      onClick={handleSkipStep}
                      className="text-xs font-medium text-[#FFF8EC]/70 hover:text-[#FFF8EC] underline underline-offset-4 py-1"
                    >
                      Skip step
                    </button>
                  )}
                </div>

                {/* Progressive Hints Box (Paper Sticky Note on Chalkboard!) */}
                {hintsShown > 0 && stepStatus !== 'correct' && (
                  <div className="paper-card rounded-2xl border-2 border-[#FFC83D] p-4 sm:p-5 text-[#14342B] space-y-2 shadow-md">
                    <p className="text-xs font-bold text-[#d94836]">Nu&apos;s Chalkboard Hints</p>
                    {currentStep.hints.slice(0, hintsShown).map((hintText, hIdx) => (
                      <p key={hIdx} className="text-sm sm:text-[15px] leading-snug">
                        <span className="font-bold text-[#14342B]">Hint {hIdx + 1}: </span>
                        {hintText}
                      </p>
                    ))}
                  </div>
                )}

                {/* Success Feedback & Next Step CTA */}
                {stepStatus === 'correct' && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="rounded-2xl bg-[#1D493D] border-2 border-[#FFC83D] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-display text-xl font-bold text-[#FFC83D] flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span>{currentStep.celebration}</span>
                      </p>
                      <p className="text-sm sm:text-base text-[#FFF8EC]/95">
                        {currentStep.explanation}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FFC83D] text-[#14342B] font-bold text-sm border-2 border-[#14342B] border-b-4 hover:bg-[#f5bc28] active:translate-y-0.5 shrink-0 min-h-[48px]"
                    >
                      <span>
                        {stepIdx < lesson.steps.length - 1 ? 'Next step' : 'Finish lesson'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wooden Chalk Ledge with Colored Chalk Sticks & Eraser */}
          <div
            aria-hidden="true"
            className="h-5 rounded-b-[20px] bg-gradient-to-b from-[#8A5833] to-[#5E371D] border-t border-[#a36f47] px-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-2 rounded-full bg-[#FFF8EC] shadow-xs" />
              <span className="w-6 h-2 rounded-full bg-[#FFC83D] shadow-xs" />
              <span className="w-7 h-2 rounded-full bg-[#5CB8FF] shadow-xs" />
              <span className="w-5 h-2 rounded-full bg-[#FF6B57] shadow-xs" />
            </div>
            <div className="w-14 h-3 rounded-sm bg-[#2b221c] border-t-2 border-[#8c7a6b]" />
          </div>
        </section>
      </div>
    </main>
  );
};
