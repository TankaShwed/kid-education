import type { ClassifyLetterRound } from './types';
import { VOWELS, CONSONANTS } from '@/domain/letters';

/** Число букв в раунде (гласных + согласных с повторами) */
const LETTERS_PER_ROUND = 8;

/**
 * Создать новый раунд «гласная или согласная»: массив букв (гласные и согласные, с повторами) в случайном порядке.
 *
 * @returns раунд для slice и UI
 */
export function createClassifyLetterRound(): ClassifyLetterRound {
  const vowels = [...VOWELS];
  const consonants = [...CONSONANTS];
  const letters: string[] = [];

  const half = Math.floor(LETTERS_PER_ROUND / 2);
  for (let i = 0; i < half; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]!);
  }
  for (let i = 0; i < LETTERS_PER_ROUND - half; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]!);
  }

  return {
    type: 'classifyLetter',
    letters: letters.sort(() => Math.random() - 0.5),
  };
}
