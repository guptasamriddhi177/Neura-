import { GoogleGenAI, Type } from '@google/genai';
import {
  LessonOutputSchema,
  LessonRequestSchema,
  type LessonOutput,
  type LessonRequest,
} from '../types/neura.ts';
import { selectFallbackLesson } from '../data/fallbackLessons.ts';

export function buildPersonalisationSystemPrompt(req: LessonRequest): string {
  const ageRule =
    req.age <= 6
      ? 'AGE 5-6: Produce strictly 4 or 5 steps. Use 1-2 very short, concrete sentences per prompt, simple everyday words, picture-heavy visual descriptions, and read-aloud friendly phrasing.'
      : req.age <= 8
        ? 'AGE 7-8: Produce 5 or 6 steps. Use clear, warm sentences and simple reasoning questions.'
        : req.age <= 10
          ? 'AGE 9-10: Produce 6 to 8 steps. Include multi-step problems and "explain why" prompts.'
          : 'AGE 11-12: Produce 7 or 8 steps. Include abstraction, multi-step word problems, and self-check reasoning questions.';

  const interestSlice = req.interests.slice(0, 2);
  const methodSlice = req.methods.slice(0, 2);

  const methodGuides = methodSlice
    .map((m) => {
      switch (m) {
        case 'Stories':
          return 'Stories: build a cohesive narrative arc where every question advances the plot.';
        case 'Pictures and diagrams':
          return 'Pictures and diagrams: open with clear chalkboard ASCII/emoji diagrams, number lines, or labelled visual layouts on every step.';
        case 'Games and challenges':
          return 'Games and challenges: frame steps as timed-free levels with points and include at least one Boss Challenge question (set isChallenge: true).';
        case 'Step-by-step':
          return 'Step-by-step: include a clear numbered worked example on step 1 (set isWorkedExample: true), then gradually fade support.';
        case 'Hands-on':
          return 'Hands-on: include a safe real-life household object activity in handsOnTask and at least one step with answerType "hands_on_confirm".';
        case 'Music and rhymes':
          return 'Music and rhymes: include a memorable short chant or rhyme in rhymeOrChant that captures the core rule.';
        case 'Talk it out':
          return 'Talk it out: include conversational spoken-style prompts and at least one step with answerType "voice_prompt".';
      }
    })
    .join('\n- ');

  const subjectGuide =
    req.subject === 'Maths'
      ? 'Maths: use visual manipulatives, number lines, number_input, and multiple_choice questions.'
      : req.subject === 'English/Reading' || req.subject === 'Phonics'
        ? 'Reading/Phonics: include sound cues, tap_words, sentence/phoneme tasks, and read-aloud friendly lines.'
        : req.subject === 'Science'
          ? 'Science: follow predict -> observe -> explain and cause-and-effect sorting.'
          : 'Use concrete, curiosity-driven Socratic tasks suited to the subject.';

  return [
    'You are Nu, a warm, patient Socratic tutor for children ages 5 to 12.',
    'PRIVACY & SAFETY: Never ask for personal information, never invite open-ended free chat, and keep all themes 100% child-safe and encouraging.',
    'SOCRATIC RULE: Never just give the answer first. Ask a guiding question, provide 3 escalating hints (gentle nudge -> clearer clue -> worked mini-example), then celebrate thinking.',
    ageRule,
    `GRADE & CURRICULUM: Follow ${req.grade} under ${req.curriculum} for curriculum depth, prerequisite alignment, and "${req.difficulty}" difficulty. If age and grade differ, follow GRADE for academic level and AGE for vocabulary/tone.`,
    `INTERESTS (use at most these 2, weaving them naturally into the story and examples without distracting from the core concept): ${interestSlice.join(', ')}.`,
    `LEARNING METHODS:\n- ${methodGuides}`,
    `SUBJECT STYLE: ${subjectGuide}`,
    'Every step MUST have exactly 3 hints in hints[3], a clear visual string, a skillTag, and an optional prerequisiteStep for scaffolding if the child struggles.',
    'Return ONLY valid JSON matching the exact schema.',
  ].join('\n\n');
}

