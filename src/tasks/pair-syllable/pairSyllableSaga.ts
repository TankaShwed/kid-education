import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SYLLABLE_RATE } from '@/domain/tts';
import type { SagaContext } from '@/store/sagaContext';
import type { RootState } from '@/store/store';
import { pairSyllableSlice } from './pairSyllableSlice';

const INSTRUCTION = 'Сложи гласную и согласную в слог.';
const FIND_PHRASE = 'Найди слог';

function* playInstruction(_action: unknown, context: SagaContext) {
  const { tts } = context;
  try {
    yield call([tts, tts.speak], INSTRUCTION);
  } catch {
    // ignore
  }
  yield put(pairSyllableSlice.actions.instructionDone());
}

function* onPairFormed(
  action: ReturnType<typeof pairSyllableSlice.actions.pairFormed>,
  context: SagaContext
) {
  const { tts, store } = context;
  const { syllable } = action.payload;
  try {
    yield call([tts, tts.speak], syllable.toLowerCase(), {
      rate: SYLLABLE_RATE,
    });
  } catch {
    // ignore
  }
  const state: RootState = yield select();
  if (state.pairSyllable.letters.length === 0) {
    yield put(pairSyllableSlice.actions.setPhaseFinding());
    const round = state.session.currentRound;
    if (round?.type === 'pairSyllable') {
      try {
        yield call([tts, tts.speak], FIND_PHRASE);
        yield call([tts, tts.speak], round.targetFind.toLowerCase(), {
          rate: SYLLABLE_RATE,
        });
      } catch {
        // ignore
      }
    }
  }
}

function* onPairRejected(
  action: ReturnType<typeof pairSyllableSlice.actions.pairRejected>,
  context: SagaContext
) {
  const { tts } = context;
  const msg =
    action.payload.reason === 'wrongOrder'
      ? 'В слоге сначала согласная, потом гласная. Гласная должна быть справа.'
      : 'Такой слог не подходит.';
  try {
    yield call([tts, tts.speak], msg);
  } catch {
    // ignore
  }
}

function* onChooseCorrect(_action: unknown, context: SagaContext) {
  const { tts, dispatchNextRound } = context;
  try {
    yield call([tts, tts.speak], 'Правильно');
  } catch {
    // ignore
  }
  dispatchNextRound();
}

function* onChooseWrong(
  _action: ReturnType<typeof pairSyllableSlice.actions.chooseWrong>,
  context: SagaContext
) {
  const { tts } = context;
  const state: RootState = yield select();
  const wrongId = state.pairSyllable.wrongSyllableId;
  const formed = state.pairSyllable.formedSyllables;
  const chosen = wrongId ? formed.find((s) => s.id === wrongId) : null;
  try {
    yield call([tts, tts.speak], 'Это слог ');
    if (chosen) {
      yield call([tts, tts.speak], chosen.syllable.toLowerCase(), {
        rate: SYLLABLE_RATE,
      });
    }
  } catch {
    // ignore
  }
  yield put(pairSyllableSlice.actions.wrongDone());
}

/**
 * Сага задания «Сложи слог».
 *
 * @remarks
 * - startRound — озвучивает инструкцию, instructionDone.
 * - pairFormed — озвучивает слог; при нуле букв — setPhaseFinding и «Найди слог» + targetFind.
 * - pairRejected — озвучивает фидбек по reason.
 * - chooseCorrect — «Правильно», dispatchNextRound.
 * - chooseWrong — озвучивает выбранный слог, wrongDone.
 */
export function* pairSyllableSaga(context: SagaContext) {
  yield takeLatest(
    pairSyllableSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
  yield takeLatest(
    pairSyllableSlice.actions.pairFormed.type as never,
    function* (a: ReturnType<typeof pairSyllableSlice.actions.pairFormed>) {
      yield* onPairFormed(a, context);
    }
  );
  yield takeLatest(
    pairSyllableSlice.actions.pairRejected.type as never,
    function* (a: ReturnType<typeof pairSyllableSlice.actions.pairRejected>) {
      yield* onPairRejected(a, context);
    }
  );
  yield takeLatest(
    pairSyllableSlice.actions.chooseCorrect.type as never,
    function* (a: unknown) {
      yield* onChooseCorrect(a, context);
    }
  );
  yield takeLatest(
    pairSyllableSlice.actions.chooseWrong.type as never,
    function* (a: ReturnType<typeof pairSyllableSlice.actions.chooseWrong>) {
      yield* onChooseWrong(a, context);
    }
  );
}
