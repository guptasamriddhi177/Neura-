import { describe, expect, it } from 'vitest';
import { matchSpokenAnswer, normalizeSpokenText } from '../utils/speechMatch.ts';

describe('Web Speech API spoken answer matching', () => {
  it('converts spoken number words and compound numbers to digits', () => {
    expect(normalizeSpokenText('thirteen')).toBe('13');
    expect(normalizeSpokenText('thirty seven')).toBe('37');
    expect(normalizeSpokenText('two eggs')).toBe('2 eggs');
  });

  it('converts spoken fractions into numeric fraction strings', () => {
    expect(normalizeSpokenText('two fourths')).toBe('2/4');
    expect(normalizeSpokenText('three quarters')).toBe('3/4');
    expect(normalizeSpokenText('four sixths')).toBe('4/6');
  });

  it('matches spoken numbers to numeric_input steps', () => {
    const res = matchSpokenAnswer('the answer is thirteen', ['12', '13', '15'], 'number_input', '13');
    expect(res.matchedValue).toBe('13');
  });

  it('matches spoken option letters or numbers to multiple choice options', () => {
    const choices = ['1/4', '2/4', '3/4'];
    expect(matchSpokenAnswer('option b', choices, 'multiple_choice', '2/4').matchedValue).toBe('2/4');
    expect(matchSpokenAnswer('two fourths', choices, 'multiple_choice', '2/4').matchedValue).toBe('2/4');
  });

  it('recognises open-ended spoken reasoning for voice_prompt steps', () => {
    const correct =
      'Because "Friendship takes patience" is a general lesson for anyone, while Sam and Leo are specific story details.';
    const res = matchSpokenAnswer(
      'Because friendship takes patience is a general lesson for anyone and Sam and Leo are story details',
      [correct, 'Because themes are always shorter than plot details.'],
      'voice_prompt',
      correct
    );
    expect(res.matchedValue).toBe(correct);
  });
});