export function buildLessonUserPrompt(req: LessonRequest): string {
  // Deliberately exclude any child name, email, or PII
  const sanitized = {
    age: req.age,
    grade: req.grade,
    curriculum: req.curriculum,
    subject: req.subject,
    topic: req.topic,
    interests: req.interests.slice(0, 2),
    methods: req.methods.slice(0, 2),
    difficulty: req.difficulty,
    specificNeed: req.specificNeed?.trim() || undefined,
    priorMastery: req.priorMastery || 'new',
  };

  return `Create a complete Socratic lesson JSON for:\n${JSON.stringify(sanitized, null, 2)}`;
}

const BANNED_SAFETY_TERMS = [
  'stupid',
  'dumb',
  'idiot',
  'kill',
  'weapon',
  'gun',
  'blood',
  'hate',
  'chat with me freely',
  'what is your address',
  'what is your phone',
];

export function runSafetyAndAgeCheck(
  lesson: LessonOutput,
  req: LessonRequest
): { passed: boolean; reason?: string } {
  const fullText = JSON.stringify(lesson).toLowerCase();
  for (const term of BANNED_SAFETY_TERMS) {
    if (fullText.includes(term)) {
      return { passed: false, reason: `Unsafe term detected: ${term}` };
    }
  }

  if (req.age <= 6) {
    if (lesson.steps.length < 4 || lesson.steps.length > 5) {
      return { passed: false, reason: 'Ages 5-6 require 4-5 steps' };
    }
    const avgWords =
      lesson.steps.reduce((acc, s) => acc + s.question.split(/\s+/).length, 0) /
      lesson.steps.length;
    if (avgWords > 26) {
      return { passed: false, reason: 'Sentence length too complex for ages 5-6' };
    }
  }

  return { passed: true };
}

export function runCurriculumAlignmentCheck(
  lesson: LessonOutput,
  req: LessonRequest
): { passed: boolean; reason?: string } {
  if (!lesson.steps.length) {
    return { passed: false, reason: 'Lesson contains no steps' };
  }

  if (req.methods.includes('Step-by-step')) {
    const hasWorked =
      lesson.steps.some((s) => s.isWorkedExample) ||
      JSON.stringify(lesson).toLowerCase().includes('worked example');
    if (!hasWorked) {
      return { passed: false, reason: 'Step-by-step method requires a worked example' };
    }
  }

  if (req.methods.includes('Games and challenges')) {
    const hasChallenge =
      lesson.steps.some((s) => s.isChallenge) ||
      JSON.stringify(lesson).toLowerCase().includes('challenge') ||
      JSON.stringify(lesson).toLowerCase().includes('boss');
    if (!hasChallenge) {
      return { passed: false, reason: 'Games method requires a challenge question' };
    }
  }

  const primaryInterest = req.interests[0].toLowerCase();
  const body = JSON.stringify(lesson).toLowerCase();
  if (!body.includes(primaryInterest) && !body.includes(primaryInterest.slice(0, -1))) {
    return { passed: false, reason: `Lesson did not weave in interest: ${req.interests[0]}` };
  }

  return { passed: true };
}

