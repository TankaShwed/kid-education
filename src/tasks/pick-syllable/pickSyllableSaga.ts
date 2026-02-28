import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SYLLABLE_RATE } from '@/domain/tts';
import type { SagaContext } from '@/store/sagaContext';
import { pickSyllableSlice } from './pickSyllableSlice';

const PHRASE = 'Выбери слог';

function* playInstruction(_action: unknown, context: SagaContext) {
  const { tts } = context;
  const state: {
    session: { currentRound: { type: string; target: string } | null };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type !== 'pickSyllable') return;
  const syllable = round.target.toLowerCase();
  try {
    yield call([tts, tts.speak], PHRASE);
    yield call([tts, tts.speak], syllable, { rate: SYLLABLE_RATE });
    yield put(pickSyllableSlice.actions.instructionDone());
  } catch {
    yield put(pickSyllableSlice.actions.instructionDone());
  }
}

function* playWrongFeedback(
  action: ReturnType<typeof pickSyllableSlice.actions.chooseWrong>,
  context: SagaContext
) {
  const { tts } = context;
  const chosen = action.payload;
  const hint =
    chosen.length >= 2
      ? ` ${chosen.toLowerCase()} — это ${chosen[0]!.toLowerCase()} и ${chosen[1]!.toLowerCase()}.`
      : '';
  const syllable = chosen.toLowerCase();
  try {
    yield call([tts, tts.speak], 'Это слог ');
    yield call([tts, tts.speak], syllable, { rate: SYLLABLE_RATE });
    if (hint) yield call([tts, tts.speak], hint.trim());
    yield put(pickSyllableSlice.actions.wrongDone());
  } catch {
    yield put(pickSyllableSlice.actions.wrongDone());
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
 * Сага задания «Выбери слог».
 *
 * @remarks
 * Слушает экшены slice:
 * - `startRound` — озвучивает «Выбери слог» и целевой слог, диспатчит instructionDone.
 * - `chooseWrong` — озвучивает фидбек по выбранному слогу, диспатчит wrongDone.
 * - `chooseCorrect` — озвучивает «Правильно», вызывает context.dispatchNextRound().
 *
 * @param context — TTS, store, dispatchNextRound (см. SagaContext)
 */
export function* pickSyllableSaga(context: SagaContext) {
  yield takeLatest(
    pickSyllableSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
  yield takeLatest(
    pickSyllableSlice.actions.chooseWrong.type as never,
    function* (a: ReturnType<typeof pickSyllableSlice.actions.chooseWrong>) {
      yield* playWrongFeedback(a, context);
    }
  );
  yield takeLatest(
    pickSyllableSlice.actions.chooseCorrect.type as never,
    function* (a: unknown) {
      yield* playCorrectAndNextRound(a, context);
    }
  );
}
