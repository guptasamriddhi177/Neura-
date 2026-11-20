import { z } from 'zod';

export const GRADES = [
  'Pre-K',
  'K',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
] as const;

export type GradeId = (typeof GRADES)[number];

export const CURRICULA = [
  'US Common Core',
  'UK National Curriculum',
  'Nigeria',
  'India CBSE',
  'General',
] as const;

export type CurriculumId = (typeof CURRICULA)[number];

export const SUBJECTS = [
  'Maths',
  'English/Reading',
  'Phonics',
  'Science',
  'Social Studies',
  'Coding basics',
  'Life skills',
] as const;

export type SubjectId = (typeof SUBJECTS)[number];

export const INTERESTS = [
  'Dinosaurs',
  'Space',
  'Football',
  'Animals',
  'Building',
  'Art',
  'Music',
  'Cooking',
  'Robots',
  'Superheroes',
  'Ocean',
  'Cars',
] as const;

export type InterestId = (typeof INTERESTS)[number];

export const LEARNING_METHODS = [
  'Stories',
  'Pictures and diagrams',
  'Games and challenges',
  'Step-by-step',
  'Hands-on',
  'Music and rhymes',
  'Talk it out',
] as const;

export type MethodId = (typeof LEARNING_METHODS)[number];

export const DIFFICULTIES = ['Starter', 'Core', 'Challenge'] as const;
export type DifficultyLevel = (typeof DIFFICULTIES)[number];

export const ANSWER_TYPES = [
  'multiple_choice',
  'number_input',
  'tap_words',
  'sorting',
  'hands_on_confirm',
  'voice_prompt',
] as const;

export type AnswerType = (typeof ANSWER_TYPES)[number];

export const LessonStepSchema = z.object({
  visual: z.string().min(4),
  question: z.string().min(4),
  answerType: z.enum(ANSWER_TYPES),
  choices: z.array(z.string()).min(1).max(6),
  correctAnswer: z.string().min(1),
  hints: z.tuple([z.string().min(3), z.string().min(3), z.string().min(3)]),
  explanation: z.string().min(4),
  celebration: z.string().min(2),
  skillTag: z.string().min(2),
  isWorkedExample: z.boolean().optional(),
  isChallenge: z.boolean().optional(),
  prerequisiteStep: z
    .object({
      visual: z.string(),
      question: z.string(),
      choices: z.array(z.string()).min(2),
      correctAnswer: z.string(),
      hint: z.string(),
      explanation: z.string(),
    })
    .optional(),
});

export type LessonStep = z.infer<typeof LessonStepSchema>;

export const LessonOutputSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  topic: z.string().min(2),
  grade: z.string().min(1),
  estimatedMinutes: z.number().min(3).max(30),
  learningObjective: z.string().min(5),
  story: z.string().min(10),
  methodsUsed: z.array(z.string()).min(1).max(2),
  interestsUsed: z.array(z.string()).min(1).max(2),
  steps: z.array(LessonStepSchema).min(4).max(8),
  recap: z.string().min(5),
  rhymeOrChant: z.string().optional(),
  handsOnTask: z.string().optional(),
  parentNote: z.string().min(5),
});

export type LessonOutput = z.infer<typeof LessonOutputSchema>;

export const LessonRequestSchema = z.object({
  age: z.number().int().min(5).max(12),
  grade: z.enum(GRADES),
  curriculum: z.enum(CURRICULA),
  subject: z.enum(SUBJECTS),
  topic: z.string().min(2).max(120),
  interests: z.array(z.enum(INTERESTS)).min(1).max(3),
  methods: z.array(z.enum(LEARNING_METHODS)).min(1).max(2),
  difficulty: z.enum(DIFFICULTIES),
  specificNeed: z.string().max(300).optional(),
  priorMastery: z.enum(['needs_help', 'getting_there', 'clicking', 'new']).optional(),
});

export type LessonRequest = z.infer<typeof LessonRequestSchema>;

export interface TopicItem {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  prerequisiteTopicTitle?: string;
}

export interface ChildProfile {
  id: string;
  childName: string; // Stored strictly locally in browser; never sent to LLM
  age: number;
  grade: GradeId;
  curriculum: CurriculumId;
  interests: InterestId[];
  methods: MethodId[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillTelemetry {
  skillTag: string;
  attempts: number;
  hintsUsed: number;
  timeSeconds: number;
  correctFirstTry: boolean;
  droppedToPrereq: boolean;
  rapidSkipped: boolean;
}

export interface LessonProgressRecord {
  id: string;
  completedAt: string;
  subject: SubjectId;
  topic: string;
  grade: GradeId;
  difficulty: DifficultyLevel;
  interestsUsed: string[];
  methodsUsed: string[];
  durationSeconds: number;
  accuracyPercent: number;
  hintsTotal: number;
  status: 'Clicking' | 'Getting there' | 'Needs help';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  skillBreakdown: SkillTelemetry[];
  noteForParent: string;
}
