import type {
  PickSyllableRound,
  ComposeSyllableRound,
  Syllable,
  DifficultyLevel,
} from './types';
import { SYLLABLES, pickRandomSyllables } from './syllables';

/**
 * Создать новый раунд «выбери слог» с заданным числом вариантов.
 * Целевой слог и варианты берутся из домена слогов (syllables.ts).
 *
 * @param optionsCount — число вариантов на экране (3–6)
 * @returns раунд для slice и UI
 */
export function createPickSyllableRound(
  optionsCount: DifficultyLevel
): PickSyllableRound {
  const target = SYLLABLES[
    Math.floor(Math.random() * SYLLABLES.length)
  ] as Syllable;
  const options = pickRandomSyllables(target, optionsCount);
  return { type: 'pickSyllable', target, options };
}

/**
 * Создать новый раунд «собери слог»: буквы целевого слога в случайном порядке.
 * Раунд создаётся из домена слогов (syllables.ts).
 *
 * @returns раунд для slice и UI (target, letters для перетаскивания)
 */
export function createComposeSyllableRound(): ComposeSyllableRound {
  const target = SYLLABLES[
    Math.floor(Math.random() * SYLLABLES.length)
  ] as Syllable;
  const letters = [...target].sort(() => Math.random() - 0.5);
  return { type: 'composeSyllable', target, letters };
}
