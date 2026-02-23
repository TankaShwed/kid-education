import type {
  PickSyllableRound,
  ComposeSyllableRound,
  Syllable,
  DifficultyLevel,
} from './types';
import { SYLLABLES, pickRandomSyllables } from './syllables';

/** Создать новый раунд «выбери слог» с заданным числом вариантов */
export function createPickSyllableRound(
  optionsCount: DifficultyLevel
): PickSyllableRound {
  const target = SYLLABLES[
    Math.floor(Math.random() * SYLLABLES.length)
  ] as Syllable;
  const options = pickRandomSyllables(target, optionsCount);
  return { type: 'pickSyllable', target, options };
}

/** Создать новый раунд «собери слог»: буквы target разбросаны, нужно собрать в слоты */
export function createComposeSyllableRound(): ComposeSyllableRound {
  const target = SYLLABLES[
    Math.floor(Math.random() * SYLLABLES.length)
  ] as Syllable;
  const letters = [...target].sort(() => Math.random() - 0.5);
  return { type: 'composeSyllable', target, letters };
}
