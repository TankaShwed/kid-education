/**
 * Разбиение слова на части для отображения по слогам и для TTS.
 * Слог = одна или несколько согласных + одна гласная (одна часть);
 * одиночная согласная или гласная — отдельная часть.
 */

import { isVowel } from './letters';

/**
 * Разбивает слово на части для визуализации и озвучки.
 * Согласная + гласная (C+V) — одна часть (слог). Последовательно идущие согласные — каждая отдельной частью.
 * Гласная — отдельная часть.
 *
 * @example
 * splitWordIntoParts('МАМА') // ['МА', 'МА']
 * splitWordIntoParts('СТОЛ') // ['С', 'ТО', 'Л']
 * splitWordIntoParts('СОК')  // ['СО', 'К']
 * splitWordIntoParts('СЛОН') // ['С', 'Л', 'О', 'Н']
 */
export function splitWordIntoParts(word: string): string[] {
  const parts: string[] = [];
  const upper = word.toUpperCase().replace(/\s/g, '');
  let i = 0;

  while (i < upper.length) {
    const letter = upper[i]!;
    if (isVowel(letter)) {
      parts.push(letter);
      i += 1;
      continue;
    }
    // Согласная: если следующая буква — гласная, объединяем C+V в одну часть; иначе одна буква
    const next = i + 1 < upper.length ? upper[i + 1]! : null;
    if (next !== null && isVowel(next)) {
      parts.push(letter + next);
      i += 2;
    } else {
      parts.push(letter);
      i += 1;
    }
  }

  return parts;
}
