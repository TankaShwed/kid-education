import type { PickSyllableRound, Syllable, DifficultyLevel } from './types'
import { SYLLABLES, pickRandomSyllables } from './syllables'

/** Создать новый раунд «выбери слог» с заданным числом вариантов */
export function createPickSyllableRound(
  optionsCount: DifficultyLevel
): PickSyllableRound {
  const target =
    SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)] as Syllable
  const options = pickRandomSyllables(target, optionsCount)
  return { type: 'pickSyllable', target, options }
}
