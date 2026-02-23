import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ComposeSyllableRound } from '@/domain/types';

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
    reset(_state, action: PayloadAction<ComposeSyllableRound>) {
      return {
        slots: Array(action.payload.target.length).fill(null),
        pool: [...action.payload.letters],
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
    setSlots(state, action: PayloadAction<(string | null)[]>) {
      state.slots = action.payload;
    },
    setPool(state, action: PayloadAction<string[]>) {
      state.pool = action.payload;
    },
    setStatus(
      state,
      action: PayloadAction<'idle' | 'correct' | 'wrong'>
    ) {
      state.status = action.payload;
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
} = composeSyllableSlice.actions;
