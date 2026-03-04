import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ClassifyLetterRound } from './types';
import { isVowel } from '@/domain/letters';

/** Одна буква на экране с позицией и статусом */
export interface ClassifyLetterItem {
  id: string;
  letter: string;
  position: { x: number; y: number };
  /** В какой зоне зафиксирована при правильном ответе */
  placedZone: null | 'vowel' | 'consonant';
}

/**
 * Состояние задания «Гласная или согласная» в store (ключ `classifyLetter`).
 *
 * @remarks
 * items — буквы с позициями и статусом (placedZone). hasStarted/spoken — озвучка инструкции.
 * wrongLetterId — id буквы для воспроизведения анимации «неправильно», сбрасывается в wrongDone.
 */
export interface ClassifyLetterState {
  items: ClassifyLetterItem[];
  hasStarted: boolean;
  spoken: boolean;
  /** id буквы, для которой показываем анимацию wrong; сбрасывается в wrongDone */
  wrongLetterId: string | null;
}

const AREA_W = 70;
const AREA_H = 50;

function randomPosition(): { x: number; y: number } {
  return {
    x: 10 + Math.random() * AREA_W,
    y: 15 + Math.random() * AREA_H,
  };
}

const initialState: ClassifyLetterState = {
  items: [],
  hasStarted: false,
  spoken: false,
  wrongLetterId: null,
};

export const classifyLetterSlice = createSlice({
  name: 'classifyLetter',
  initialState,
  reducers: {
    /** Сброс при новом раунде; вызывается из nextRound thunk. */
    reset(_state, action: PayloadAction<ClassifyLetterRound>) {
      const letters = action.payload.letters;
      const items: ClassifyLetterItem[] = letters.map((letter, index) => ({
        id: `letter-${index}-${letter}-${Math.random().toString(36).slice(2, 8)}`,
        letter,
        position: randomPosition(),
        placedZone: null,
      }));
      return {
        items,
        hasStarted: false,
        spoken: false,
        wrongLetterId: null,
      };
    },
    /** Пользователь начал раунд; сага озвучивает инструкцию, диспатчит instructionDone. */
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    instructionDone(state) {
      state.spoken = true;
    },
    /** Озвучить букву при захвате (сага слушает и вызывает TTS). */
    speakLetter(_state, _action: PayloadAction<string>) {
      // нет изменений состояния; сага реагирует
    },
    /**
     * Пользователь отпустил букву в зоне. Payload — letterId, зона и результат (для саги).
     * Редьюсер проверяет правильность и обновляет placedZone или position + wrongLetterId.
     */
    dropInZone(
      state,
      action: PayloadAction<{
        letterId: string;
        zone: 'vowel' | 'consonant';
        result: 'correct' | 'wrong';
      }>
    ) {
      const { letterId, zone, result } = action.payload;
      const item = state.items.find((i) => i.id === letterId);
      if (!item || item.placedZone !== null) return;

      if (result === 'correct') {
        item.placedZone = zone;
      } else {
        item.position = randomPosition();
        state.wrongLetterId = letterId;
      }
    },
    /** Сага закончила озвучку при ошибке; сбрасываем индикатор анимации wrong. */
    wrongDone(state) {
      state.wrongLetterId = null;
    },
  },
});

export const {
  reset,
  startRound,
  instructionDone,
  speakLetter,
  dropInZone,
  wrongDone,
} = classifyLetterSlice.actions;
