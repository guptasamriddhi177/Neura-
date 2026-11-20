import type { CurriculumId, GradeId } from '../types/neura.ts';

export const CURRICULUM_GRADE_LABELS: Record<CurriculumId, Record<GradeId, string>> = {
  'US Common Core': {
    'Pre-K': 'Pre-Kindergarten',
    K: 'Kindergarten',
    'Grade 1': 'Grade 1 (Common Core)',
    'Grade 2': 'Grade 2 (Common Core)',
    'Grade 3': 'Grade 3 (Common Core)',
    'Grade 4': 'Grade 4 (Common Core)',
    'Grade 5': 'Grade 5 (Common Core)',
    'Grade 6': 'Grade 6 (Common Core)',
  },
  'UK National Curriculum': {
    'Pre-K': 'Nursery / Early Years',
    K: 'Reception (EYFS)',
    'Grade 1': 'Year 1 (KS1)',
    'Grade 2': 'Year 2 (KS1)',
    'Grade 3': 'Year 3 (Lower KS2)',
    'Grade 4': 'Year 4 (Lower KS2)',
    'Grade 5': 'Year 5 (Upper KS2)',
    'Grade 6': 'Year 6 (Upper KS2)',
  },
  Nigeria: {
    'Pre-K': 'Nursery 1–2',
    K: 'Kindergarten / KG',
    'Grade 1': 'Primary 1',
    'Grade 2': 'Primary 2',
    'Grade 3': 'Primary 3',
    'Grade 4': 'Primary 4',
    'Grade 5': 'Primary 5',
    'Grade 6': 'Primary 6',
  },
  'India CBSE': {
    'Pre-K': 'Nursery / LKG',
    K: 'UKG / Prep',
    'Grade 1': 'Class 1 (CBSE)',
    'Grade 2': 'Class 2 (CBSE)',
    'Grade 3': 'Class 3 (CBSE)',
    'Grade 4': 'Class 4 (CBSE)',
    'Grade 5': 'Class 5 (CBSE)',
    'Grade 6': 'Class 6 (CBSE)',
  },
  General: {
    'Pre-K': 'Pre-K (Ages 4–5)',
    K: 'Kindergarten (Ages 5–6)',
    'Grade 1': 'Grade 1 (Ages 6–7)',
    'Grade 2': 'Grade 2 (Ages 7–8)',
    'Grade 3': 'Grade 3 (Ages 8–9)',
    'Grade 4': 'Grade 4 (Ages 9–10)',
    'Grade 5': 'Grade 5 (Ages 10–11)',
    'Grade 6': 'Grade 6 (Ages 11–12)',
  },
};

export function getLocalizedGradeLabel(curriculum: CurriculumId, grade: GradeId): string {
  return CURRICULUM_GRADE_LABELS[curriculum]?.[grade] ?? grade;
}

export function suggestGradeFromAge(age: number): GradeId {
  if (age <= 5) return 'K';
  if (age === 6) return 'Grade 1';
  if (age === 7) return 'Grade 2';
  if (age === 8) return 'Grade 3';
  if (age === 9) return 'Grade 4';
  if (age === 10) return 'Grade 5';
  return 'Grade 6';
}
