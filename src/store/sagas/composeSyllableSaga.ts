import { call, put, select, takeLatest } from 'redux-saga/effects';
import type { SagaContext } from './rootSaga';
import { composeSyllableSlice } from '../composeSyllableSlice';
import type { RootState } from '../store';

const PHRASE = 'Собери слог';

function* playInstruction(
  _action: unknown,
  context: SagaContext
) {
  const { tts } = context;
  const state: RootState = yield select();
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

export function* composeSyllableSaga(context: SagaContext) {
  yield takeLatest(
    composeSyllableSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
}
