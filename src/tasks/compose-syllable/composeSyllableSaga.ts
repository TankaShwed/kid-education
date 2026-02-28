import { call, put, select, takeLatest } from 'redux-saga/effects';
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
  const target = round.target.toLowerCase();
  try {
    yield call([tts, tts.speak], `${PHRASE} ${target}`);
    yield put(composeSyllableSlice.actions.instructionDone());
  } catch {
    yield put(composeSyllableSlice.actions.instructionDone());
  }
}

/**
 * Сага задания «Собери слог».
 *
 * @remarks
 * Слушает экшен startRound — озвучивает «Собери слог» и целевой слог, диспатчит instructionDone.
 * Переход к следующему раунду при правильном ответе пока вызывается из UI (onCorrect -> nextRound).
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
}
