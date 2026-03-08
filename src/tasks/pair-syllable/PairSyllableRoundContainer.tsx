import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { PairSyllableRoundView } from './PairSyllableRoundView';
import type { DropPayload } from './PairSyllableRoundView';
import { pairSyllableSlice } from './pairSyllableSlice';

/**
 * Контейнер задания «Сложи слог»: передаёт в store только сырые данные дропа (dropOccurred).
 * Валидация «согласная слева, гласная справа» и склейка — в саге.
 */
export function PairSyllableRoundContainer() {
  const dispatch = useAppDispatch();
  const round = useAppSelector((s) =>
    s.session.currentRound?.type === 'pairSyllable'
      ? s.session.currentRound
      : null
  );
  const {
    phase,
    letters,
    formedSyllables,
    targetFind,
    hasStarted,
    spoken,
    wrongSyllableId,
  } = useAppSelector((s) => s.pairSyllable);

  const handleStart = useCallback(() => {
    dispatch(pairSyllableSlice.actions.startRound());
  }, [dispatch]);

  const handleDrop = useCallback(
    (payload: DropPayload) => {
      dispatch(pairSyllableSlice.actions.placeLetter(payload));
    },
    [dispatch]
  );

  const handleChooseSyllable = useCallback(
    (syllableId: string) => {
      if (!round || round.type !== 'pairSyllable') return;
      const formed = formedSyllables.find((s) => s.id === syllableId);
      if (!formed) return;
      if (targetFind !== null && formed.syllable === targetFind) {
        dispatch(pairSyllableSlice.actions.chooseCorrect());
      } else {
        dispatch(pairSyllableSlice.actions.chooseWrong(syllableId));
      }
    },
    [dispatch, formedSyllables, round, targetFind]
  );

  if (!round) return null;

  return (
    <PairSyllableRoundView
      round={round}
      phase={phase}
      letters={letters}
      formedSyllables={formedSyllables}
      targetSyllable={targetFind ?? ''}
      hasStarted={hasStarted}
      spoken={spoken}
      wrongSyllableId={wrongSyllableId}
      onStart={handleStart}
      onDrop={handleDrop}
      onChooseSyllable={handleChooseSyllable}
    />
  );
}
