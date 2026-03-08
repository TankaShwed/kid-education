import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ReadWordPictureRound } from './types';
import type { PictureOption } from './types';

/**
 * Состояние задания «Прочитай слово и выбери картинку» в store (ключ `readWordPicture`).
 *
 * @remarks
 * - `options` — варианты на экране; при ошибке выбранный вариант убирается.
 * - `status` — idle (ожидание выбора), wrong (озвучивается фидбек), correct (озвучивается «Правильно», затем следующий раунд).
 * - `hasStarted` / `spoken` — раунд начат и инструкция озвучена.
 */
export interface ReadWordPictureState {
  options: PictureOption[];
  status: 'idle' | 'correct' | 'wrong';
  hasStarted: boolean;
  spoken: boolean;
}

const initialState: ReadWordPictureState = {
  options: [],
  status: 'idle',
  hasStarted: false,
  spoken: false,
};

export const readWordPictureSlice = createSlice({
  name: 'readWordPicture',
  initialState,
  reducers: {
    /** Сброс при новом раунде; вызывается из nextRound thunk. */
    reset(_state, action: PayloadAction<ReadWordPictureRound>) {
      return {
        options: [...action.payload.options],
        status: 'idle',
        hasStarted: false,
        spoken: false,
      };
    },
    /** Пользователь нажал «Начать»; сага озвучивает инструкцию, затем instructionDone. */
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    /** Сага закончила озвучку инструкции. */
    instructionDone(state) {
      state.spoken = true;
    },
    /** Пользователь нажал «Прочитать»; сага озвучивает слово по частям, затем readWordDone. */
    readWord() {},
    /** Сага закончила озвучку слова. */
    readWordDone() {},
    /** Выбран неверный вариант. Payload — id варианта; сага озвучивает фидбек и диспатчит wrongDone. */
    chooseWrong(state, action: PayloadAction<string>) {
      state.options = state.options.filter((o) => o.id !== action.payload);
      state.status = 'wrong';
    },
    /** Сага закончила озвучку фидбека при ошибке; снова можно выбирать. */
    wrongDone(state) {
      state.status = 'idle';
    },
    /** Выбран верный вариант; сага озвучивает «Правильно» и вызывает dispatchNextRound(). */
    chooseCorrect(state) {
      state.status = 'correct';
    },
  },
});

export const {
  reset,
  startRound,
  instructionDone,
  readWord,
  readWordDone,
  chooseWrong,
  wrongDone,
  chooseCorrect,
} = readWordPictureSlice.actions;
