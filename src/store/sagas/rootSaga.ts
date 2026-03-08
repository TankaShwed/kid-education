import { fork } from 'redux-saga/effects';
import type { SagaContext } from '../sagaContext';
import { pickSyllableSaga } from '@/tasks/pick-syllable/pickSyllableSaga';
import { composeSyllableSaga } from '@/tasks/compose-syllable/composeSyllableSaga';
import { classifyLetterSaga } from '@/tasks/classify-letter/classifyLetterSaga';
import { pairSyllableSaga } from '@/tasks/pair-syllable/pairSyllableSaga';
import { readWordPictureSaga } from '@/tasks/read-word-picture/readWordPictureSaga';

export type { SagaContext } from '../sagaContext';

export function* rootSaga(context: SagaContext) {
  yield fork(pickSyllableSaga, context);
  yield fork(composeSyllableSaga, context);
  yield fork(classifyLetterSaga, context);
  yield fork(pairSyllableSaga, context);
  yield fork(readWordPictureSaga, context);
}
