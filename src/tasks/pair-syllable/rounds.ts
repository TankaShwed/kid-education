import type { PairSyllableRound } from './types';
import type { Syllable } from '@/domain/types';
import { SYLLABLES } from '@/domain/syllables';

/** Число слогов в раунде (из них собираются буквы, затем один ищется) */
const SYLLABLES_PER_ROUND = 4;

/**
 * Создать новый раунд «сложи слог»: 3–4 слога из SYLLABLES, буквы раунда = все буквы этих слогов;
 * targetFind — один из выбранных слогов для фазы «найди слог».
 */
export function createPairSyllableRound(): PairSyllableRound {
  const pool = [...SYLLABLES].sort(() => Math.random() - 0.5);
  const count = Math.min(SYLLABLES_PER_ROUND, pool.length);
  const syllables = pool.slice(0, count) as Syllable[];
  const targetIndex = Math.floor(Math.random() * syllables.length);
  const targetFind = syllables[targetIndex]!;
  return {
    type: 'pairSyllable',
    syllables,
    targetFind,
  };
}
