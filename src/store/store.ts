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
import { createClassifyLetterRound } from '@/tasks/classify-letter/rounds';
import { createPairSyllableRound } from '@/tasks/pair-syllable/rounds';
import { createReadWordPictureRound } from '@/tasks/read-word-picture/rounds';
import { sessionSlice } from './sessionSlice';
import { pickSyllableSlice } from '@/tasks/pick-syllable/pickSyllableSlice';
import { composeSyllableSlice } from '@/tasks/compose-syllable/composeSyllableSlice';
import { classifyLetterSlice } from '@/tasks/classify-letter/classifyLetterSlice';
import { pairSyllableSlice } from '@/tasks/pair-syllable';
import { readWordPictureSlice } from '@/tasks/read-word-picture';
import { rootSaga } from './sagas/rootSaga';
import type { TTSProvider } from '@/domain/tts';

function createRound(taskType: TaskType, difficulty: DifficultyLevel): Round {
  if (taskType === 'pickSyllable') {
    return createPickSyllableRound(difficulty);
  }
  if (taskType === 'classifyLetter') {
    return createClassifyLetterRound();
  }
  if (taskType === 'pairSyllable') {
    return createPairSyllableRound();
  }
  if (taskType === 'readWordPicture') {
    return createReadWordPictureRound();
  }
  return createComposeSyllableRound();
}

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    pickSyllable: pickSyllableSlice.reducer,
    composeSyllable: composeSyllableSlice.reducer,
    classifyLetter: classifyLetterSlice.reducer,
    pairSyllable: pairSyllableSlice.reducer,
    readWordPicture: readWordPictureSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(sagaMiddleware),
});

/** Создать отдельный store с сагами (для Storybook). Начальное состояние задаётся dispatch после создания. */
export function createStoreForStory(tts: TTSProvider) {
  const storySagaMiddleware = createSagaMiddleware();
  const storyStore = configureStore({
    reducer: {
      session: sessionSlice.reducer,
      pickSyllable: pickSyllableSlice.reducer,
      composeSyllable: composeSyllableSlice.reducer,
      classifyLetter: classifyLetterSlice.reducer,
      pairSyllable: pairSyllableSlice.reducer,
      readWordPicture: readWordPictureSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true }).concat(storySagaMiddleware),
  });
  storySagaMiddleware.run(rootSaga, {
    tts,
    store: storyStore,
    dispatchNextRound: () => storyStore.dispatch(nextRound()),
  });
  return storyStore;
}

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
  } else if (round.type === 'classifyLetter') {
    dispatch(classifyLetterSlice.actions.reset(round));
  } else if (round.type === 'pairSyllable') {
    dispatch(pairSyllableSlice.actions.reset(round));
  } else if (round.type === 'readWordPicture') {
    dispatch(readWordPictureSlice.actions.reset(round));
  } else {
    dispatch(composeSyllableSlice.actions.reset(round));
  }
};

/** Запуск саг (передать TTS после создания store). */
export function runSagas(tts: TTSProvider) {
  sagaMiddleware.run(rootSaga, {
    tts,
    store,
    dispatchNextRound: () => store.dispatch(nextRound()),
  });
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
