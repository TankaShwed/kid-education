import { fork } from 'redux-saga/effects';
import type { SagaContext } from '../sagaContext';
import { pickSyllableSaga } from '@/tasks/pick-syllable/pickSyllableSaga';
import { composeSyllableSaga } from '@/tasks/compose-syllable/composeSyllableSaga';

export type { SagaContext } from '../sagaContext';

export function* rootSaga(context: SagaContext) {
  yield fork(pickSyllableSaga, context);
  yield fork(composeSyllableSaga, context);
}
