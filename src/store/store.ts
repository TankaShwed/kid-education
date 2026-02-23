import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { ThunkAction } from '@reduxjs/toolkit';
import type { Round, TaskType, DifficultyLevel } from '@/domain/types';
import {
  createPickSyllableRound,
  createComposeSyllableRound,
} from '@/domain/rounds';
import { sessionSlice } from './sessionSlice';
import { pickSyllableSlice } from './pickSyllableSlice';
import { composeSyllableSlice } from './composeSyllableSlice';
import { rootSaga } from './sagas/rootSaga';
import type { TTSProvider } from '@/domain/tts';

function createRound(taskType: TaskType, difficulty: DifficultyLevel): Round {
  if (taskType === 'pickSyllable') {
    return createPickSyllableRound(difficulty);
  }
  return createComposeSyllableRound();
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    pickSyllable: pickSyllableSlice.reducer,
    composeSyllable: composeSyllableSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, UnknownAction>;

/** Thunk: создать новый раунд и сбросить состояние задания */
export const nextRound = (): AppThunk => (dispatch, getState) => {
  const { taskType, difficulty } = getState().session;
  const round = createRound(taskType, difficulty);
  dispatch(sessionSlice.actions.setRound(round));
  if (round.type === 'pickSyllable') {
    dispatch(pickSyllableSlice.actions.reset(round));
  } else {
    dispatch(composeSyllableSlice.actions.reset(round));
  }
};

/** Запуск саг (передать TTS после создания store). */
export function runSagas(tts: TTSProvider) {
  sagaMiddleware.run(rootSaga, { tts, store });
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
