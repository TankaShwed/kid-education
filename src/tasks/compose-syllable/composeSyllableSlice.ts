import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ComposeSyllableRound } from '@/domain/types';

/**
 * Состояние задания «Собери слог» в store (ключ `composeSyllable`).
 *
 * @remarks
 * Слоты и пул букв; status — idle / wrong / correct. hasStarted и spoken используются сагой
 * (озвучка инструкции по startRound, instructionDone). chooseCorrect/chooseWrong/wrongDone — сценарий фидбека.
 */
export interface ComposeSyllableState {
  slots: (string | null)[];
  pool: string[];
  status: 'idle' | 'correct' | 'wrong';
  hasStarted: boolean;
  spoken: boolean;
}

const initialState: ComposeSyllableState = {
  slots: [],
  pool: [],
  status: 'idle',
  hasStarted: false,
  spoken: false,
};

export const composeSyllableSlice = createSlice({
  name: 'composeSyllable',
  initialState,
  reducers: {
    /** Сброс при новом раунде; вызывается из nextRound thunk. Payload — новый раунд. */
    reset(_state, action: PayloadAction<ComposeSyllableRound>) {
      return {
        slots: Array(action.payload.target.length).fill(null),
        pool: [...action.payload.letters],
        status: 'idle',
        hasStarted: false,
        spoken: false,
      };
    },
    /** Пользователь начал раунд; сага озвучивает «Собери слог» + целевой слог, диспатчит instructionDone. */
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    /** Сага закончила озвучку инструкции. */
    instructionDone(state) {
      state.spoken = true;
    },
    /** Обновление слотов (для будущего переноса логики из UI в Redux). */
    setSlots(state, action: PayloadAction<(string | null)[]>) {
      state.slots = action.payload;
    },
    /** Обновление пула букв. */
    setPool(state, action: PayloadAction<string[]>) {
      state.pool = action.payload;
    },
    /** Установка статуса (idle / wrong / correct). */
    setStatus(state, action: PayloadAction<'idle' | 'correct' | 'wrong'>) {
      state.status = action.payload;
    },
    /** Верный слог собран; сага озвучивает «Правильно» и вызывает dispatchNextRound. */
    chooseCorrect(state) {
      state.status = 'correct';
    },
    /** Неверный слог собран. Payload — собранная строка; сага озвучивает фидбек и диспатчит wrongDone. */
    chooseWrong(state, _action: PayloadAction<string>) {
      state.status = 'wrong';
    },
    /** Сага закончила озвучку при ошибке; сброс слотов и пула для повтора. */
    wrongDone(
      state,
      action: PayloadAction<{ targetLength: number; letters: string[] }>
    ) {
      const { targetLength, letters } = action.payload;
      state.slots = Array(targetLength).fill(null);
      state.pool = [...letters].sort(() => Math.random() - 0.5);
      state.status = 'idle';
    },
  },
});

export const {
  reset,
  startRound,
  instructionDone,
  setSlots,
  setPool,
  setStatus,
  chooseCorrect,
  chooseWrong,
  wrongDone,
} = composeSyllableSlice.actions;
