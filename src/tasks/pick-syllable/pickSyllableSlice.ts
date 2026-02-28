import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PickSyllableRound, Syllable } from '@/domain/types';

/**
 * Состояние задания «Выбери слог» в store (ключ `pickSyllable`).
 *
 * @remarks
 * - `options` — варианты на экране; при ошибке выбранный слог убирается.
 * - `status` — idle (ожидание выбора), wrong (озвучивается фидбек), correct (озвучивается «Правильно», затем следующий раунд).
 * - `hasStarted` / `spoken` — раунд начат и инструкция озвучена (сага реагирует на startRound и ставит instructionDone).
 */
export interface PickSyllableState {
  options: Syllable[];
  status: 'idle' | 'correct' | 'wrong';
  hasStarted: boolean;
  spoken: boolean;
}

const initialState: PickSyllableState = {
  options: [],
  status: 'idle',
  hasStarted: false,
  spoken: false,
};

export const pickSyllableSlice = createSlice({
  name: 'pickSyllable',
  initialState,
  reducers: {
    /** Сброс при новом раунде; вызывается из nextRound thunk. Payload — новый раунд. */
    reset(_state, action: PayloadAction<PickSyllableRound>) {
      return {
        options: [...action.payload.options],
        status: 'idle',
        hasStarted: false,
        spoken: false,
      };
    },
    /** Пользователь нажал «Начать»; сага озвучивает инструкцию и слог, затем диспатчит instructionDone. */
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    /** Сага закончила озвучку инструкции. */
    instructionDone(state) {
      state.spoken = true;
    },
    /** Выбран неверный слог. Payload — выбранный слог; сага озвучивает фидбек и диспатчит wrongDone. */
    chooseWrong(state, action: PayloadAction<Syllable>) {
      state.options = state.options.filter((s) => s !== action.payload);
      state.status = 'wrong';
    },
    /** Сага закончила озвучку фидбека при ошибке; снова можно выбирать. */
    wrongDone(state) {
      state.status = 'idle';
    },
    /** Выбран верный слог; сага озвучивает «Правильно» и вызывает dispatchNextRound(). */
    chooseCorrect(state) {
      state.status = 'correct';
    },
  },
});

export const {
  reset,
  startRound,
  instructionDone,
  chooseWrong,
  wrongDone,
  chooseCorrect,
} = pickSyllableSlice.actions;
