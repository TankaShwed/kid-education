import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PairSyllableRound } from './types';
import type { Syllable } from '@/domain/types';

/** Одна буква на экране (фаза 1) */
export interface PairSyllableLetter {
  id: string;
  letter: string;
  position: { x: number; y: number };
}

/** Собранный слог (чип для отображения и клика в фазе 2) */
export interface FormedSyllable {
  id: string;
  syllable: Syllable;
}

/**
 * Состояние задания «Сложи слог» в store (ключ `pairSyllable`).
 *
 * @remarks
 * phase: pairing — сборка пар букв; finding — поиск слога кликом.
 * letters — непарные буквы; formedSyllables — собранные слоги.
 */
export interface PairSyllableState {
  phase: 'pairing' | 'finding';
  letters: PairSyllableLetter[];
  formedSyllables: FormedSyllable[];
  hasStarted: boolean;
  spoken: boolean;
  findingStatus: 'idle' | 'correct' | 'wrong';
  wrongSyllableId: string | null;
}

const AREA_W = 80;
const AREA_H = 55;

function randomPosition(): { x: number; y: number } {
  return {
    x: 5 + Math.random() * AREA_W,
    y: 10 + Math.random() * AREA_H,
  };
}

function buildLettersFromRound(round: PairSyllableRound): PairSyllableLetter[] {
  const letters: string[] = [];
  for (const syl of round.syllables) {
    for (const char of syl) {
      letters.push(char);
    }
  }
  const shuffled = [...letters].sort(() => Math.random() - 0.5);
  return shuffled.map((letter, index) => ({
    id: `letter-${index}-${letter}-${Math.random().toString(36).slice(2, 8)}`,
    letter,
    position: randomPosition(),
  }));
}

const initialState: PairSyllableState = {
  phase: 'pairing',
  letters: [],
  formedSyllables: [],
  hasStarted: false,
  spoken: false,
  findingStatus: 'idle',
  wrongSyllableId: null,
};

export const pairSyllableSlice = createSlice({
  name: 'pairSyllable',
  initialState,
  reducers: {
    /** Сброс при новом раунде. */
    reset(_state, action: PayloadAction<PairSyllableRound>) {
      return {
        phase: 'pairing',
        letters: buildLettersFromRound(action.payload),
        formedSyllables: [],
        hasStarted: false,
        spoken: false,
        findingStatus: 'idle',
        wrongSyllableId: null,
      };
    },
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    instructionDone(state) {
      state.spoken = true;
    },
    /** Успешная склейка пары: убрать две буквы, добавить слог. */
    pairFormed(
      state,
      action: PayloadAction<{ syllable: Syllable; letterIds: [string, string] }>
    ) {
      const { syllable, letterIds } = action.payload;
      state.letters = state.letters.filter(
        (l) => l.id !== letterIds[0] && l.id !== letterIds[1]
      );
      state.formedSyllables.push({
        id: `syl-${state.formedSyllables.length}-${syllable}-${Math.random().toString(36).slice(2, 6)}`,
        syllable,
      });
    },
    /** Дроп отклонён (неверный порядок или слог не из раунда). Сага озвучивает фидбек. */
    pairRejected(
      _state,
      _action: PayloadAction<{ reason: 'wrongOrder' | 'notInRound' }>
    ) {
      // состояние букв не меняется
    },
    /** Все пары собраны; переключить в фазу «найди слог». Вызывается сагой. */
    setPhaseFinding(state) {
      state.phase = 'finding';
    },
    /** Пользователь выбрал слог в фазе 2 — верно. */
    chooseCorrect(state) {
      state.findingStatus = 'correct';
    },
    /** Пользователь выбрал неверный слог. */
    chooseWrong(state, action: PayloadAction<string>) {
      state.findingStatus = 'wrong';
      state.wrongSyllableId = action.payload;
    },
    wrongDone(state) {
      state.wrongSyllableId = null;
      state.findingStatus = 'idle';
    },
  },
});

export const {
  reset,
  startRound,
  instructionDone,
  pairFormed,
  pairRejected,
  setPhaseFinding,
  chooseCorrect,
  chooseWrong,
  wrongDone,
} = pairSyllableSlice.actions;
