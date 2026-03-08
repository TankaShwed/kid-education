/**
 * Типы задания «Сложить гласную и согласную, озвучить слог».
 * @see docs/ROADMAP.md
 */

import type { Syllable } from '@/domain/types';

/** Конфигурация задания «сложи слог» (DnD буква-на-букву, затем «найди слог») */
export interface PairSyllableTaskConfig {
  type: 'pairSyllable';
  /** Пока без параметров сложности; позже — число слогов в раунде */
}

/** Раунд: набор слогов для сборки из букв, один из них — цель для фазы «найди слог» */
export interface PairSyllableRound {
  type: 'pairSyllable';
  /** Слоги, которые нужно собрать из разбросанных букв (3–4 слога) */
  source_syllables: Syllable[];
}
