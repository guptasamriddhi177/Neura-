const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const FRACTION_DENOMINATORS: Record<string, number> = {
  half: 2,
  halves: 2,
  third: 3,
  thirds: 3,
  fourth: 4,
  fourths: 4,
  quarter: 4,
  quarters: 4,
  fifth: 5,
  fifths: 5,
  sixth: 6,
  sixths: 6,
  eighth: 8,
  eighths: 8,
  tenth: 10,
  tenths: 10,
};

const ORDINAL_INDEX: Record<string, number> = {
  first: 0,
  a: 0,
  one: 0,
  '1': 0,
  second: 1,
  b: 1,
  two: 1,
  '2': 1,
  third: 2,
  c: 2,
  three: 2,
  '3': 2,
  fourth: 3,
  d: 3,
  four: 3,
  '4': 3,
};

export function normalizeSpokenText(raw: string): string {
  let text = raw.toLowerCase().replace(/[.,!?]/g, ' ').replace(/\s+/g, ' ').trim();

  // Handle common spoken fractions like "one half", "two fourths", "three quarters"
  text = text.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(half|halves|third|thirds|fourth|fourths|quarter|quarters|fifth|fifths|sixth|sixths|eighth|eighths|tenth|tenths)\b/g,
    (_m, numWord: string, denomWord: string) => {
      const n = NUMBER_WORDS[numWord] ?? Number(numWord);
      const d = FRACTION_DENOMINATORS[denomWord];
      if (!Number.isNaN(n) && d) {
        return `${n}/${d}`;
      }
      return _m;
    }
  );

  // Convert compound tens + ones e.g. "thirty seven" -> "37"
  text = text.replace(
    /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]+(one|two|three|four|five|six|seven|eight|nine)\b/g,
    (_m, tensWord: string, onesWord: string) => {
      return String(NUMBER_WORDS[tensWord] + NUMBER_WORDS[onesWord]);
    }
  );

  // Convert standalone number words
  text = text
    .split(' ')
    .map((tok) => (tok in NUMBER_WORDS ? String(NUMBER_WORDS[tok]) : tok))
    .join(' ');

  return text;
}

export interface SpeechMatchResult {
  matchedValue: string;
  matchedChoiceIndex: number | null;
  displayHeard: string;
}

export function matchSpokenAnswer(
  transcript: string,
  choices: string[],
  answerType: string,
  correctAnswer: string
): SpeechMatchResult {
  const normalized = normalizeSpokenText(transcript);

  // For numeric input steps, prefer extracting a clean number or fraction token
  if (answerType === 'number_input') {
    const numericMatch = normalized.match(/-?\d+(\.\d+)?(\/\d+)?/);
    if (numericMatch) {
      return {
        matchedValue: numericMatch[0],
        matchedChoiceIndex: null,
        displayHeard: transcript.trim(),
      };
    }
  }

  // Check explicit option commands like "option b", "choice 2", "the first one"
  const optionCmd = normalized.match(/\b(?:option|choice|number|answer)\s+(a|b|c|d|1|2|3|4|first|second|third|fourth)\b/);
  if (optionCmd) {
    const idx = ORDINAL_INDEX[optionCmd[1]];
    if (idx !== undefined && choices[idx]) {
      return {
        matchedValue: choices[idx],
        matchedChoiceIndex: idx,
        displayHeard: transcript.trim(),
      };
    }
  }

  const spokenTokens = new Set(
    normalized.split(' ').filter((w) => w.length > 0 && !['the', 'a', 'an', 'is', 'its', 'it'].includes(w))
  );

  // Direct substring match or highest meaningful token overlap against choices
  let bestIdx: number | null = null;
  let bestScore = 0;

  choices.forEach((choice, idx) => {
    const normChoice = normalizeSpokenText(choice);
    if (normalized === normChoice || normalized.includes(normChoice) || normChoice.includes(normalized)) {
      const score = 100 + normChoice.length;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
      return;
    }

    const choiceTokens = normChoice
      .split(' ')
      .filter((w) => w.length > 0 && !['the', 'a', 'an', 'is', 'because', 'and', 'or', 'to', 'of'].includes(w));

    let overlap = 0;
    for (const tok of choiceTokens) {
      if (spokenTokens.has(tok)) overlap += 1;
    }
    if (overlap > 0) {
      const ratioScore = (overlap / Math.max(1, choiceTokens.length)) * 50 + overlap;
      if (ratioScore > bestScore) {
        bestScore = ratioScore;
        bestIdx = idx;
      }
    }
  });

  if (bestIdx !== null && bestScore >= 12) {
    return {
      matchedValue: choices[bestIdx],
      matchedChoiceIndex: bestIdx,
      displayHeard: transcript.trim(),
    };
  }

  // For voice_prompt open reasoning, check if child explained the core idea even in their own words
  if (answerType === 'voice_prompt') {
    const correctTokens = normalizeSpokenText(correctAnswer)
      .split(' ')
      .filter((w) => w.length > 3);
    const hits = correctTokens.filter((w) => spokenTokens.has(w)).length;
    if (hits >= 2) {
      return {
        matchedValue: correctAnswer,
        matchedChoiceIndex: choices.indexOf(correctAnswer) >= 0 ? choices.indexOf(correctAnswer) : null,
        displayHeard: transcript.trim(),
      };
    }
  }

  return {
    matchedValue: normalized || transcript.trim(),
    matchedChoiceIndex: null,
    displayHeard: transcript.trim(),
  };
}
