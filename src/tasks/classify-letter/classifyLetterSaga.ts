import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { isVowel } from '@/domain/letters';
import { SYLLABLE_RATE } from '@/domain/tts';
import type { SagaContext } from '@/store/sagaContext';
import type { RootState } from '@/store/store';
import { classifyLetterSlice } from './classifyLetterSlice';

const INSTRUCTION =
  'Разнеси буквы: гласные — в красную область, согласные — в синюю.';
const WRONG_DONE_DELAY_MS = 600;

function* playInstruction(_action: unknown, context: SagaContext) {
  const { tts } = context;
  try {
    yield call([tts, tts.speak], INSTRUCTION);
  } catch {
    // ignore
  }
  yield put(classifyLetterSlice.actions.instructionDone());
}

function* onSpeakLetter(
  action: ReturnType<typeof classifyLetterSlice.actions.speakLetter>,
  context: SagaContext
) {
  const { tts } = context;
  try {
    yield call([tts, tts.speak], action.payload);
  } catch {
    // ignore
  }
}

function* onDropInZone(
  action: ReturnType<typeof classifyLetterSlice.actions.dropInZone>,
  context: SagaContext
) {
  const { tts, dispatchNextRound } = context;
  const { letterId, result } = action.payload;

  if (result === 'correct') {
    const state: RootState = yield select();
    const item = state.classifyLetter.items.find((i) => i.id === letterId);
    if (!item) return;
    const kind = isVowel(item.letter) ? 'гласная' : 'согласная';
    try {
      yield call([tts, tts.speak], 'Правильно');
      yield call([tts, tts.speak], item.letter, { rate: SYLLABLE_RATE });
      yield call([tts, tts.speak], kind);
    } catch {
      // ignore
    }
    const stateAfter: RootState = yield select();
    const allCorrect = stateAfter.classifyLetter.items.every(
      (i) => i.placedZone !== null
    );
    if (allCorrect) {
      try {
        yield call([tts, tts.speak], 'Молодец!');
      } catch {
        // ignore
      }
      dispatchNextRound();
    }
  } else {
    try {
      yield call([tts, tts.speak], 'Неправильно');
    } catch {
      // ignore
    }
    yield delay(WRONG_DONE_DELAY_MS);
    yield put(classifyLetterSlice.actions.wrongDone());
  }
}

/**
 * Сага задания «Гласная или согласная».
 *
 * @remarks
 * - startRound — озвучивает инструкцию, диспатчит instructionDone.
 * - speakLetter — озвучивает букву при захвате.
 * - dropInZone (result correct) — озвучивает фидбек, при всех правильных — «Молодец!» и dispatchNextRound.
 * - dropInZone (result wrong) — озвучивает «Неправильно», затем wrongDone.
 */
export function* classifyLetterSaga(context: SagaContext) {
  yield takeLatest(
    classifyLetterSlice.actions.startRound.type as never,
    function* (a: unknown) {
      yield* playInstruction(a, context);
    }
  );
  yield takeLatest(
    classifyLetterSlice.actions.speakLetter.type as never,
    function* (a: ReturnType<typeof classifyLetterSlice.actions.speakLetter>) {
      yield* onSpeakLetter(a, context);
    }
  );
  yield takeLatest(
    classifyLetterSlice.actions.dropInZone.type as never,
    function* (a: ReturnType<typeof classifyLetterSlice.actions.dropInZone>) {
      yield* onDropInZone(a, context);
    }
  );
}
