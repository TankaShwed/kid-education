import type { TTSProvider } from '@/domain/tts';

/** Контекст для саг (TTS и вызов следующего раунда без циклического импорта). */
export interface SagaContext {
  tts: TTSProvider;
  store: { dispatch: (action: unknown) => unknown };
  dispatchNextRound: () => void;
}
