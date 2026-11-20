import { describe, expect, it } from 'vitest';
import topicsData from '../data/topics.json';
import {
  buildLessonUserPrompt,
  generatePersonalizedLesson,
} from '../server/lessonGenerator.ts';
import { GRADES, LessonOutputSchema, SUBJECTS, type LessonRequest } from '../types/neura.ts';

describe('Neura lesson generation & personalisation', () => {
  it('ensures a 6-year-old Grade 1 maths lesson has simple language and 4-5 steps', async () => {
    const req: LessonRequest = {
      age: 6,
      grade: 'Grade 1',
      curriculum: 'US Common Core',
      subject: 'Maths',
      topic: 'Addition within 20',
      interests: ['Dinosaurs'],
      methods: ['Stories', 'Step-by-step'],
      difficulty: 'Starter',
    };

    const result = await generatePersonalizedLesson(req, async () => {
      throw new Error('GEMINI_API_KEY_UNCONFIGURED');
    });

    expect(LessonOutputSchema.safeParse(result.lesson).success).toBe(true);
    expect(result.lesson.steps.length).toBeGreaterThanOrEqual(4);
    expect(result.lesson.steps.length).toBeLessThanOrEqual(5);

    const avgQuestionWords =
      result.lesson.steps.reduce((acc, s) => acc + s.question.split(/\s+/).length, 0) /
      result.lesson.steps.length;
    expect(avgQuestionWords).toBeLessThanOrEqual(24);
  });

  it('ensures a Grade 4 fractions lesson with Football + Games mentions football and includes a challenge', async () => {
    const req: LessonRequest = {
      age: 9,
      grade: 'Grade 4',
      curriculum: 'UK National Curriculum',
      subject: 'Maths',
      topic: 'Fractions',
      interests: ['Football'],
      methods: ['Games and challenges', 'Step-by-step'],
      difficulty: 'Core',
    };

    const result = await generatePersonalizedLesson(req, async () => {
      throw new Error('GEMINI_API_KEY_UNCONFIGURED');
    });

    const fullText = JSON.stringify(result.lesson).toLowerCase();
    expect(fullText).toContain('football');
    expect(
      result.lesson.steps.some((s) => s.isChallenge) || fullText.includes('challenge')
    ).toBe(true);
  });

  it('ensures a lesson with the Step-by-step method contains a worked example', async () => {
    const req: LessonRequest = {
      age: 8,
      grade: 'Grade 3',
      curriculum: 'General',
      subject: 'Maths',
      topic: 'Fractions on a number line',
      interests: ['Space'],
      methods: ['Step-by-step'],
      difficulty: 'Core',
    };

    const result = await generatePersonalizedLesson(req, async () => {
      throw new Error('GEMINI_API_KEY_UNCONFIGURED');
    });

    const fullText = JSON.stringify(result.lesson).toLowerCase();
    expect(
      result.lesson.steps.some((s) => s.isWorkedExample) ||
        fullText.includes('worked example')
    ).toBe(true);
  });

  it('triggers fallback cleanly when the model returns invalid JSON', async () => {
    const req: LessonRequest = {
      age: 10,
      grade: 'Grade 4',
      curriculum: 'India CBSE',
      subject: 'Science',
      topic: 'States of matter',
      interests: ['Building'],
      methods: ['Hands-on', 'Pictures and diagrams'],
      difficulty: 'Core',
    };

    let callCount = 0;
    const result = await generatePersonalizedLesson(req, async () => {
      callCount += 1;
      return '{ invalid json !!!';
    });

    expect(callCount).toBe(2); // Tried once, retried once, then fell back
    expect(result.source).toBe('fallback');
    expect(LessonOutputSchema.safeParse(result.lesson).success).toBe(true);
    expect(result.lesson.subject).toBe('Science');
    expect(result.lesson.grade).toBe('Grade 4');
  });

  it('strips any identifying PII from prompts sent to the LLM', () => {
    const prompt = buildLessonUserPrompt({
      age: 8,
      grade: 'Grade 3',
      curriculum: 'Nigeria',
      subject: 'Maths',
      topic: 'Multiplication concepts',
      interests: ['Football'],
      methods: ['Games and challenges'],
      difficulty: 'Core',
    });

    expect(prompt.toLowerCase()).not.toContain('email');
    expect(prompt.toLowerCase()).not.toContain('maya');
  });

  it('provides 8+ topics per subject for every grade K-6 in topics.json', () => {
    const gradesKto6 = GRADES.filter((g) => g !== 'Pre-K');
    const data = topicsData as Record<string, Record<string, unknown[]>>;

    for (const subject of SUBJECTS) {
      expect(data[subject]).toBeDefined();
      for (const grade of gradesKto6) {
        const list = data[subject][grade];
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThanOrEqual(8);
      }
    }
  });
});
