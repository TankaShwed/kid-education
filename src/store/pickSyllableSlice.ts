import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PickSyllableRound, Syllable } from '@/domain/types';

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
    reset(_state, action: PayloadAction<PickSyllableRound>) {
      return {
        options: [...action.payload.options],
        status: 'idle',
        hasStarted: false,
        spoken: false,
      };
    },
    startRound(state) {
      state.hasStarted = true;
      state.spoken = false;
    },
    instructionDone(state) {
      state.spoken = true;
    },
    chooseWrong(state, action: PayloadAction<Syllable>) {
      state.options = state.options.filter((s) => s !== action.payload);
      state.status = 'wrong';
    },
    wrongDone(state) {
      state.status = 'idle';
    },
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
