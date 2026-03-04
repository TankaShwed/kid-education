/**
 * Гласные и согласные буквы русского алфавита для заданий (напр. «гласная или согласная»).
 */

/** Гласные буквы русского алфавита */
export const VOWELS: readonly string[] = [
  'А', 'О', 'У', 'Ы', 'И', 'Е', 'Я', 'Ю', 'Ё',
];

/** Согласные буквы, используемые в слогах проекта (syllables.ts) */
export const CONSONANTS: readonly string[] = [
  'Н', 'К', 'М', 'П', 'С', 'Т', 'Р', 'Л', 'В', 'Б', 'Д', 'Г', 'З', 'Ж', 'Ш', 'Ч', 'Ф', 'Х',
];

const VOWEL_SET = new Set(VOWELS);

/**
 * Проверяет, является ли буква гласной.
 * @param letter — одна заглавная буква
 */
export function isVowel(letter: string): boolean {
  return VOWEL_SET.has(letter.toUpperCase());
}
