import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SYLLABLE_RATE } from '@/domain/tts';
import type { SagaContext } from '@/store/sagaContext';
import { composeSyllableSlice } from './composeSyllableSlice';

const PHRASE = 'Собери слог';

function* playInstruction(_action: unknown, context: SagaContext) {
  const { tts } = context;
  const state: {
    session: { currentRound: { type: string; target: string } | null };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type !== 'composeSyllable') return;
  const syllable = round.target.toLowerCase();
  try {
    yield call([tts, tts.speak], PHRASE);
    yield call([tts, tts.speak], syllable, { rate: SYLLABLE_RATE });
    yield put(composeSyllableSlice.actions.instructionDone());
  } catch {
    yield put(composeSyllableSlice.actions.instructionDone());
  }
}

function* playCorrectAndNextRound(_action: unknown, context: SagaContext) {
  const { tts, dispatchNextRound } = context;
  try {
    yield call([tts, tts.speak], 'Правильно! Молодец!');
  } catch {
    // ignore
  }
  dispatchNextRound();
}

function* playWrongFeedback(
  action: ReturnType<typeof composeSyllableSlice.actions.chooseWrong>,
  context: SagaContext
) {
  const { tts } = context;
  const composed = action.payload.toLowerCase();
  try {
    yield call(
      [tts, tts.speak],
      `Это слог ${composed}. Попробуй ещё раз.`
    );
  } catch {
    // ignore
  }
  const state: {
    session: {
      currentRound: { type: string; target: string; letters: string[] } | null;
    };
  } = yield select();
  const round = state.session.currentRound;
  if (round?.type === 'composeSyllable') {
    yield put(
      composeSyllableSlice.actions.wrongDone({
        targetLength: round.target.length,
        letters: round.letters,
      })
    );
  }
}

/**
 * Сага задания «Собери слог».
 *
 * @remarks
 * Слушает экшены slice:
 * - startRound — озвучивает «Собери слог» и целевой слог, диспатчит instructionDone.
 * - chooseCorrect — озвучивает «Правильно! Молодец!», вызывает dispatchNextRound().
 * - chooseWrong — озвучивает фидбек по собранному слогу, диспатчит wrongDone.
 *
 * @param context — TTS, store, dispatchNextRound (см. SagaContext)
 */
export function* composeSyllableSaga(context: SagaContext) {
  yield takeLatest(
    composeSyllableSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
  yield takeLatest(
    composeSyllableSlice.actions.chooseCorrect.type as never,
    function* (a: unknown) {
      yield* playCorrectAndNextRound(a, context);
    }
  );
  yield takeLatest(
    composeSyllableSlice.actions.chooseWrong.type as never,
    function* (a: ReturnType<typeof composeSyllableSlice.actions.chooseWrong>) {
      yield* playWrongFeedback(a, context);
    }
  );
}
