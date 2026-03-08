import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SYLLABLE_RATE } from '@/domain/tts';
import { splitWordIntoParts } from '@/domain/wordSyllables';
import type { SagaContext } from '@/store/sagaContext';
import type { ReadWordPictureRound } from '@/domain/types';
import { readWordPictureSlice } from './readWordPictureSlice';

const INSTRUCTION = 'Прочитай слово и выбери картинку';

function* playInstruction(_action: unknown, context: SagaContext) {
  const { tts } = context;
  const state: {
    session: { currentRound: ReadWordPictureRound | null };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type !== 'readWordPicture') return;
  try {
    yield call([tts, tts.speak], INSTRUCTION);
    yield put(readWordPictureSlice.actions.instructionDone());
  } catch {
    yield put(readWordPictureSlice.actions.instructionDone());
  }
}

function* playWordByParts(_action: unknown, context: SagaContext) {
  const { tts } = context;
  const state: {
    session: { currentRound: ReadWordPictureRound | null };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type !== 'readWordPicture') return;
  const parts = splitWordIntoParts(round.word);
  try {
    for (const part of parts) {
      yield call([tts, tts.speak], part.toLowerCase(), { rate: SYLLABLE_RATE });
    }
  } finally {
    yield put(readWordPictureSlice.actions.readWordDone());
  }
}

function* playWrongFeedback(
  action: ReturnType<typeof readWordPictureSlice.actions.chooseWrong>,
  context: SagaContext
) {
  const { tts } = context;
  const state: {
    session: { currentRound: ReadWordPictureRound | null };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type !== 'readWordPicture') return;
  const chosenId = action.payload;
  const chosen = round.options.find((o) => o.id === chosenId);
  try {
    yield call([tts, tts.speak], 'Нет. Выбери картинку к слову.');
    if (chosen) {
      yield call([tts, tts.speak], chosen.alt.toLowerCase(), {
        rate: SYLLABLE_RATE,
      });
    }
    yield put(readWordPictureSlice.actions.wrongDone());
  } catch {
    yield put(readWordPictureSlice.actions.wrongDone());
  }
}

function* playCorrectAndNextRound(_action: unknown, context: SagaContext) {
  const { tts, dispatchNextRound } = context;
  try {
    yield call([tts, tts.speak], 'Правильно');
  } catch {
    // ignore
  }
  dispatchNextRound();
}

/**
 * Сага задания «Прочитай слово и выбери картинку».
 *
 * @remarks
 * - startRound — озвучивает инструкцию, диспатчит instructionDone.
 * - readWord — озвучивает слово по частям (splitWordIntoParts), диспатчит readWordDone.
 * - chooseWrong — озвучивает фидбек, диспатчит wrongDone.
 * - chooseCorrect — озвучивает «Правильно», dispatchNextRound().
 */
export function* readWordPictureSaga(context: SagaContext) {
  yield takeLatest(
    readWordPictureSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
  yield takeLatest(
    readWordPictureSlice.actions.readWord.type as never,
    function* (a: unknown) {
      yield* playWordByParts(a, context);
    }
  );
  yield takeLatest(
    readWordPictureSlice.actions.chooseWrong.type as never,
    function* (a: ReturnType<typeof readWordPictureSlice.actions.chooseWrong>) {
      yield* playWrongFeedback(a, context);
    }
  );
  yield takeLatest(
    readWordPictureSlice.actions.chooseCorrect.type as never,
    function* (a: unknown) {
      yield* playCorrectAndNextRound(a, context);
    }
  );
}
