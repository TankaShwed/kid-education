import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, nextRound } from '@/store/store';
import { ComposeSyllableRound } from './ComposeSyllableRound';
import type { TTSProvider } from '@/domain/tts';

interface ComposeSyllableRoundContainerProps {
  tts: TTSProvider;
}

/** Контейнер «Собери слог»: round и onCorrect из Redux, TTS пока в компоненте. */
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
