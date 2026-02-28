import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, nextRound } from '@/store/store';
import { ComposeSyllableRound } from './ComposeSyllableRound';
import type { TTSProvider } from '@/domain/tts';

interface ComposeSyllableRoundContainerProps {
  tts: TTSProvider;
}

/**
 * Контейнер задания «Собери слог»: берёт раунд из session.currentRound, передаёт TTS и onCorrect (nextRound) в компонент.
 *
 * @remarks Рендерится в App при currentRound.type === 'composeSyllable'. TTS передаётся снаружи (создаётся в App/main).
 */
export function ComposeSyllableRoundContainer({
  tts,
}: ComposeSyllableRoundContainerProps) {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'composeSyllable'
      ? s.session.currentRound
      : null
  );

  const handleCorrect = useCallback(() => {
    dispatch(nextRound());
  }, [dispatch]);

  if (!round) return null;

  return (
    <ComposeSyllableRound round={round} tts={tts} onCorrect={handleCorrect} />
  );
}
