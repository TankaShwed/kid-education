import { fork } from 'redux-saga/effects';
import { pickSyllableSaga } from './pickSyllableSaga';
import { composeSyllableSaga } from './composeSyllableSaga';
import type { TTSProvider } from '@/domain/tts';
import type { store } from '../store';

export interface SagaContext {
  tts: TTSProvider;
  store: typeof store;
}

export function* rootSaga(context: SagaContext) {
  yield fork(pickSyllableSaga, context);
  yield fork(composeSyllableSaga, context);
}