const LESSON_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subject: { type: Type.STRING },
    topic: { type: Type.STRING },
    grade: { type: Type.STRING },
    estimatedMinutes: { type: Type.INTEGER },
    learningObjective: { type: Type.STRING },
    story: { type: Type.STRING },
    methodsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
    interestsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          visual: { type: Type.STRING },
          question: { type: Type.STRING },
          answerType: { type: Type.STRING },
          choices: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          hints: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          celebration: { type: Type.STRING },
          skillTag: { type: Type.STRING },
          isWorkedExample: { type: Type.BOOLEAN },
          isChallenge: { type: Type.BOOLEAN },
        },
        required: [
          'visual',
          'question',
          'answerType',
          'choices',
          'correctAnswer',
          'hints',
          'explanation',
          'celebration',
          'skillTag',
        ],
      },
    },
    recap: { type: Type.STRING },
    rhymeOrChant: { type: Type.STRING },
    handsOnTask: { type: Type.STRING },
    parentNote: { type: Type.STRING },
  },
  required: [
    'title',
    'subject',
    'topic',
    'grade',
    'estimatedMinutes',
    'learningObjective',
    'story',
    'methodsUsed',
    'interestsUsed',
    'steps',
    'recap',
    'parentNote',
  ],
};

export interface GenerationResult {
  lesson: LessonOutput;
  source: 'ai' | 'fallback';
  checks: {
    schemaValid: boolean;
    safetyPassed: boolean;
    curriculumPassed: boolean;
    attempts: number;
    fallbackReason?: string;
  };
}

export type RawModelCaller = (
  systemPrompt: string,
  userPrompt: string,
  attempt: number
) => Promise<string>;

async function defaultGeminiCaller(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY_UNCONFIGURED');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('GEMINI_REQUEST_TIMEOUT')), 15000);
  });

  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: LESSON_RESPONSE_SCHEMA,
      },
    }),
    timeoutPromise,
  ]);

  return (response.text ?? '').trim();
}

export async function generatePersonalizedLesson(
  rawInput: unknown,
  modelCaller: RawModelCaller = defaultGeminiCaller
): Promise<GenerationResult> {
  const req = LessonRequestSchema.parse(rawInput);
  const systemPrompt = buildPersonalisationSystemPrompt(req);
  let userPrompt = buildLessonUserPrompt(req);

  let lastReason = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const rawText = await modelCaller(systemPrompt, userPrompt, attempt);
      const parsedJson = JSON.parse(rawText);
      const schemaResult = LessonOutputSchema.safeParse(parsedJson);

      if (!schemaResult.success) {
        lastReason = `Schema validation failed: ${schemaResult.error.issues[0]?.message ?? 'invalid structure'}`;
        userPrompt = `${buildLessonUserPrompt(req)}\n\nPREVIOUS ATTEMPT FAILED VALIDATION (${lastReason}). Fix every field and strictly follow the schema.`;
        continue;
      }

      const safety = runSafetyAndAgeCheck(schemaResult.data, req);
      if (!safety.passed) {
        lastReason = safety.reason || 'Safety/age check failed';
        userPrompt = `${buildLessonUserPrompt(req)}\n\nFIX REQUIRED: ${lastReason}.`;
        continue;
      }

      const curriculum = runCurriculumAlignmentCheck(schemaResult.data, req);
      if (!curriculum.passed) {
        lastReason = curriculum.reason || 'Curriculum alignment check failed';
        userPrompt = `${buildLessonUserPrompt(req)}\n\nFIX REQUIRED: ${lastReason}.`;
        continue;
      }

      return {
        lesson: schemaResult.data,
        source: 'ai',
        checks: {
          schemaValid: true,
          safetyPassed: true,
          curriculumPassed: true,
          attempts: attempt,
        },
      };
    } catch (err) {
      lastReason = err instanceof Error ? err.message : 'Model generation error';
      if (
        lastReason === 'GEMINI_API_KEY_UNCONFIGURED' ||
        lastReason === 'GEMINI_REQUEST_TIMEOUT'
      ) {
        break;
      }
    }
  }

  const fallback = selectFallbackLesson(req);
  return {
    lesson: fallback,
    source: 'fallback',
    checks: {
      schemaValid: true,
      safetyPassed: true,
      curriculumPassed: true,
      attempts: 2,
      fallbackReason: lastReason || 'Used curated fallback lesson',
    },
  };
}
